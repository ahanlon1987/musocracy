//
//  Playlist.m
//  Simple Player
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import "PlaylistCollection.h"
#import "AFJSONRequestOperation.h"
#import "Simple_PlayerAppDelegate.h"

@class Simple_PlayerAppDelegate;

@implementation PlaylistCollection

@synthesize locationId;
@synthesize playlist;
@synthesize currentTrack;
@synthesize nextTrack;

-(id) init {
    self = [super init];
    return self;
}

-(id) initWithLocationId:(NSString *)theLocationId {
    if (self = [super init]) {
        locationId = theLocationId;
    }
    return self;
}

-(void) loadTracks {
    NSString * url = [NSString stringWithFormat:@"http://localhost:3000/location/%@/votes?limit=10&excludePlayed=true", self.locationId];
    
    NSLog(@"URL: %@", url);
    NSURLRequest *request = [NSURLRequest requestWithURL:
                             [NSURL URLWithString:url]];
    
    AFJSONRequestOperation *operation = [AFJSONRequestOperation
                                         JSONRequestOperationWithRequest:request
                                         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
                                             [self processData:JSON];
                                         } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
                                             NSLog(@"Failed to load playlist; %@", error.localizedDescription);
                                         }];

    [operation start];    
}

-(void) processData:(id)data {
    NSArray *playlist = [data valueForKeyPath:@"playlist"];
    NSMutableArray *tracks = [[NSMutableArray alloc] init];
    
    for (NSDictionary * track in playlist) {
        
        NSString *trackId = (NSString *) [track valueForKeyPath:@"trackId"];
        NSString *name = (NSString *) [track valueForKeyPath:@"name"];
        NSString *artist = (NSString *) [track valueForKeyPath:@"artist"];
        
        Track * trackObj = [[Track alloc] init];
        trackObj.trackId = trackId;
        trackObj.trackName = name;
        trackObj.artist = artist;
        
        [tracks addObject:trackObj];
        
        NSLog(@"Track Name: %@,  ID: %@", name, trackId);
    }
    
    Track *firstTrack = [tracks objectAtIndex:0];
    if ([self hasBeenPlayed:firstTrack]) {
        [tracks removeObjectAtIndex:0];
    }
    self.playlist = tracks;
    
    Simple_PlayerAppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    [appDelegate playlistReady];
}

-(BOOL) hasBeenPlayed:(Track *) track {
    if (([self.currentTrack.trackId isEqualToString:track.trackId])) {
        return YES;
    }
    return NO;
}

-(Track *) dequeueNextTrack {
    Track *track = [self.playlist objectAtIndex:0];
    self.currentTrack = track;
    [self markTrackAsPlayed:track];
    
    // kick off an asynchronous load of upcoming tracks
    [self loadTracks];
    
    return track;
}

-(void) markTrackAsPlayed:(Track *) track {
    NSString * url = [NSString stringWithFormat:@"http://localhost:3000/location/%@/track/%@", self.locationId, track.trackId];
    
    NSLog(@"URL: %@", url);
//    self.responseData = [NSMutableData data];
    NSURLRequest *request = [NSURLRequest requestWithURL:
                             [NSURL URLWithString:url]];
    [[NSURLConnection alloc] initWithRequest:request delegate:self];
    AFJSONRequestOperation *jsonReq = [AFJSONRequestOperation
                                       JSONRequestOperationWithRequest:request
                                       success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
                                           NSLog(@"Mark as played returned for track %@", track.trackId);
                                       } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
                                           NSLog(@"Error marking track %@ as played.", track.trackId);
                                       }];
    [jsonReq start];
}


@end
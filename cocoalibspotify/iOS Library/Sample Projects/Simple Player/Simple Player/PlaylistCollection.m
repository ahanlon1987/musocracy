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
    [self loadTracksWithSuccess:^(NSString* msg) {
        NSLog(@"Successfully loaded: %@", msg);
    }];
}

-(void) loadTracksWithSuccess:(void (^)(NSString* msg))onSuccess {
    NSString * url = [NSString stringWithFormat:@"http://192.168.0.101:3000/location/%@/votes?limit=10&excludePlayed=true", self.locationId];
    
    NSLog(@"URL: %@", url);
    NSURLRequest *request = [NSURLRequest requestWithURL:
                             [NSURL URLWithString:url]];
    
    AFJSONRequestOperation *operation = [AFJSONRequestOperation
                                         JSONRequestOperationWithRequest:request
                                         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
                                             [self processData:JSON];
                                             NSLog(@"Finished processing data.");
                                             if(onSuccess) {
                                                 onSuccess(@"Message should go here");
                                             }
                                         } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
                                             NSLog(@"Failed to load playlist; %@", error.localizedDescription);
                                         }];

    [operation start];    
}

-(void) processData:(id)data {
    NSArray *playlistArray = [data valueForKeyPath:@"playlist"];
    NSMutableArray *tracks = [[NSMutableArray alloc] init];
    
    for (NSDictionary * track in playlistArray) {
        
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
    
    
//    Track *firstTrack = [tracks objectAtIndex:0];
//    if ([self hasBeenPlayed:firstTrack]) {
//        [tracks removeObjectAtIndex:0];
//    }
    
    self.playlist = tracks;
    if (tracks.count > 0) {
        self.nextTrack = [tracks objectAtIndex:0];
    }
    else {
        self.nextTrack = nil;
    }
//    self.nextTrack = firstTrack;
}

-(BOOL) hasBeenPlayed:(Track *) track {
    if (([self.currentTrack.trackId isEqualToString:track.trackId])) {
        return YES;
    }
    return NO;
}

-(Track *) dequeueNextTrack {
    Track *track = nil;
    if (self.playlist.count > 0) {
        track = [self.playlist objectAtIndex:0];
        self.currentTrack = track;
        [self markTrackAsPlayed:track];
    }
    else {
        [self loadTracks];
    }
    
    return track;
}

-(void) markTrackAsPlayed:(Track *) track {
    NSString * url = [NSString stringWithFormat:@"http://192.168.0.101:3000/location/%@/track/%@", self.locationId, track.trackId];
    
    NSLog(@"URL: %@", url);
//    self.responseData = [NSMutableData data];
    NSURLRequest *request = [NSURLRequest requestWithURL:
                             [NSURL URLWithString:url]];
    [[NSURLConnection alloc] initWithRequest:request delegate:self];
    AFJSONRequestOperation *jsonReq = [AFJSONRequestOperation
                                       JSONRequestOperationWithRequest:request
                                       success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
                                           NSLog(@"Mark as played returned for track %@", track.trackId);
                                           [self processData:JSON];
                                       } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
                                           NSLog(@"Error marking track %@ as played.", track.trackId);
                                       }];
    [jsonReq start];
}


@end

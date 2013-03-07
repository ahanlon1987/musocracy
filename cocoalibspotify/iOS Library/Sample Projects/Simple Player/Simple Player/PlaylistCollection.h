//
//  Playlist.h
//  Simple Player
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "Track.h"

@interface PlaylistCollection : NSObject

@property NSString *locationId;
@property NSArray * playlist;
@property Track *currentTrack;
@property Track *nextTrack;

-(id) initWithLocationId: (NSString *)theLocationId;
-(void) loadTracks;
-(void) loadTracksWithSuccess:(void (^)(NSString* msg))onSuccess;
-(Track *) dequeueNextTrack;

@end

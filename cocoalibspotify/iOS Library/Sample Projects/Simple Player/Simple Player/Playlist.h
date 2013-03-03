//
//  Playlist.h
//  Simple Player
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "Track.h"

@interface Playlist : NSObject

@property NSArray * playlist;

-(void) refreshSongs;
-(Track *) popTrack;
-(void) addTrack:(Track *)track;

@end

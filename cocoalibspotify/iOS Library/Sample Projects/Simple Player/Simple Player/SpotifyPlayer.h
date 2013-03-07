//
//  SpotifyPlayer.h
//  Simple Player
//
//  Created by Phil MacCart on 3/5/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//d

#import <Foundation/Foundation.h>
#import "CocoaLibSpotify.h"
#import "PlaylistCollection.h"

@interface SpotifyPlayer : NSObject <SPPlaylistDelegate, SPSessionPlaybackDelegate> {
    SPSession *_session;
    SPPlaybackManager *_playbackManager;
	SPTrack *_currentTrack;
    SPPlaylistContainer *_playlistContainer;
    SPPlaylist *_playlist;
    
    NSString *_locationId;
    BOOL _firstLoad;
    PlaylistCollection *_playlistCollection;
}

@property (nonatomic, strong) SPSession *session;
@property (nonatomic, strong) SPTrack *currentTrack;
@property (nonatomic, strong) SPPlaybackManager *playbackManager;
@property (nonatomic, strong) SPPlaylist *playlist;
@property (nonatomic, strong) SPPlaylistContainer *playlistContainer;
@property (nonatomic, strong) NSString *locationId;
@property (nonatomic) BOOL firstLoad;
@property (nonatomic, strong) PlaylistCollection *playlistCollection;

-(id) initWithSession: (SPSession *)theSession;
-(void) togglePlayPause;
-(void) nextTrack;
//-(void) prevTrack;

@end

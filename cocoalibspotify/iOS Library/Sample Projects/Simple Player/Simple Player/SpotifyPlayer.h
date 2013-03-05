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

@interface SpotifyPlayer : NSObject <SPSessionPlaybackDelegate, SPPlaylistDelegate> {
    SPSession *_session;
    SPPlaybackManager *_playbackManager;
	SPTrack *_currentTrack;
    SPPlaylistContainer *_playlistContainer;
    SPPlaylist *_playlist;
}

@property (nonatomic, strong) SPSession *session;
@property (nonatomic, strong) SPTrack *currentTrack;
@property (nonatomic, strong) SPPlaybackManager *playbackManager;
@property (nonatomic, strong) SPPlaylist *playlist;
@property (nonatomic, strong) SPPlaylistContainer *playlistContainer;

@end

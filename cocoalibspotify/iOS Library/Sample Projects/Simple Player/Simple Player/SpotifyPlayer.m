//
//  SpotifyPlayer.m
//  Simple Player
//
//  Created by Phil MacCart on 3/5/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import "SpotifyPlayer.h"

@implementation SpotifyPlayer

@synthesize playbackManager = _playbackManager;
@synthesize currentTrack = _currentTrack;
@synthesize playlist = _playlist;
@synthesize playlistContainer = _playlistContainer;
@synthesize session = _session;

#pragma mark -
#pragma mark SPPlaylistDelegate Methods

-(void) itemsInPlaylistDidUpdateMetadata:(SPPlaylist *)aPlaylist {
    NSLog(@"item in playlist %@ updated its metadata.", aPlaylist.name);
}

-(void) playlist:(SPPlaylist *)aPlaylist didAddItems:(NSArray *)items atIndexes:(NSIndexSet *)newIndexes {
    
    NSLog(@"Playlist %@ added %d items at some indexes", aPlaylist.name, items.count);
}

-(void) playlist:(SPPlaylist *)aPlaylist didMoveItems:(NSArray *)items atIndexes:(NSIndexSet *)oldIndexes toIndexes:(NSIndexSet *)newIndexes {
    
    NSLog(@"Playlist %@ moved %d items at some indexes", aPlaylist.name, items.count);
}

-(void) playlist:(SPPlaylist *)aPlaylist didRemoveItems:(NSArray *)items atIndexes:(NSIndexSet *)theseIndexesArentValidAnymore {
    
    NSLog(@"Playlist %@ deleted %d items at some indexes", aPlaylist.name, items.count);
}

- (void)dealloc {
	
	[self removeObserver:self forKeyPath:@"currentTrack.name"];
	[self removeObserver:self forKeyPath:@"currentTrack.artists"];
	[self removeObserver:self forKeyPath:@"currentTrack.album.cover.image"];
	[self removeObserver:self forKeyPath:@"playbackManager.trackPosition"];
    [self removeObserver:self forKeyPath:@"playlistContainer.playlists"];
	
}


@end

//
//  SpotifyPlayer.m
//  Simple Player
//
//  Created by Phil MacCart on 3/5/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import "SpotifyPlayer.h"
#import <AVFoundation/AVFoundation.h>
#import <MediaPlayer/MediaPlayer.h>

@implementation SpotifyPlayer

@synthesize playbackManager = _playbackManager;
@synthesize currentTrack = _currentTrack;
@synthesize playlist = _playlist;
@synthesize playlistContainer = _playlistContainer;
@synthesize session = _session;

@synthesize locationId = _locationId;
@synthesize firstLoad = _firstLoad;
@synthesize playlistCollection = _playlistCollection;

-(id) initWithSession:(SPSession *)theSession {
    if (self = [super init]) {
        self.session = theSession;
        // Registers this class as the delegate of the audio session.
        [[AVAudioSession sharedInstance] setDelegate: self];
        
        NSError *setCategoryError = nil;
        [[AVAudioSession sharedInstance] setCategory: AVAudioSessionCategoryPlayback error: &setCategoryError];
        if (setCategoryError) {
            NSLog(@"Error setting category! %@", [setCategoryError localizedDescription]);
        }
        
        UInt32 doSetProperty = 0;
        AudioSessionSetProperty (
                                 kAudioSessionProperty_OverrideCategoryMixWithOthers,
                                 sizeof (doSetProperty),
                                 &doSetProperty
                                 );
        
//        NSError *activationError = nil;
//        [[AVAudioSession sharedInstance] setActive: YES error: &activationError];
//        if (activationError) {
//            NSLog(@"Could not activate audio session. %@", [activationError localizedDescription]);
//        }
        
        self.playbackManager = [[SPPlaybackManager alloc] initWithPlaybackSession:self.session];
        [self.playbackManager setDelegate:self];
        //        self.session = [SPSession sharedSession];
        //        [self.session setDelegate:self];
        
//        [self addObserver:self forKeyPath:@"currentTrack.name" options:0 context:nil];
//        [self addObserver:self forKeyPath:@"currentTrack.artists" options:0 context:nil];
//        [self addObserver:self forKeyPath:@"currentTrack.duration" options:0 context:nil];
//        [self addObserver:self forKeyPath:@"currentTrack.album.cover.image" options:0 context:nil];
//        [self addObserver:self forKeyPath:@"playbackManager.trackPosition" options:0 context:nil];
//        [self addObserver:self forKeyPath:@"session.starredPlaylist" options:0 context:nil];
        
        //        [self performSelector:@selector(checkAuth) withObject:nil afterDelay:0.0];
        
        self.locationId = @"1";
        self.firstLoad = YES;
        
        self.playlistCollection = [[PlaylistCollection alloc] initWithLocationId:self.locationId];
        [self.playlistCollection loadTracksWithSuccess:^(NSString *msg) {
            [self onPlaylistReady:msg];
        }];
    }
    
    return self;
}


-(void) onPlaylistReady:(NSString*) msg {
    NSLog(@"On Playlist Ready callback invoked with message=%@", msg);
    Track *track = [self.playlistCollection dequeueNextTrack];
    [self playTrackWithId:track.trackId];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    NSLog(@"Update to %@", keyPath);
//    if ([keyPath isEqualToString:@"currentTrack.name"]) {
////        [self updateCurrentTrackName:self.currentTrack.name];
//	} else if ([keyPath isEqualToString:@"currentTrack.artists"]) {
////        [self updateCurrentTrackArtist:[[self.currentTrack.artists valueForKey:@"name"] componentsJoinedByString:@","]];
//	} else if ([keyPath isEqualToString:@"currentTrack.album.cover.image"]) {
////        [self updateCurrentTrackAlbumCoverArt:self.currentTrack.album.cover.image];
//	} else if ([keyPath isEqualToString:@"currentTrack.duration"]) {
////        [self updateCurrentTrackDuration:self.currentTrack.duration];
//	} else if ([keyPath isEqualToString:@"playbackManager.trackPosition"]) {
////        [self updateCurrentTrackPosition:self.playbackManager.trackPosition];
//    } else if ([keyPath isEqualToString:@"session.starredPlaylist"]) {
////        [self showPlaylists];
//    } else {
//        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
//    }
}


- (void) playTrackWithId:(NSString *)trackId {
    NSURL *trackURL = [NSURL URLWithString:trackId];
    [self.session trackForURL:trackURL callback:^(SPTrack *track) {
        
        if (track != nil) {
            
            [SPAsyncLoading waitUntilLoaded:track timeout:kSPAsyncLoadingDefaultTimeout then:^(NSArray *tracks, NSArray *notLoadedTracks) {
                [self.playbackManager playTrack:track callback:^(NSError *error) {
                    
                    if (error) {
                        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Cannot Play Track"
                                                                        message:[error localizedDescription]
                                                                       delegate:nil
                                                              cancelButtonTitle:@"OK"
                                                              otherButtonTitles:nil];
                        [alert show];
                    } else {
                        NSError *activationError = nil;
                        [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
                        [[AVAudioSession sharedInstance] setActive: YES error: &activationError];
                        if (activationError) {
                            NSLog(@"Could not activate audio session. %@", [activationError localizedDescription]);
                        }
                        MPNowPlayingInfoCenter *center = [MPNowPlayingInfoCenter defaultCenter];
                        NSDictionary *songInfo = [NSDictionary dictionaryWithObjectsAndKeys:
                                                  [[self.currentTrack.artists valueForKey:@"name"] componentsJoinedByString:@","], MPMediaItemPropertyArtist,
                                                  track.name, MPMediaItemPropertyTitle,
                                                  track.album.name, MPMediaItemPropertyAlbumTitle,
                                                  nil];
                        [center setNowPlayingInfo:songInfo];

                        self.currentTrack = track;
                    }
                    
                }];
            }];
        }
    }];
}

- (void) nextTrack {
    Track *track = [self.playlistCollection dequeueNextTrack];
    [self playTrackWithId:track.trackId];
}

- (void) togglePlayPause {
    if (self.playbackManager.isPlaying) {
        self.playbackManager.isPlaying = NO;
    }
    else {
        self.playbackManager.isPlaying = YES;
    }
}

#pragma mark -
#pragma mark SPPlaybackManagerDelegate

-(void)playbackManagerWillStartPlayingAudio:(SPPlaybackManager*)thePlaybackManager {
    NSLog(@"Playback is about to begin!");
}

#pragma mark -
#pragma mark SPSessionPlaybackDelegate

-(void) sessionDidEndPlayback:(id<SPSessionPlaybackProvider>)aSession {
    [self nextTrack];
}

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
	
//	[self removeObserver:self forKeyPath:@"currentTrack.name"];
//	[self removeObserver:self forKeyPath:@"currentTrack.artists"];
//	[self removeObserver:self forKeyPath:@"currentTrack.album.cover.image"];
//	[self removeObserver:self forKeyPath:@"playbackManager.trackPosition"];
//    [self removeObserver:self forKeyPath:@"playlistContainer.playlists"];
	
}


@end

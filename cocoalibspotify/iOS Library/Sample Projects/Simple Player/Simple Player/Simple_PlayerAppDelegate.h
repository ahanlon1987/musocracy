//
//  Simple_PlayerAppDelegate.h
//  Simple Player
//
//  Created by Daniel Kennett on 10/3/11.
/*
 Copyright (c) 2011, Spotify AB
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of Spotify AB nor the names of its contributors may 
 be used to endorse or promote products derived from this software 
 without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL SPOTIFY AB BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#import <UIKit/UIKit.h>
#import "CocoaLibSpotify.h"

@interface Simple_PlayerAppDelegate : NSObject <UIApplicationDelegate, SPSessionDelegate, SPSessionPlaybackDelegate, SPPlaylistDelegate> {
	UIViewController *_mainViewController;
	UITextField *_trackURIField;
	UILabel *_trackTitle;
	UILabel *_trackArtist;
	UIImageView *_coverView;
	UISlider *_positionSlider;
    SPSession *_session;
	SPPlaybackManager *_playbackManager;
	SPTrack *_currentTrack;
    SPPlaylistContainer *_playlistContainer;
    SPPlaylist *_playlist;
    
    NSString *_playlistName;
    NSMutableArray *_tracks;
}


@property (nonatomic, strong) IBOutlet UIWindow *window;
@property (nonatomic, strong) IBOutlet UIViewController *mainViewController;

@property (nonatomic, strong) IBOutlet UITextField *trackURIField;
@property (nonatomic, strong) IBOutlet UILabel *trackTitle;
@property (nonatomic, strong) IBOutlet UILabel *trackArtist;
@property (nonatomic, strong) IBOutlet UIImageView *coverView;
@property (nonatomic, strong) IBOutlet UISlider *positionSlider;

@property (nonatomic, strong) SPSession *session;
@property (nonatomic, strong) SPTrack *currentTrack;
@property (nonatomic, strong) SPPlaybackManager *playbackManager;
@property (nonatomic, strong) SPPlaylist *playlist;
@property (nonatomic, strong) SPPlaylistContainer *playlistContainer;

@property (nonatomic, strong) NSString * playlistName;
@property (nonatomic, strong) NSMutableArray * tracks;

- (IBAction)playTrack:(id)sender;
- (IBAction)setTrackPosition:(id)sender;
- (IBAction)setVolume:(id)sender;
- (IBAction)prevPressed:(id)sender;
- (IBAction)playPausePressed:(id)sender;
- (IBAction)nextPressed:(id)sender;
- (void)playTracKWithId:(NSString *) trackId;

@end

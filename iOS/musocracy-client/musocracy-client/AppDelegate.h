//
//  AppDelegate.h
//  musocracy-client
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Phil MacCart. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CocoaLibSpotify.h"

@interface AppDelegate : UIResponder<UIApplicationDelegate, SPSessionDelegate, SPSessionPlaybackDelegate, SPPlaylistDelegate> {
    SPSession *_session;
	SPPlaybackManager *_playbackManager;
	SPTrack *_currentTrack;
    SPPlaylistContainer *_playlistContainer;
    SPPlaylist *_playlist;
    
    NSString *_playlistName;
    NSMutableArray *_tracks;
}


@property (strong, nonatomic) UIWindow *window;
@property (nonatomic, strong) IBOutlet UIViewController *mainViewController;

@property (nonatomic, strong) SPSession *session;
@property (nonatomic, strong) SPTrack *currentTrack;
@property (nonatomic, strong) SPPlaybackManager *playbackManager;
@property (nonatomic, strong) SPPlaylist *playlist;
@property (nonatomic, strong) SPPlaylistContainer *playlistContainer;

@property (nonatomic, strong) NSString * playlistName;
@property (nonatomic, strong) NSMutableArray * tracks;
@end

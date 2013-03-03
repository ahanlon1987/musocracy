//
//  AppDelegate.h
//  Player
//
//  Created by Phil MacCart on 2/26/13.
//  Copyright (c) 2013 Phil MacCart. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CocoaLibSpotify.h"

@interface PlayerAppDelegate : UIResponder <UIApplicationDelegate, SPSessionDelegate, SPSessionPlaybackDelegate> {
	UIViewController *_mainViewController;
	UITextField *_trackURIField;
	UILabel *_trackTitle;
	UILabel *_trackArtist;
	UIImageView *_coverView;
	UISlider *_positionSlider;
	SPPlaybackManager *_playbackManager;
	SPTrack *_currentTrack;
}


@property (strong, nonatomic) UIWindow *window;

@property (nonatomic, strong) IBOutlet UIViewController *mainViewController;

@property (nonatomic, strong) IBOutlet UITextField *trackURIField;
@property (nonatomic, strong) IBOutlet UILabel *trackTitle;
@property (nonatomic, strong) IBOutlet UILabel *trackArtist;
@property (nonatomic, strong) IBOutlet UIImageView *coverView;
@property (nonatomic, strong) IBOutlet UISlider *positionSlider;

@property (nonatomic, strong) SPTrack *currentTrack;
@property (nonatomic, strong) SPPlaybackManager *playbackManager;

- (IBAction)playTrack:(id)sender;
- (IBAction)setTrackPosition:(id)sender;
- (IBAction)setVolume:(id)sender;

@end

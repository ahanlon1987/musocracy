//
//  NowPlayingViewController.h
//  Simple Player
//
//  Created by Phil MacCart on 3/3/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NowPlayingViewController : UIViewController

@property (weak, nonatomic) IBOutlet UILabel *currentTrackPosition;
@property (weak, nonatomic) IBOutlet UILabel *trackDuration;
@property (weak, nonatomic) IBOutlet UISlider *currentTrackPositionSlider;
@property (weak, nonatomic) IBOutlet UILabel *upcomingTrack1;
@property (weak, nonatomic) IBOutlet UILabel *nowPlayingTrackName;
@property (weak, nonatomic) IBOutlet UILabel *nowPlayingArtistName;
@property (weak, nonatomic) IBOutlet UIImageView *nowPlayingAlbumArt;

@end

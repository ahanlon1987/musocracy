//
//  NowPlayingViewController.m
//  Simple Player
//
//  Created by Phil MacCart on 3/3/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import "NowPlayingViewController.h"
#import "CocoaLibSpotify.h"
#import "Simple_PlayerAppDelegate.h"

@interface NowPlayingViewController ()

@end

@implementation NowPlayingViewController

@synthesize currentTrackPosition;
@synthesize trackDuration;
@synthesize currentTrackPositionSlider;
@synthesize upcomingTrack1;
@synthesize nowPlayingTrackName;
@synthesize nowPlayingArtistName;
@synthesize nowPlayingAlbumArt;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (IBAction)onPrevPressed:(id)sender {
    
}

- (IBAction)onPlayPausePressed:(id)sender {
    Simple_PlayerAppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    [appDelegate playPause];
}

- (IBAction)onNextPressed:(id)sender {
    Simple_PlayerAppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    [appDelegate nextTrack];
}
- (IBAction)onTrackPositionChanged:(id)sender {
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (IBAction)onTrackPositionValueChanged:(id)sender {
    Simple_PlayerAppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    [appDelegate updateTrackPosition:self.currentTrackPositionSlider.value];
}

- (void)viewDidUnload {
    [self setCurrentTrackPosition:nil];
    [self setTrackDuration:nil];
    [self setUpcomingTrack1:nil];
    [self setNowPlayingArtistName:nil];
    [self setNowPlayingAlbumArt:nil];
    [self setTrackDuration:nil];
    [self setCurrentTrackPositionSlider:nil];
    [super viewDidUnload];
}

- (BOOL)canBecomeFirstResponder {
    return YES;
}
- (void)remoteControlReceivedWithEvent:(UIEvent *)event {
    //if it is a remote control event handle it correctly
    if (event.type == UIEventTypeRemoteControl) {
        if (event.subtype == UIEventSubtypeRemoteControlPlay) {
            NSLog(@"Remote Play Event Received");
//            [self playAudio];
        } else if (event.subtype == UIEventSubtypeRemoteControlPause) {
            NSLog(@"Remote Pause Event Received");
//            [self pauseAudio];
        } else if (event.subtype == UIEventSubtypeRemoteControlTogglePlayPause) {
            NSLog(@"Remove toggle play/pause event received.");
//            [self togglePlayPause];
        }
    }
}



@end

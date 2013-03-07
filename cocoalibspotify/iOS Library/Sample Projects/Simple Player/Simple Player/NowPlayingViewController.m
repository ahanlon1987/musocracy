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

@synthesize spotifyPlayer;

@synthesize currentTrackPosition;
@synthesize trackDuration;
@synthesize currentTrackPositionSlider;
@synthesize upcomingTrack1;
@synthesize nowPlayingTrackName;
@synthesize nowPlayingArtistName;
@synthesize nowPlayingAlbumArt;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil spotifyPlayer:(SpotifyPlayer *)theSpotifyPlayer
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        self.spotifyPlayer = theSpotifyPlayer;
        
        [self addObserver:self forKeyPath:@"spotifyPlayer.currentTrack.name" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.currentTrack.artists" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.currentTrack.duration" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.currentTrack.album.cover.image" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.playbackManager.trackPosition" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.session.starredPlaylist" options:0 context:nil];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    if ([keyPath isEqualToString:@"spotifyPlayer.currentTrack.name"]) {
        self.nowPlayingTrackName.text = self.spotifyPlayer.currentTrack.name;
	} else if ([keyPath isEqualToString:@"spotifyPlayer.currentTrack.artists"]) {
        self.nowPlayingArtistName.text = [[self.spotifyPlayer.currentTrack.artists valueForKey:@"name"] componentsJoinedByString:@","];
	} else if ([keyPath isEqualToString:@"spotifyPlayer.currentTrack.album.cover.image"]) {
        self.nowPlayingAlbumArt.image = self.spotifyPlayer.currentTrack.album.cover.image;
	} else if ([keyPath isEqualToString:@"spotifyPlayer.currentTrack.duration"]) {
        self.trackDuration.text = [self getDoubleAsTime:self.spotifyPlayer.currentTrack.duration];
        self.currentTrackPositionSlider.maximumValue = self.spotifyPlayer.currentTrack.duration;
	} else if ([keyPath isEqualToString:@"spotifyPlayer.playbackManager.trackPosition"]) {
        self.currentTrackPosition.text = [self getDoubleAsTime:self.spotifyPlayer.playbackManager.trackPosition];
        self.currentTrackPositionSlider.value = self.spotifyPlayer.playbackManager.trackPosition;
        
    } else if ([keyPath isEqualToString:@"spotifyPlayer.session.starredPlaylist"]) {
        //        [self showPlaylists];
    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

- (IBAction)onPrevPressed:(id)sender {
    
}

- (IBAction)onPlayPausePressed:(id)sender {
//    Simple_PlayerAppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
//    [appDelegate playPause];
    [self.spotifyPlayer togglePlayPause];
}

- (IBAction)onNextPressed:(id)sender {
//    Simple_PlayerAppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
//    [appDelegate nextTrack];
    [self.spotifyPlayer nextTrack];
}
- (IBAction)onTrackPositionChanged:(id)sender {
}

-(NSString *) getDoubleAsTime:(double)timeInSeconds {
    int mins = floor(timeInSeconds / 60);
    int seconds = floor(fmodf(timeInSeconds, 60));
    return [NSString stringWithFormat:@"%u:%02u", mins, seconds];
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

- (void)dealloc {
	
	[self removeObserver:self forKeyPath:@"spotifyPlayer.currentTrack.name"];
	[self removeObserver:self forKeyPath:@"spotifyPlayer.currentTrack.artists"];
	[self removeObserver:self forKeyPath:@"spotifyPlayer.currentTrack.album.cover.image"];
	[self removeObserver:self forKeyPath:@"spotifyPlayer.playbackManager.trackPosition"];
    [self removeObserver:self forKeyPath:@"spotifyPlayer.playlistContainer.playlists"];
	
}

@end

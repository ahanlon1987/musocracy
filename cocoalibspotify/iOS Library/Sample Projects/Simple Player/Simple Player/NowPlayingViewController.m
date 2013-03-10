//
//  NowPlayingViewController.m
//  Simple Player
//
//  Created by Phil MacCart on 3/3/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import <MediaPlayer/MediaPlayer.h>

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
        
        self.title = @"Musocracy";
        
        [self addObserver:self forKeyPath:@"spotifyPlayer.currentTrack.name" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.currentTrack.artists" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.currentTrack.duration" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.currentTrack.album.cover.image" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.playbackManager.trackPosition" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.session.starredPlaylist" options:0 context:nil];
        [self addObserver:self forKeyPath:@"spotifyPlayer.playlistCollection.nextTrack.trackName" options:0 context:nil];
//        [self addObserver:self forKeyPath:@"spotifyPlayer.playlistCollection.nextTrack.artist" options:0 context:nil];
        
        
        UITabBarItem *nowPlayingTabBarItem = [[UITabBarItem alloc] init];
        nowPlayingTabBarItem.title = @"Now Playing";
        UIImage *tabBarImage = [UIImage imageNamed:@"music.png"];
        nowPlayingTabBarItem.image = tabBarImage;
        self.tabBarItem = nowPlayingTabBarItem;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
        MPNowPlayingInfoCenter *npCenter = [MPNowPlayingInfoCenter defaultCenter];
        NSMutableDictionary *npDict = [[NSMutableDictionary alloc]initWithDictionary:npCenter.nowPlayingInfo];
    if ([keyPath isEqualToString:@"spotifyPlayer.currentTrack.name"]) {
        self.nowPlayingTrackName.text = self.spotifyPlayer.currentTrack.name;
                [npDict setObject:MPMediaItemPropertyTitle forKey:self.spotifyPlayer.currentTrack.name];
    } else if ([keyPath isEqualToString:@"spotifyPlayer.currentTrack.artists"]) {
        self.nowPlayingArtistName.text = [[self.spotifyPlayer.currentTrack.artists valueForKey:@"name"] componentsJoinedByString:@","];
                [npDict setObject:MPMediaItemPropertyArtist forKey:[[self.spotifyPlayer.currentTrack.artists valueForKey:@"name"] componentsJoinedByString:@","]];
    } else if ([keyPath isEqualToString:@"spotifyPlayer.currentTrack.album.cover.image"]) {
        self.nowPlayingAlbumArt.image = self.spotifyPlayer.currentTrack.album.cover.image;
    } else if ([keyPath isEqualToString:@"spotifyPlayer.currentTrack.duration"]) {
        self.trackDuration.text = [self getDoubleAsTime:self.spotifyPlayer.currentTrack.duration];
        self.currentTrackPositionSlider.maximumValue = self.spotifyPlayer.currentTrack.duration;
    } else if ([keyPath isEqualToString:@"spotifyPlayer.playbackManager.trackPosition"]) {
        self.currentTrackPosition.text = [self getDoubleAsTime:self.spotifyPlayer.playbackManager.trackPosition];
        if (!self.currentTrackPositionSlider.highlighted) {
            self.currentTrackPositionSlider.value = self.spotifyPlayer.playbackManager.trackPosition;
        }
        
    } else if ([keyPath isEqualToString:@"spotifyPlayer.session.starredPlaylist"]) {
        //        [self showPlaylists];
    } else if ([keyPath isEqualToString:@"spotifyPlayer.playlistCollection.nextTrack.trackName"]) {
        self.upcomingTrack1.text = self.spotifyPlayer.playlistCollection.nextTrack.trackName;
    
    }else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
//        npCenter.nowPlayingInfo = npDict;
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
    [self.spotifyPlayer playNextTrack];
}


- (IBAction)onTrackPositionValueChanged:(id)sender {
    [self.spotifyPlayer.playbackManager seekToTrackPosition:self.currentTrackPositionSlider.value];
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
            NSLog(@"Remote toggle play/pause event received.");
            [self onPlayPausePressed:event];
        } else if (event.subtype == UIEventSubtypeRemoteControlNextTrack) {
            [self onNextPressed:event];
        }
    }
}

- (void) viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [[UIApplication sharedApplication] beginReceivingRemoteControlEvents];
    [self becomeFirstResponder];
}

-(void) viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    
    [[UIApplication sharedApplication] endReceivingRemoteControlEvents];
    [self resignFirstResponder];
}

- (void)dealloc {
	
	[self removeObserver:self forKeyPath:@"spotifyPlayer.currentTrack.name"];
	[self removeObserver:self forKeyPath:@"spotifyPlayer.currentTrack.artists"];
	[self removeObserver:self forKeyPath:@"spotifyPlayer.currentTrack.album.cover.image"];
	[self removeObserver:self forKeyPath:@"spotifyPlayer.playbackManager.trackPosition"];
    [self removeObserver:self forKeyPath:@"spotifyPlayer.playlistContainer.playlists"];
	
}

@end

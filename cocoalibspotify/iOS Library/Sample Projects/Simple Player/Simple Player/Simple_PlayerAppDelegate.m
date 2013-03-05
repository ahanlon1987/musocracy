//
//  Simple_PlayerAppDelegate.m
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

#import "Simple_PlayerAppDelegate.h"
#import "Track.h"
#import "AFNetworkActivityIndicatorManager.h"
#import "NowPlayingViewController.h"
#import <math.h>
#import <AVFoundation/AVFoundation.h>

#import <AudioToolbox/AudioToolbox.h>
#import <MediaPlayer/MediaPlayer.h>

#include "appkey.c"

@interface Simple_PlayerAppDelegate()
@property BOOL firstLoad;
@end

@implementation Simple_PlayerAppDelegate

@synthesize firstLoad;

@synthesize window = _window;
@synthesize navigationController = _navigationController;
//@synthesize nowPlayingViewController = _nowPlayingViewController;
@synthesize mainViewController = _mainViewController;
@synthesize trackURIField = _trackURIField;
@synthesize trackTitle = _trackTitle;
@synthesize trackArtist = _trackArtist;
@synthesize coverView = _coverView;
@synthesize positionSlider = _positionSlider;
@synthesize playbackManager = _playbackManager;
@synthesize currentTrack = _currentTrack;
@synthesize playlist = _playlist;
@synthesize playlistContainer = _playlistContainer;
@synthesize session = _session;

@synthesize playlistName = _playlistName;
@synthesize tracks = _tracks;
@synthesize playlistCollection = _playlistCollection;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	// Override point for customization after application launch.
	[self.window makeKeyAndVisible];
    
    [[AFNetworkActivityIndicatorManager sharedManager] setEnabled:YES];
//    NowPlayingViewController *nowPlayingViewController = [[NowPlayingViewController alloc] initWithNibName:@"NowPlayingViewController.xib" bundle:nil];
    
    self.mainViewController = [[NowPlayingViewController alloc] initWithNibName:@"NowPlayingViewController" bundle:nil];
    self.navigationController = [[UINavigationController alloc] initWithRootViewController:self.mainViewController];
    self.window.rootViewController = self.navigationController;
    
    [self.window makeKeyAndVisible];
    
	NSError *error = nil;
	[SPSession initializeSharedSessionWithApplicationKey:[NSData dataWithBytes:&g_appkey length:g_appkey_size]
											   userAgent:@"com.spotify.SimplePlayer-iOS"
										   loadingPolicy:SPAsyncLoadingManual
												   error:&error];
	if (error != nil) {
		NSLog(@"CocoaLibSpotify init failed: %@", error);
		abort();
	}

	self.playbackManager = [[SPPlaybackManager alloc] initWithPlaybackSession:[SPSession sharedSession]];
	self.session = [SPSession sharedSession];
    [self.session setDelegate:self];

	[self addObserver:self forKeyPath:@"currentTrack.name" options:0 context:nil];
	[self addObserver:self forKeyPath:@"currentTrack.artists" options:0 context:nil];
	[self addObserver:self forKeyPath:@"currentTrack.duration" options:0 context:nil];
	[self addObserver:self forKeyPath:@"currentTrack.album.cover.image" options:0 context:nil];
	[self addObserver:self forKeyPath:@"playbackManager.trackPosition" options:0 context:nil];
    [self addObserver:self forKeyPath:@"session.starredPlaylist" options:0 context:nil];
	
	[self performSelector:@selector(showLogin) withObject:nil afterDelay:0.0];
    
    // TODO: create a player class, encapsulate all audio-related code
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
    
    NSError *activationError = nil;
    [[AVAudioSession sharedInstance] setActive: YES error: &activationError];
    if (activationError) {
        NSLog(@"Could not activate audio session. %@", [activationError localizedDescription]);
    }
    
    self.playlistName = @"1";
    self.firstLoad = YES;
    return YES;
}

-(void)showLogin {

	SPLoginViewController *controller = [SPLoginViewController loginControllerForSession:[SPSession sharedSession]];
	controller.allowsCancel = YES;
	
	[self.mainViewController presentModalViewController:controller
											   animated:NO];

}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    if ([keyPath isEqualToString:@"currentTrack.name"]) {
        self.trackTitle.text = self.currentTrack.name;
        [self updateCurrentTrackName:self.currentTrack.name];
	} else if ([keyPath isEqualToString:@"currentTrack.artists"]) {
		self.trackArtist.text = [[self.currentTrack.artists valueForKey:@"name"] componentsJoinedByString:@","];
        [self updateCurrentTrackArtist:self.trackArtist.text];
	} else if ([keyPath isEqualToString:@"currentTrack.album.cover.image"]) {
//		self.coverView.image = self.currentTrack.album.cover.image;
        [self updateCurrentTrackAlbumCoverArt:self.currentTrack.album.cover.image];
	} else if ([keyPath isEqualToString:@"currentTrack.duration"]) {
		self.positionSlider.maximumValue = self.currentTrack.duration;
        [self updateCurrentTrackDuration:self.currentTrack.duration];
	} else if ([keyPath isEqualToString:@"playbackManager.trackPosition"]) {
		// Only update the slider if the user isn't currently dragging it.
		if (!self.positionSlider.highlighted)
			self.positionSlider.value = self.playbackManager.trackPosition;
        
        [self updateCurrentTrackPosition:self.playbackManager.trackPosition];
        
    } else if ([keyPath isEqualToString:@"session.starredPlaylist"]) {
        [self showPlaylists];
    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

-(void)updateCurrentTrackName:(NSString *)trackName {
    self.mainViewController.nowPlayingTrackName.text = trackName;
}

-(void)updateCurrentTrackArtist:(NSString *) trackArtist {
    self.mainViewController.nowPlayingArtistName.text = trackArtist;
}

-(void)updateCurrentTrackAlbumCoverArt:(UIImage *) albumCoverArt {
    self.mainViewController.nowPlayingAlbumArt.image = albumCoverArt;
}

-(void)updateCurrentTrackPosition:(double) trackPosition {
    self.mainViewController.currentTrackPosition.text = [self getDoubleAsTime:trackPosition];
    if (!self.mainViewController.currentTrackPositionSlider.highlighted) {
        self.mainViewController.currentTrackPositionSlider.value = trackPosition;
    }
}

-(void)updateCurrentTrackDuration:(double) trackDuration {
    self.mainViewController.trackDuration.text = [self getDoubleAsTime:trackDuration];
    self.mainViewController.currentTrackPositionSlider.maximumValue = trackDuration;
}

-(NSString *) getDoubleAsTime:(double)timeInSeconds {
    int mins = floor(timeInSeconds / 60);
    int seconds = floor(fmodf(timeInSeconds, 60));
    return [NSString stringWithFormat:@"%u:%02u", mins, seconds];
}

- (void)applicationWillResignActive:(UIApplication *)application
{
	/*
	 Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
	 Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
	 */
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
	/*
	 Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
	 If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
	 */
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
	/*
	 Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
	 */
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
	/*
	 Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
	 */
}

- (void)applicationWillTerminate:(UIApplication *)application
{
	/*
	 Called when the application is about to terminate.
	 Save data if appropriate.
	 See also applicationDidEnterBackground:.
	 */
	
//	[[SPSession sharedSession] logout:^{}];
}

- (void) showPlaylists {
//    if (self.session.userPlaylists.isLoaded) {
//        NSLog(@"Playlist container was loaded!!!");
//    }
//    else {
//        NSLog(@"Playlist container has not been loaded yet...");
//        return;
//    }
//    for (SPTrack *pl in self.session.starredPlaylist) {
//        NSLog(@"Playlist name is %@", pl.name);
//    }
}

#pragma mark -

- (void) playlistReady {
    NSLog(@"Playlist is ready message received");
    if (self.firstLoad) {
        Track * track = [self.playlistCollection dequeueNextTrack];
        [self playTrackWithId:track.trackId];
        self.firstLoad = NO;
    }
}

- (void) playPause {
    if (self.playbackManager.isPlaying) {
        self.playbackManager.isPlaying = NO;
    }
    else {
        self.playbackManager.isPlaying = YES;
    }
}

-(void) updateTrackPosition:(double) position {
    [self.playbackManager seekToTrackPosition:position];
}

- (IBAction)setTrackPosition:(id)sender {
	[self.playbackManager seekToTrackPosition:self.positionSlider.value];
}

- (IBAction)setVolume:(id)sender {
	self.playbackManager.volume = [(UISlider *)sender value];
}

- (IBAction)prevPressed:(id)sender {
}

- (IBAction)playPausePressed:(id)sender {
    if (self.playbackManager.isPlaying) {
        self.playbackManager.isPlaying = NO;
    }
    else {
        self.playbackManager.isPlaying = YES;
    }


}

- (IBAction)nextPressed:(id)sender {
    Track *track = [self.playlistCollection dequeueNextTrack];
    [self playTrackWithId:track.trackId];
    
//    [self playTrackWithId:[self.tracks objectAtIndex:0]];
}

- (void)setupTimer {
    [NSTimer scheduledTimerWithTimeInterval:10
                                     target:self
                                 selector:@selector(fetchPlaylist)
                                   userInfo:nil
                                    repeats:YES];
}

- (void) playTrackWithId:(NSString *)trackId {
    NSURL *trackURL = [NSURL URLWithString:trackId];
    [[SPSession sharedSession] trackForURL:trackURL callback:^(SPTrack *track) {
        
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

- (void) playOrPause {
    if (self.playbackManager.isPlaying) {
        self.playbackManager.isPlaying = NO;
    }
    else {
        self.playbackManager.isPlaying = YES;
    }    
}

#pragma mark -
#pragma mark SPSessionDelegate Methods

-(UIViewController *) viewControllerToPresentLoginViewForSession:(SPSession *)aSession; {
	return self.mainViewController;
}

-(void)sessionDidLoginSuccessfully:(SPSession *)aSession; {
	// Invoked by SPSession after a successful login.
    self.playlistCollection = [[PlaylistCollection alloc] initWithLocationId:self.playlistName];
    [self.playlistCollection loadTracks];
    [self.session.starredPlaylist startLoading];
}

-(void)session:(SPSession *)aSession didFailToLoginWithError:(NSError *)error; {
	// Invoked by SPSession after a failed login.
}

-(void)sessionDidLogOut:(SPSession *)aSession {
	
	SPLoginViewController *controller = [SPLoginViewController loginControllerForSession:[SPSession sharedSession]];
	
	if (self.mainViewController.presentedViewController != nil) return;
	
	controller.allowsCancel = NO;
	
	[self.mainViewController presentModalViewController:controller
											   animated:YES];
}

-(void)session:(SPSession *)aSession didEncounterNetworkError:(NSError *)error; {}
-(void)session:(SPSession *)aSession didLogMessage:(NSString *)aMessage; {}
-(void)sessionDidChangeMetadata:(SPSession *)aSession; {}

-(void)session:(SPSession *)aSession :(NSString *)aMessage; {
	return;
	UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Message from Spotify"
													message:aMessage
												   delegate:nil
										  cancelButtonTitle:@"OK"
										  otherButtonTitles:nil];
	[alert show];
}

#pragma mark -
#pragma mark SPPlaylistDelegate Methods



- (void)dealloc {
	
	[self removeObserver:self forKeyPath:@"currentTrack.name"];
	[self removeObserver:self forKeyPath:@"currentTrack.artists"];
	[self removeObserver:self forKeyPath:@"currentTrack.album.cover.image"];
	[self removeObserver:self forKeyPath:@"playbackManager.trackPosition"];
    [self removeObserver:self forKeyPath:@"playlistContainer.playlists"];
	
}

@end


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
#import "LoginViewController.h"
#import "PlaylistViewController.h"
#import <math.h>

#include "appkey.c"

@interface Simple_PlayerAppDelegate()
@property BOOL firstLoad;
@end

@implementation Simple_PlayerAppDelegate

@synthesize firstLoad;

@synthesize window = _window;
@synthesize navigationController = _navigationController;
@synthesize tabBarController = _tabBarController;
@synthesize loginViewController = _loginViewController;
@synthesize mainViewController = _mainViewController;
@synthesize playbackManager = _playbackManager;
@synthesize currentTrack = _currentTrack;
@synthesize playlist = _playlist;
@synthesize playlistContainer = _playlistContainer;
@synthesize session = _session;

@synthesize playlistName = _playlistName;
@synthesize playlistCollection = _playlistCollection;
@synthesize spotifyPlayer = _spotifyPlayer;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	// Override point for customization after application launch.
	[self.window makeKeyAndVisible];
    
    [[AFNetworkActivityIndicatorManager sharedManager] setEnabled:YES];
//    NowPlayingViewController *nowPlayingViewController = [[NowPlayingViewController alloc] initWithNibName:@"NowPlayingViewController.xib" bundle:nil];
    
	NSError *error = nil;
	[SPSession initializeSharedSessionWithApplicationKey:[NSData dataWithBytes:&g_appkey length:g_appkey_size]
											   userAgent:@"com.musocracy.MusocracyApp-iOS"
										   loadingPolicy:SPAsyncLoadingManual
												   error:&error];
	if (error != nil) {
		NSLog(@"CocoaLibSpotify init failed: %@", error);
		abort();
	}

//	self.playbackManager = [[SPPlaybackManager alloc] initWithPlaybackSession:[SPSession sharedSession]];
	self.session = [SPSession sharedSession];
    [self.session setDelegate:self];
    
//    self.window.rootViewController = self.navigationController;
    
    self.loginViewController = [[LoginViewController alloc] initWithNibName:@"LoginViewController" bundle:nil];
    self.loginViewController.session = self.session;
    
    self.window.rootViewController = self.loginViewController;
    
    [self.window makeKeyAndVisible];


//	[self addObserver:self forKeyPath:@"currentTrack.name" options:0 context:nil];
//	[self addObserver:self forKeyPath:@"currentTrack.artists" options:0 context:nil];
//	[self addObserver:self forKeyPath:@"currentTrack.duration" options:0 context:nil];
//	[self addObserver:self forKeyPath:@"currentTrack.album.cover.image" options:0 context:nil];
//	[self addObserver:self forKeyPath:@"playbackManager.trackPosition" options:0 context:nil];
//    [self addObserver:self forKeyPath:@"session.starredPlaylist" options:0 context:nil];
//	
	[self performSelector:@selector(checkAuth) withObject:nil afterDelay:0.0];
//
//    self.playlistName = @"1";
//    self.firstLoad = YES;
    return YES;
}

-(void) checkAuth {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary *storedCredentials = [[defaults valueForKey:@"MusocracyUsers"] mutableCopy];
    
    if (storedCredentials == nil) {
        [self showLogin];
    }
    else {
        [self showLogin];
//        NSArray * allKeys = [storedCredentials allKeys];
//        if (!allKeys || allKeys.count < 1) {
//            NSLog(@"No keys found for credentials");
//            [self showLogin];
//        }
//        else {
//            NSString * username = [allKeys objectAtIndex:0];
//            NSString * credential = [storedCredentials objectForKey:username];
//            NSLog(@"About to check auth with existing username=%@ and credential=%@", username, credential);
//            [self.session attemptLoginWithUserName:username existingCredential:credential];
//        }
    }
    
}

-(void)showLogin {

//	SPLoginViewController *controller = [SPLoginViewController loginControllerForSession:[SPSession sharedSession]];
//	controller.allowsCancel = YES;
//	LoginViewController *controller = [[LoginViewController alloc] initWithNibName:@"LoginViewController" bundle:nil];

//    controller.session = self.session;
//    [self.navigationController pushViewController:controller animated:YES];
//	[self.mainViewController presentModalViewController:controller animated:NO];
    
    
    [self.loginViewController showLoginForm];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    if ([keyPath isEqualToString:@"currentTrack.name"]) {
        [self updateCurrentTrackName:self.currentTrack.name];
	} else if ([keyPath isEqualToString:@"currentTrack.artists"]) {
        [self updateCurrentTrackArtist:[[self.currentTrack.artists valueForKey:@"name"] componentsJoinedByString:@","]];
	} else if ([keyPath isEqualToString:@"currentTrack.album.cover.image"]) {
        [self updateCurrentTrackAlbumCoverArt:self.currentTrack.album.cover.image];
	} else if ([keyPath isEqualToString:@"currentTrack.duration"]) {
        [self updateCurrentTrackDuration:self.currentTrack.duration];
	} else if ([keyPath isEqualToString:@"playbackManager.trackPosition"]) {
        [self updateCurrentTrackPosition:self.playbackManager.trackPosition];
    } else if ([keyPath isEqualToString:@"session.starredPlaylist"]) {
//        [self showPlaylists];
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
	
	[[SPSession sharedSession] logout:^{}];
}

#pragma mark -
#pragma mark SPSessionDelegate Methods

-(UIViewController *) viewControllerToPresentLoginViewForSession:(SPSession *)aSession; {
	return self.mainViewController;
}

-(void)session:(SPSession *)aSession didGenerateLoginCredentials:(NSString *)credential forUserName:(NSString *)userName {
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary *storedCredentials = [[defaults valueForKey:@"MusocracyUsers"] mutableCopy];
    
    if (storedCredentials == nil)
        storedCredentials = [NSMutableDictionary dictionary];
    
    [storedCredentials setValue:credential forKey:userName];
    [defaults setValue:storedCredentials forKey:@"MusocracyUsers"];
}

-(void)sessionDidLoginSuccessfully:(SPSession *)aSession; {
    NSLog(@"Logged in successfully!");
    
//    [self.mainViewController.modalViewController removeFromParentViewController];
//    [self.navigationController popViewControllerAnimated:YES];
//    if (!self.mainViewController) {
        self.spotifyPlayer = [[SpotifyPlayer alloc] initWithSession:self.session];
        [self.session setPlaybackDelegate:self.spotifyPlayer];
//
        self.mainViewController = [[NowPlayingViewController alloc] initWithNibName:@"NowPlayingViewController" bundle:nil spotifyPlayer:self.spotifyPlayer];
    
    PlaylistViewController *playlistViewController = [[PlaylistViewController alloc] initWithNibName:@"PlaylistViewController" bundle:nil];
    playlistViewController.playlistCollection = self.spotifyPlayer.playlistCollection;

//        self.navigationController = [[UINavigationController alloc] initWithRootViewController:self.mainViewController];
//    
   //
//    NSArray * controllers = [NSArray arrayWithObjects:self.mainViewController, playlistViewController, nil];
//    
//    self.tabBarController = [[UITabBarController alloc] init];
//    self.tabBarController.viewControllers = controllers;
    //    }
    
//    self.window.rootViewController = self.navigationController;
//    self.window.rootViewController = self.tabBarController;
    
    [self createNavigationView];
}

-(void) createNavigationView {
    
    UIButton *rightButton = [UIButton buttonWithType:UIButtonTypeDetailDisclosure];
    [rightButton addTarget:self action:@selector(showPlaylist) forControlEvents:UIControlEventTouchUpInside];

    UIBarButtonItem *rightBarButton = [[UIBarButtonItem alloc] initWithCustomView:rightButton];
    rightBarButton.title = @"Playlist";
    
    self.mainViewController.navigationItem.rightBarButtonItem = rightBarButton;
    
    UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:self.mainViewController];
    
    self.navigationController = navController;
    self.window.rootViewController = navController;
}

-(void) createTabBarView {
    PlaylistViewController *playlistViewController = [[PlaylistViewController alloc] initWithNibName:@"PlaylistViewController" bundle:nil];
    playlistViewController.playlistCollection = self.spotifyPlayer.playlistCollection;
    
    NSArray * controllers = [NSArray arrayWithObjects:self.mainViewController, playlistViewController, nil];
    
    self.tabBarController = [[UITabBarController alloc] init];
    self.tabBarController.viewControllers = controllers;
    
    self.window.rootViewController = self.tabBarController;
}

-(void) showPlaylist {
    PlaylistViewController *playlistViewController = [[PlaylistViewController alloc] initWithNibName:@"PlaylistViewController" bundle:nil];
    playlistViewController.playlistCollection = self.spotifyPlayer.playlistCollection;
    
    [self.navigationController pushViewController:playlistViewController animated:YES];
}

-(void)session:(SPSession *)aSession didFailToLoginWithError:(NSError *)error; {
	// Invoked by SPSession after a failed login.
    NSLog(@"Failed to login: %@", error.localizedDescription);
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
	
//	[self removeObserver:self forKeyPath:@"currentTrack.name"];
//	[self removeObserver:self forKeyPath:@"currentTrack.artists"];
//	[self removeObserver:self forKeyPath:@"currentTrack.album.cover.image"];
//	[self removeObserver:self forKeyPath:@"playbackManager.trackPosition"];
//    [self removeObserver:self forKeyPath:@"playlistContainer.playlists"];
	
}

@end

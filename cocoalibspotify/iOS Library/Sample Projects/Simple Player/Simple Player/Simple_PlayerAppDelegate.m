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

#include "appkey.c"

@interface Simple_PlayerAppDelegate()
@property (nonatomic, strong) NSMutableData * responseData;
@end

@implementation Simple_PlayerAppDelegate

@synthesize responseData = _responseData;


@synthesize window = _window;
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

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	// Override point for customization after application launch.
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
    
    self.playlistName = @"test";
    [self setupTimer];

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
	} else if ([keyPath isEqualToString:@"currentTrack.artists"]) {
		self.trackArtist.text = [[self.currentTrack.artists valueForKey:@"name"] componentsJoinedByString:@","];
	} else if ([keyPath isEqualToString:@"currentTrack.album.cover.image"]) {
		self.coverView.image = self.currentTrack.album.cover.image;
	} else if ([keyPath isEqualToString:@"currentTrack.duration"]) {
		self.positionSlider.maximumValue = self.currentTrack.duration;
	} else if ([keyPath isEqualToString:@"playbackManager.trackPosition"]) {
		// Only update the slider if the user isn't currently dragging it.
		if (!self.positionSlider.highlighted)
			self.positionSlider.value = self.playbackManager.trackPosition;
    } else if ([keyPath isEqualToString:@"session.starredPlaylist"]) {
        [self showPlaylists];
    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    NSLog(@"didReceiveResponse");
    [self.responseData setLength:0];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    [self.responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    NSLog(@"didFailWithError");
    NSLog([NSString stringWithFormat:@"Connection failed: %@", [error description]]);
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    NSLog(@"connectionDidFinishLoading");
    NSLog(@"Succeeded! Received %d bytes of data",[self.responseData length]);
    
    // convert to JSON
    NSError *myError = nil;
    NSDictionary *res = [NSJSONSerialization JSONObjectWithData:self.responseData options:NSJSONReadingMutableLeaves error:&myError];
    
    NSArray *playlist = [res objectForKey:@"playlist"];
    self.tracks = [[NSMutableArray alloc] init];
    
    for (NSDictionary * track in playlist) {
        
        NSString *trackId = (NSString *) [track objectForKey:@"trackId"];
        NSString *name = (NSString *) [track objectForKey:@"name"];
        NSString *artist = (NSString *) [track objectForKey:@"artist"];
        
        Track * trackObj = [[Track alloc] init];
        trackObj.trackId = trackId;
        trackObj.trackName = name;
        trackObj.artist = artist;
        
        [self.tracks addObject:trackObj];
        
        NSLog(@"Track Name: %@,  ID: %@", name, trackId);
    }
    
    NSLog(@"Added %u tracks to the playlist.", [self.tracks count]);
    for (Track * trackObj in self.tracks) {
        NSLog(@"Track Name: %@,  ID: %@", trackObj.trackName, trackObj.trackId);
    }
    
    NSDictionary * firstTrack = [playlist objectAtIndex:0];
    NSString *trackId = (NSString *) [firstTrack objectForKey:@"trackId"];
    NSString *name = (NSString *) [firstTrack objectForKey:@"name"];
    self.trackTitle.text = name;
    self.trackURIField.text = trackId;
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

- (IBAction)playTrack:(id)sender {
	
	// Invoked by clicking the "Play" button in the UI.
	
	if (self.trackURIField.text.length > 0) {
		
		NSURL *trackURL = [NSURL URLWithString:self.trackURIField.text];
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
		
		return;
	}
	
	UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Cannot Play Track"
													message:@"Please enter a track URL"
												   delegate:nil
										  cancelButtonTitle:@"OK"
										  otherButtonTitles:nil];
	[alert show];
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
    [self.tracks removeObjectAtIndex:0];
    Track *track = [self.tracks objectAtIndex:0];
    [self playTrackWithId:track.trackId];
    
//    [self playTrackWithId:[self.tracks objectAtIndex:0]];
}

- (void) fetchPlaylist {
    NSString * url = [NSString stringWithFormat:@"http://localhost:3000/location/%@/votes", self.playlistName];
    NSLog(@"viewdidload");
    self.responseData = [NSMutableData data];
    NSURLRequest *request = [NSURLRequest requestWithURL:
                             [NSURL URLWithString:url]];
    [[NSURLConnection alloc] initWithRequest:request delegate:self];
	
}

- (void)setupTimer {
    [NSTimer scheduledTimerWithTimeInterval:1
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

#pragma mark -
#pragma mark SPSessionDelegate Methods

-(UIViewController *)viewControllerToPresentLoginViewForSession:(SPSession *)aSession {
	return self.mainViewController;
}

-(void)sessionDidLoginSuccessfully:(SPSession *)aSession; {
	// Invoked by SPSession after a successful login.
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

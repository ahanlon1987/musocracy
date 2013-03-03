//
//  AppDelegate.m
//  musocracy-client
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Phil MacCart. All rights reserved.
//

#import "AppDelegate.h"

@interface AppDelegate()
@property (nonatomic, strong) NSMutableData * responseData;
@end

@implementation AppDelegate

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
    
    
    
    return YES;
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}


#pragma mark -
#pragma mark SPSessionDelegate Methods
-(void)session:(SPSession *) didGenerageLoginCredentials:(NSString *)credential forUserName:(NSString *)userName {
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary *storedCredentials = [[defaults valueForKey:@"SpotifyUsers"] mutableCopy];
    
    if (storedCredentials == nil)
        storedCredentials = [NSMutableDictionary dictionary];
    
    [storedCredentials setValue:credential forKey:userName];
    [defaults setValue:storedCredentials forKey:@"SpotifyUsers"];
}

@end

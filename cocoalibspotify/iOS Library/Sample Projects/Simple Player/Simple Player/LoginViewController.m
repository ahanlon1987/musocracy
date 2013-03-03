//
//  LoginViewController.m
//  Simple Player
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import "LoginViewController.h"
#include "appkey.c"

@interface LoginViewController ()

@end

@implementation LoginViewController

@synthesize username;
@synthesize password;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (IBAction)loginPressed:(id)sender {
    
    NSString * usernameVal = self.username.text;
    NSString * passwordVal = self.password.text;
    
    NSLog(@"Username: %@, Password: %@", usernameVal, passwordVal);
    
    NSError *error = nil;
    [SPSession initializeSharedSessionWithApplicationKey:[NSData dataWithBytes:&g_appkey
                                                                        length:g_appkey_size] userAgent:@"com.spotify.SimplePlayer-iOS"
                                           loadingPolicy:SPAsyncLoadingManual
                                                   error:&error];
    
    
    
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidUnload {
    [self setUsername:nil];
    [self setPassword:nil];
    [super viewDidUnload];
}
@end

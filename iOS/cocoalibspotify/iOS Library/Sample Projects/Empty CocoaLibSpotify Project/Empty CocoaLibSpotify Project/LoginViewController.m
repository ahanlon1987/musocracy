//
//  LoginViewController.m
//  Empty CocoaLibSpotify Project
//
//  Created by Phil MacCart on 3/3/13.
//  Copyright (c) 2013 Your Company. All rights reserved.
//

#import "LoginViewController.h"
#import "CocoaLibSpotify.h"

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

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (IBAction)loginPressed:(id)sender {
    
    NSString * usernameVal = self.username.text;
    NSString * passwordVal = self.password.text;
}

- (NSString *) doLoginWithUsername:(NSString *)username andPassword:(NSString *)password {



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

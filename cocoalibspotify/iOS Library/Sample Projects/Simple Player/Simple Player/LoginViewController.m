//
//  LoginViewController.m
//  Simple Player
//
//  Created by Phil MacCart on 3/5/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import "LoginViewController.h"

@interface LoginViewController ()

@end

@implementation LoginViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        self.title = @"Login";
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.username.text = @"pmaccart";
    self.password.text = @"harlowton";
    
    [self hideLoginForm];
    // Do any additional setup after loading the view from its nib.
}
- (IBAction)onLoginPressed:(id)sender {
    NSString * usernameVal = self.username.text;
    NSString * passwordVal = self.password.text;
    
    NSLog(@"About to login username=%@ password=%@", usernameVal, passwordVal);
    [self.session attemptLoginWithUserName:usernameVal password:passwordVal];
}

-(void)showLoginForm {
    self.username.hidden = NO;
    self.password.hidden = NO;
    self.loginButton.hidden = NO;
    self.loadingMessage.hidden = YES;
}

-(void)hideLoginForm {
    self.username.hidden = YES;
    self.password.hidden = YES;
    self.loginButton.hidden = YES;
    self.loadingMessage.hidden = NO;
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

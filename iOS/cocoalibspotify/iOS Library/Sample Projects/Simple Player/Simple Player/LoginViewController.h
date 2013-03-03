//
//  LoginViewController.h
//  Simple Player
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CocoaLibSpotify.h"

@interface LoginViewController : UIViewController <SPSessionDelegate>
@property (weak, nonatomic) IBOutlet UITextField *username;
@property (weak, nonatomic) IBOutlet UITextField *password;

@end

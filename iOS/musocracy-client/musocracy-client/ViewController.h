//
//  ViewController.h
//  musocracy-client
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Phil MacCart. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController


@property (nonatomic, strong) IBOutlet UITextField *trackURIField;
@property (nonatomic, strong) IBOutlet UILabel *trackTitle;
@property (nonatomic, strong) IBOutlet UILabel *trackArtist;
@property (nonatomic, strong) IBOutlet UIImageView *coverView;
@property (nonatomic, strong) IBOutlet UISlider *positionSlider;


@end

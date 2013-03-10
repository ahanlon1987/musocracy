//
//  PlaylistViewController.h
//  Simple Player
//
//  Created by Phil MacCart on 3/10/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "PlaylistCollection.h"
@interface PlaylistViewController : UITableViewController 

@property (nonatomic, weak) PlaylistCollection *playlistCollection;

@end

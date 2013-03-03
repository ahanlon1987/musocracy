//
//  Track.h
//  Simple Player
//
//  Created by Phil MacCart on 3/2/13.
//  Copyright (c) 2013 Spotify. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Track : NSObject

@property (strong, nonatomic) NSString * trackId;
@property (strong, nonatomic) NSString * trackName;
@property (strong, nonatomic) NSString * artist;

@end

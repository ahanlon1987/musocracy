//
// Created by pmaccart on 3/3/13.
//
// To change the template use AppCode | Preferences | File Templates.
//


#import <Foundation/Foundation.h>


@interface PlaylistService : NSObject

-(NSArray *) getTracks:(NSString *) locationId;
-(void) markTrackAsPlayed:(NSString *) trackId;

@end

import React from 'react';
import { format } from 'date-fns';
import { useData, CalendarItem, SocialMediaPlatform } from '@/contexts/DataContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Instagram, Facebook, Twitter, Linkedin, Clock, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type SocialMediaCalendarProps = {
  onRefresh?: () => void;
};

export const SocialMediaCalendar = ({ onRefresh }: SocialMediaCalendarProps) => {
  const { calendarItems, updateCalendarItem, deleteCalendarItem } = useData();
  
  // Filter items with social media details
  const socialMediaPosts = calendarItems.filter(item => 
    item.socialMediaDetails !== undefined
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Split posts into upcoming and past
  const now = new Date();
  const upcomingPosts = socialMediaPosts.filter(post => new Date(post.date) >= now);
  const pastPosts = socialMediaPosts.filter(post => new Date(post.date) < now);
  
  const getPlatformIcon = (platformName: SocialMediaPlatform) => {
    switch(platformName) {
      case "LinkedIn": return <Linkedin className="h-4 w-4" />;
      case "Twitter": return <Twitter className="h-4 w-4" />;
      case "Facebook": return <Facebook className="h-4 w-4" />;
      case "Instagram": return <Instagram className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'posted':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Posted</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatPostDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      date.setHours(Number(hours), Number(minutes));
    }
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const handleMarkAsPosted = (post: CalendarItem) => {
    if (!post.socialMediaDetails) return;
    
    const updatedPost = {
      ...post,
      socialMediaDetails: {
        ...post.socialMediaDetails,
        scheduledStatus: 'posted' as const,
      }
    };
    
    updateCalendarItem(updatedPost);
    toast.success(`Marked ${post.title} as posted`);
    
    if (onRefresh) onRefresh();
  };
  
  const handleDelete = (postId: string) => {
    deleteCalendarItem(postId);
    toast.success("Post deleted successfully");
    
    if (onRefresh) onRefresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Upcoming Social Media Posts
          </CardTitle>
          <CardDescription>
            Posts scheduled for future publication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {upcomingPosts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingPosts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {post.socialMediaDetails?.platform && getPlatformIcon(post.socialMediaDetails.platform)}
                          <span className="ml-2">{post.socialMediaDetails?.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>
                        {post.socialMediaDetails?.time 
                          ? formatPostDate(post.date, post.socialMediaDetails.time)
                          : formatPostDate(post.date)
                        }
                      </TableCell>
                      <TableCell>
                        {post.socialMediaDetails?.scheduledStatus && 
                          getStatusBadge(post.socialMediaDetails.scheduledStatus)
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsPosted(post)}
                            disabled={post.socialMediaDetails?.scheduledStatus === 'posted'}
                          >
                            Mark as Posted
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No upcoming social media posts scheduled</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Past Social Media Posts
          </CardTitle>
          <CardDescription>
            Previously published posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {pastPosts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Posted On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastPosts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {post.socialMediaDetails?.platform && getPlatformIcon(post.socialMediaDetails.platform)}
                          <span className="ml-2">{post.socialMediaDetails?.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>
                        {post.socialMediaDetails?.time 
                          ? formatPostDate(post.date, post.socialMediaDetails.time)
                          : formatPostDate(post.date)
                        }
                      </TableCell>
                      <TableCell>
                        {post.socialMediaDetails?.scheduledStatus && 
                          getStatusBadge(post.socialMediaDetails.scheduledStatus)
                        }
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No past social media posts</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaCalendar;

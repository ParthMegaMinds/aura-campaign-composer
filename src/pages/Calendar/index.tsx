import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore, isAfter, subDays } from 'date-fns';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/MainLayout';
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, Clock, Globe, FileType } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordPressService, WordPressPost } from '@/services/WordPressService';
import { toast } from "@/components/ui/sonner";
import { WordPressBlogManager } from '@/components/WordPress/BlogManager';

const CalendarPlanner = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [calendarItemsForSelectedDate, setCalendarItemsForSelectedDate] = useState([]);
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const { calendarItems, getContentById } = useData();
  
  // WordPress integration
  const [wpSiteUrl, setWpSiteUrl] = useState(WordPressService.getSiteUrl() || '');
  const [wpEnabled, setWpEnabled] = useState(Boolean(WordPressService.getSiteUrl()));
  const [wpUpcomingPosts, setWpUpcomingPosts] = useState<WordPressPost[]>([]);
  const [wpRecentPosts, setWpRecentPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter calendar items for selected date
  useEffect(() => {
    if (selected) {
      const formattedDate = format(selected, 'yyyy-MM-dd');
      const items = calendarItems.filter(item => {
        const itemDate = new Date(item.date);
        const formattedItemDate = format(itemDate, 'yyyy-MM-dd');
        return formattedItemDate === formattedDate;
      });
      setCalendarItemsForSelectedDate(items);
    }
  }, [selected, calendarItems]);
  
  // Get upcoming and recent posts
  useEffect(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const lastWeek = subDays(today, 7);
    
    // Filter upcoming posts (within next 7 days, excluding today)
    const upcoming = calendarItems
      .filter(item => {
        const itemDate = new Date(item.date);
        return isAfter(itemDate, today) && isBefore(itemDate, nextWeek);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setUpcomingPosts(upcoming);
    
    // Filter recent posts (within last 7 days, including today)
    const recent = calendarItems
      .filter(item => {
        const itemDate = new Date(item.date);
        return isBefore(itemDate, addDays(today, 1)) && isAfter(itemDate, lastWeek);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentPosts(recent);
  }, [calendarItems]);

  // Load WordPress posts when enabled
  useEffect(() => {
    if (wpEnabled && WordPressService.getSiteUrl()) {
      fetchWordPressData();
    }
  }, [wpEnabled]);

  const fetchWordPressData = async () => {
    if (!WordPressService.getSiteUrl()) return;
    
    setIsLoading(true);
    try {
      const [upcoming, recent] = await Promise.all([
        WordPressService.getUpcomingPosts(),
        WordPressService.getRecentPosts()
      ]);
      
      setWpUpcomingPosts(upcoming);
      setWpRecentPosts(recent);
    } catch (error) {
      console.error("Failed to fetch WordPress data:", error);
      toast.error("Failed to fetch WordPress posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWordPressUrl = () => {
    if (!wpSiteUrl) {
      toast.error("Please enter a valid WordPress site URL");
      return;
    }
    
    WordPressService.setSiteUrl(wpSiteUrl);
    setWpEnabled(true);
    toast.success("WordPress site URL saved");
    fetchWordPressData();
  };

  const dateHasCalendarItems = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return calendarItems.some(item => {
      const itemDate = new Date(item.date);
      const formattedItemDate = format(itemDate, 'yyyy-MM-dd');
      return formattedItemDate === formattedDate;
    });
  };

  const formatCalendarDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Content Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Calendar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Monthly View</CardTitle>
                <CardDescription>Select a date to view content</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selected}
                  onSelect={setSelected}
                  className={cn("border-none p-0 relative")}
                  modifiers={{
                    hasItems: (day) => dateHasCalendarItems(day),
                    today: new Date()
                  }}
                  modifiersClassNames={{
                    selected: "bg-primary text-primary-foreground",
                    today: "bg-accent text-accent-foreground",
                    hasItems: "bg-primary/10 font-bold"
                  }}
                />
              </CardContent>
            </Card>

            {/* WordPress Config */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  WordPress Integration
                </CardTitle>
                <CardDescription>
                  Connect to your WordPress site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="wp-enabled" 
                    checked={wpEnabled} 
                    onCheckedChange={setWpEnabled}
                    disabled={!WordPressService.getSiteUrl()}
                  />
                  <Label htmlFor="wp-enabled">Enable WordPress Integration</Label>
                </div>

                <div className="flex items-end space-x-2">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="wp-url">WordPress Site URL</Label>
                    <Input 
                      id="wp-url"
                      placeholder="https://your-wordpress-site.com" 
                      value={wpSiteUrl}
                      onChange={(e) => setWpSiteUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveWordPressUrl}>Save</Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Enter your WordPress site URL to fetch blog posts
                </p>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - Content details */}
          <div className="lg:col-span-2">
            {/* Selected date content */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Content for {selected && format(selected, 'MMMM d, yyyy')}
                </CardTitle>
                <CardDescription>
                  Content scheduled for this day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {calendarItemsForSelectedDate.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calendarItemsForSelectedDate.map(item => {
                        const content = item.contentId ? getContentById(item.contentId) : null;
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.platform}</TableCell>
                            <TableCell>{item.status}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No content scheduled for this day.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Content Tabs (Local & WordPress) */}
            <Tabs defaultValue="local" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="local">Local Content</TabsTrigger>
                <TabsTrigger value="wordpress" disabled={!wpEnabled}>WordPress Blog</TabsTrigger>
                <TabsTrigger value="wp-manager" disabled={!wpEnabled}>Blog Manager</TabsTrigger>
              </TabsList>
              
              {/* Local Content Tab */}
              <TabsContent value="local" className="space-y-6">
                {/* Upcoming posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Upcoming Posts
                    </CardTitle>
                    <CardDescription>
                      Content scheduled for the next 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      {upcomingPosts.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Platform</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {upcomingPosts.map(post => (
                              <TableRow key={post.id}>
                                <TableCell>{formatCalendarDate(post.date)}</TableCell>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.platform}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground">No upcoming posts in the next 7 days.</p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                {/* Recent posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Recent Posts
                    </CardTitle>
                    <CardDescription>
                      Content from the past 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      {recentPosts.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Platform</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recentPosts.map(post => (
                              <TableRow key={post.id}>
                                <TableCell>{formatCalendarDate(post.date)}</TableCell>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.platform}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground">No content posted in the last 7 days.</p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* WordPress Content Tab */}
              <TabsContent value="wordpress" className="space-y-6">
                {/* WordPress Upcoming posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Upcoming WordPress Posts
                    </CardTitle>
                    <CardDescription>
                      Blog posts scheduled for the next 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      {isLoading ? (
                        <p className="text-center py-4">Loading WordPress posts...</p>
                      ) : wpUpcomingPosts.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {wpUpcomingPosts.map(post => (
                              <TableRow key={post.id}>
                                <TableCell>{formatCalendarDate(post.date)}</TableCell>
                                <TableCell>
                                  <a 
                                    href={post.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline text-primary"
                                  >
                                    {post.title.rendered}
                                  </a>
                                </TableCell>
                                <TableCell>{post.status}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground">No upcoming WordPress posts scheduled.</p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                {/* WordPress Recent posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Recent WordPress Posts
                    </CardTitle>
                    <CardDescription>
                      Blog posts from the past 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      {isLoading ? (
                        <p className="text-center py-4">Loading WordPress posts...</p>
                      ) : wpRecentPosts.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Link</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {wpRecentPosts.map(post => (
                              <TableRow key={post.id}>
                                <TableCell>{formatCalendarDate(post.date)}</TableCell>
                                <TableCell dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                <TableCell>
                                  <a 
                                    href={post.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    View Post
                                  </a>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground">No recent WordPress posts published.</p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                {/* WordPress Blog Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>WordPress Blog Metrics</CardTitle>
                    <CardDescription>Summary of your WordPress content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary/30 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{wpRecentPosts.length}</div>
                        <div className="text-sm text-muted-foreground">Recent Posts</div>
                      </div>
                      <div className="bg-secondary/30 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{wpUpcomingPosts.length}</div>
                        <div className="text-sm text-muted-foreground">Upcoming Posts</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        onClick={fetchWordPressData} 
                        disabled={isLoading || !wpEnabled}
                      >
                        {isLoading ? "Refreshing..." : "Refresh Data"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* WordPress Blog Manager Tab */}
              <TabsContent value="wp-manager">
                <WordPressBlogManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarPlanner;

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordPressService, WordPressPost } from '@/services/WordPressService';
import { toast } from "@/components/ui/sonner";
import { FileType, Settings, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

import SchedulePostForm from './SchedulePostForm';
import WordPressCredentialsForm from './CredentialsForm';

export const WordPressBlogManager = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const wpConfigured = WordPressService.getSiteUrl();
  
  useEffect(() => {
    if (wpConfigured && activeTab === "posts") {
      fetchPosts();
    }
  }, [wpConfigured, activeTab]);
  
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const [recentPosts, upcomingPosts] = await Promise.all([
        WordPressService.getRecentPosts(),
        WordPressService.getScheduledPosts()
      ]);
      
      setPosts(recentPosts);
      setScheduledPosts(upcomingPosts);
    } catch (error) {
      console.error("Failed to fetch WordPress posts:", error);
      toast.error("Failed to fetch WordPress posts");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    fetchPosts();
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileType className="mr-2 h-5 w-5" />
          WordPress Blog Manager
        </CardTitle>
        <CardDescription>
          Manage your WordPress blog posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Post</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            {wpConfigured ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Posts</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Refresh"}
                  </Button>
                </div>
                
                <ScrollArea className="h-64">
                  {posts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.map(post => (
                          <TableRow key={post.id}>
                            <TableCell dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                            <TableCell>{formatDate(post.date)}</TableCell>
                            <TableCell>
                              <a 
                                href={post.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      {isLoading ? "Loading posts..." : "No recent posts found"}
                    </p>
                  )}
                </ScrollArea>
                
                <h3 className="text-lg font-semibold mt-6">Scheduled Posts</h3>
                <ScrollArea className="h-64">
                  {scheduledPosts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Scheduled For</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledPosts.map(post => (
                          <TableRow key={post.id}>
                            <TableCell dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                            <TableCell>{formatDate(post.date)}</TableCell>
                            <TableCell>
                              <a 
                                href={post.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Preview
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      {isLoading ? "Loading scheduled posts..." : "No scheduled posts found"}
                    </p>
                  )}
                </ScrollArea>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Please configure your WordPress site in the settings tab</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configure WordPress
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="schedule">
            <SchedulePostForm onSuccess={fetchPosts} />
          </TabsContent>
          
          <TabsContent value="settings">
            <WordPressCredentialsForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WordPressBlogManager;

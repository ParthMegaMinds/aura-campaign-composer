
import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore, isAfter, subDays } from 'date-fns';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/MainLayout';
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const CalendarPlanner = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [calendarItemsForSelectedDate, setCalendarItemsForSelectedDate] = useState([]);
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const { calendarItems, getContentById } = useData();
  
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
            <Card>
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
            
            {/* Upcoming posts */}
            <Card className="mb-6">
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarPlanner;


import React, { useState } from 'react';
import { useData, ContentItem, GraphicItem, SocialMediaPlatform } from '@/contexts/DataContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type SocialMediaSchedulerProps = {
  onScheduleSuccess?: () => void;
};

export const SocialMediaScheduler = ({ onScheduleSuccess }: SocialMediaSchedulerProps) => {
  const { contents, graphics, scheduleSocialMediaPost } = useData();
  
  // States for the form
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [showCalendar, setShowCalendar] = useState(false);
  const [platform, setPlatform] = useState<SocialMediaPlatform>("LinkedIn");
  const [time, setTime] = useState("09:00");
  const [contentId, setContentId] = useState("");
  const [graphicId, setGraphicId] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [title, setTitle] = useState("");
  
  // Filter content for social media only
  const socialMediaContents = contents.filter(content => 
    content.type === 'social'
  );
  
  // Get a content's title by ID
  const getContentTitle = (id: string): string => {
    const content = contents.find(c => c.id === id);
    return content ? content.title : "Unknown";
  };
  
  // Get a graphic's title by ID
  const getGraphicTitle = (id: string): string => {
    const graphic = graphics.find(g => g.id === id);
    return graphic ? graphic.title : "Unknown";
  };
  
  const getPlatformIcon = (platformName: SocialMediaPlatform) => {
    switch(platformName) {
      case "LinkedIn": return <Linkedin className="h-4 w-4" />;
      case "Twitter": return <Twitter className="h-4 w-4" />;
      case "Facebook": return <Facebook className="h-4 w-4" />;
      case "Instagram": return <Instagram className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };
  
  const handleContentSelect = (id: string) => {
    setContentId(id);
    // Auto-fill title based on selected content
    const content = contents.find(c => c.id === id);
    if (content) {
      setTitle(content.title);
      // Also look for a matching graphic
      const matchingGraphic = graphics.find(g => g.contentId === id);
      if (matchingGraphic) {
        setGraphicId(matchingGraphic.id);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please enter a title for the post");
      return;
    }
    
    if (!time) {
      toast.error("Please select a time");
      return;
    }
    
    // Process hashtags
    const hashtagArray = hashtags
      .split(/[,\s#]+/)
      .filter(tag => tag.trim())
      .map(tag => tag.trim().startsWith('#') ? tag.trim().substring(1) : tag.trim());
    
    const postDetails = {
      title,
      date: selectedDate.toISOString(),
      contentId: contentId || undefined,
      graphicId: graphicId || undefined,
      platform,
      status: 'scheduled' as const,
      socialMediaDetails: {
        platform,
        time,
        caption: caption || undefined,
        hashtags: hashtagArray.length > 0 ? hashtagArray : undefined,
        scheduledStatus: 'pending' as const
      }
    };
    
    scheduleSocialMediaPost(postDetails);
    
    // Reset form
    setTitle("");
    setContentId("");
    setGraphicId("");
    setCaption("");
    setHashtags("");
    
    // Callback if provided
    if (onScheduleSuccess) {
      onScheduleSuccess();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Schedule Social Media Post
        </CardTitle>
        <CardDescription>
          Create and schedule posts for your social media platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="post-title">Post Title</Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this post"
              required
            />
          </div>
          
          {/* Platform Selection */}
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select 
              value={platform} 
              onValueChange={(value: SocialMediaPlatform) => setPlatform(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LinkedIn">
                  <div className="flex items-center">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </div>
                </SelectItem>
                <SelectItem value="Twitter">
                  <div className="flex items-center">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </div>
                </SelectItem>
                <SelectItem value="Facebook">
                  <div className="flex items-center">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </div>
                </SelectItem>
                <SelectItem value="Instagram">
                  <div className="flex items-center">
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Post Date</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-time">Post Time</Label>
              <Input
                id="post-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Content Selection */}
          <div className="space-y-2">
            <Label>Select Content (Optional)</Label>
            <Select value={contentId} onValueChange={handleContentSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select existing content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {socialMediaContents.map(content => (
                  <SelectItem key={content.id} value={content.id}>{content.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Graphic Selection */}
          <div className="space-y-2">
            <Label>Select Graphic (Optional)</Label>
            <Select value={graphicId} onValueChange={setGraphicId}>
              <SelectTrigger>
                <SelectValue placeholder="Select graphic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {graphics.map(graphic => (
                  <SelectItem key={graphic.id} value={graphic.id}>{graphic.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="post-caption">Caption</Label>
            <Textarea
              id="post-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your post caption here..."
              className="min-h-24"
            />
          </div>
          
          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="post-hashtags">Hashtags</Label>
            <Input
              id="post-hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#marketing, #socialmedia, #content"
            />
            <p className="text-xs text-muted-foreground">Separate hashtags with commas or spaces</p>
          </div>
          
          <Button type="submit" className="w-full">Schedule Post</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SocialMediaScheduler;

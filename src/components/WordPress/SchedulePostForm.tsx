
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { WordPressService, WordPressTaxonomy } from '@/services/WordPressService';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const SchedulePostForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [publishNow, setPublishNow] = useState(false);
  const [categories, setCategories] = useState<WordPressTaxonomy[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [tags, setTags] = useState<WordPressTaxonomy[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Check if WordPress is configured
  const wpConfigured = WordPressService.getSiteUrl() && WordPressService.hasApiCredentials();
  
  // Fetch categories and tags on mount
  useEffect(() => {
    if (wpConfigured) {
      fetchTaxonomies();
    }
  }, [wpConfigured]);
  
  const fetchTaxonomies = async () => {
    try {
      const [fetchedCategories, fetchedTags] = await Promise.all([
        WordPressService.getCategories(),
        WordPressService.getTags()
      ]);
      
      setCategories(fetchedCategories);
      setTags(fetchedTags);
    } catch (error) {
      console.error("Error fetching taxonomies:", error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Please enter a post title");
      return;
    }
    
    if (!content) {
      toast.error("Please enter post content");
      return;
    }
    
    if (!publishNow && !scheduleDate) {
      toast.error("Please select a schedule date");
      return;
    }
    
    setIsLoading(true);
    
    try {
      let result;
      
      // Format content for WordPress
      const formattedContent = WordPressService.formatForWordPress(content);
      
      if (publishNow) {
        // Publish immediately
        result = await WordPressService.createPost({
          title,
          content: formattedContent,
          status: 'publish',
          categories: selectedCategories,
          tags: selectedTags
        });
      } else if (scheduleDate) {
        // Schedule for future
        result = await WordPressService.schedulePost(
          title, 
          formattedContent, 
          scheduleDate, 
          selectedCategories, 
          selectedTags
        );
      }
      
      if (result) {
        setTitle("");
        setContent("");
        setSelectedCategories([]);
        setSelectedTags([]);
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
      toast.error("Failed to schedule post");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  if (!wpConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WordPress Not Configured</CardTitle>
          <CardDescription>
            Please configure your WordPress site URL and add your credentials in the settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule WordPress Post</CardTitle>
        <CardDescription>
          Create and schedule a new blog post on your WordPress site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-title">Post Title</Label>
            <Input
              id="post-title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="post-content">Post Content</Label>
            <Textarea
              id="post-content"
              placeholder="Enter post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32"
              required
            />
            <p className="text-xs text-muted-foreground">
              You can use basic markdown formatting
            </p>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox
              id="publish-now"
              checked={publishNow}
              onCheckedChange={(checked) => setPublishNow(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="publish-now"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Publish immediately
              </Label>
              <p className="text-sm text-muted-foreground">
                If unchecked, post will be scheduled for publication on the selected date
              </p>
            </div>
          </div>
          
          {!publishNow && (
            <div className="space-y-2">
              <Label>Schedule Date</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? format(scheduleDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={(date) => {
                      setScheduleDate(date);
                      setShowCalendar(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {categories.length > 0 ? (
                categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <Label 
                      htmlFor={`category-${category.id}`}
                      className="text-sm"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">No categories found</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {tags.length > 0 ? (
                tags.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={() => handleTagToggle(tag.id)}
                    />
                    <Label 
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">No tags found</p>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : publishNow ? "Publish Now" : "Schedule Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SchedulePostForm;

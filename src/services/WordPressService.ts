
import { toast } from "@/components/ui/sonner";

export type WordPressPost = {
  id: number;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  status: string; // 'publish', 'future', 'draft', etc.
};

export const WordPressService = {
  siteUrl: '',
  
  // Set WordPress site URL
  setSiteUrl(url: string) {
    // Ensure URL doesn't end with a slash
    this.siteUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    // Store in localStorage for persistence
    localStorage.setItem('wordpress_site_url', this.siteUrl);
  },
  
  // Get stored WordPress site URL
  getSiteUrl(): string {
    if (!this.siteUrl) {
      const storedUrl = localStorage.getItem('wordpress_site_url');
      if (storedUrl) this.siteUrl = storedUrl;
    }
    return this.siteUrl;
  },
  
  // Fetch posts from WordPress
  async getPosts(params: { status?: string, per_page?: number, after?: string, before?: string } = {}): Promise<WordPressPost[]> {
    const siteUrl = this.getSiteUrl();
    
    if (!siteUrl) {
      toast.error("WordPress site URL not configured");
      return [];
    }
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params.after) queryParams.append('after', params.after);
      if (params.before) queryParams.append('before', params.before);
      
      const response = await fetch(`${siteUrl}/wp-json/wp/v2/posts?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch WordPress posts: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching WordPress posts:", error);
      toast.error("Failed to fetch WordPress posts");
      return [];
    }
  },
  
  // Get published posts
  async getPublishedPosts(count: number = 10): Promise<WordPressPost[]> {
    return this.getPosts({ status: 'publish', per_page: count });
  },
  
  // Get scheduled posts
  async getScheduledPosts(count: number = 10): Promise<WordPressPost[]> {
    return this.getPosts({ status: 'future', per_page: count });
  },
  
  // Get recent posts (published in the last X days)
  async getRecentPosts(days: number = 7): Promise<WordPressPost[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const after = date.toISOString();
    
    return this.getPosts({ status: 'publish', after, per_page: 20 });
  },
  
  // Get upcoming posts (scheduled for the next X days)
  async getUpcomingPosts(days: number = 7): Promise<WordPressPost[]> {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    const after = now.toISOString();
    const before = future.toISOString();
    
    return this.getPosts({ status: 'future', after, before, per_page: 20 });
  }
};

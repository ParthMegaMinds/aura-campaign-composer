
import { toast } from "@/components/ui/sonner";

export type WordPressPost = {
  id: number;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  link: string;
  status: string; // 'publish', 'future', 'draft', etc.
  categories?: number[];
  tags?: number[];
  featured_media?: number;
};

export type WordPressTaxonomy = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
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
  async getPosts(params: { status?: string, per_page?: number, after?: string, before?: string, categories?: number[], tags?: number[] } = {}): Promise<WordPressPost[]> {
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
      if (params.categories && params.categories.length > 0) {
        queryParams.append('categories', params.categories.join(','));
      }
      if (params.tags && params.tags.length > 0) {
        queryParams.append('tags', params.tags.join(','));
      }
      
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
  },

  // Get post by ID
  async getPost(id: number): Promise<WordPressPost | null> {
    const siteUrl = this.getSiteUrl();
    
    if (!siteUrl) {
      toast.error("WordPress site URL not configured");
      return null;
    }
    
    try {
      const response = await fetch(`${siteUrl}/wp-json/wp/v2/posts/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch WordPress post: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching WordPress post:", error);
      toast.error("Failed to fetch WordPress post");
      return null;
    }
  },

  // Get categories
  async getCategories(): Promise<WordPressTaxonomy[]> {
    const siteUrl = this.getSiteUrl();
    
    if (!siteUrl) {
      toast.error("WordPress site URL not configured");
      return [];
    }
    
    try {
      const response = await fetch(`${siteUrl}/wp-json/wp/v2/categories?per_page=100`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch WordPress categories: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching WordPress categories:", error);
      toast.error("Failed to fetch WordPress categories");
      return [];
    }
  },

  // Get tags
  async getTags(): Promise<WordPressTaxonomy[]> {
    const siteUrl = this.getSiteUrl();
    
    if (!siteUrl) {
      toast.error("WordPress site URL not configured");
      return [];
    }
    
    try {
      const response = await fetch(`${siteUrl}/wp-json/wp/v2/tags?per_page=100`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch WordPress tags: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching WordPress tags:", error);
      toast.error("Failed to fetch WordPress tags");
      return [];
    }
  },

  // Create draft post
  async createDraft(title: string, content: string, categoryIds: number[] = [], tagIds: number[] = []): Promise<WordPressPost | null> {
    const siteUrl = this.getSiteUrl();
    
    if (!siteUrl) {
      toast.error("WordPress site URL not configured");
      return null;
    }
    
    try {
      // Note: This would require authentication which we can't do securely on the client side
      // In a real implementation, this would need to be handled by a backend service
      toast.error("Creating WordPress posts requires server-side implementation with authentication");
      return null;
      
      // The code below would work with proper authentication
      /*
      const response = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Would need proper auth
        },
        body: JSON.stringify({
          title,
          content,
          status: 'draft',
          categories: categoryIds,
          tags: tagIds
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create WordPress draft: ${response.statusText}`);
      }
      
      return await response.json();
      */
    } catch (error) {
      console.error("Error creating WordPress draft:", error);
      toast.error("Failed to create WordPress draft");
      return null;
    }
  },

  // Get blog stats
  async getBlogStats(): Promise<{totalPosts: number, recentPosts: number, scheduledPosts: number}> {
    try {
      const siteUrl = this.getSiteUrl();
      
      if (!siteUrl) {
        return {
          totalPosts: 0,
          recentPosts: 0,
          scheduledPosts: 0
        };
      }
      
      // Fetch total post count
      const countResponse = await fetch(`${siteUrl}/wp-json/wp/v2/posts?per_page=1&status=publish`);
      const totalPosts = parseInt(countResponse.headers.get('X-WP-Total') || '0');
      
      // Fetch recent posts count (last 7 days)
      const recentPosts = (await this.getRecentPosts(7)).length;
      
      // Fetch scheduled posts count
      const scheduledPosts = (await this.getScheduledPosts(100)).length;
      
      return {
        totalPosts,
        recentPosts,
        scheduledPosts
      };
    } catch (error) {
      console.error("Error fetching WordPress stats:", error);
      return {
        totalPosts: 0,
        recentPosts: 0,
        scheduledPosts: 0
      };
    }
  },

  // Format content for WordPress
  formatForWordPress(content: string): string {
    // Convert markdown-like content to WordPress content
    // This is a simple implementation - a real one would need a proper markdown parser
    let formatted = content;
    
    // Convert headings
    formatted = formatted.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert bullet points
    formatted = formatted.replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>');
    formatted = formatted.replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>');
    
    // Convert paragraphs
    formatted = formatted.split('\n\n').map(p => {
      if (!p.trim().startsWith('<')) {
        return `<p>${p}</p>`;
      }
      return p;
    }).join('\n');
    
    return formatted;
  },

  // Test connection to WordPress site
  async testConnection(): Promise<boolean> {
    const siteUrl = this.getSiteUrl();
    
    if (!siteUrl) {
      return false;
    }
    
    try {
      const response = await fetch(`${siteUrl}/wp-json/wp/v2`);
      return response.ok;
    } catch (error) {
      console.error("WordPress connection test failed:", error);
      return false;
    }
  }
};

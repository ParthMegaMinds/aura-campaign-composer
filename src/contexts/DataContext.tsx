
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

export type ICP = {
  id: string;
  name: string;
  industry: string;
  techStack: string[];
  location: string;
  persona: string[];
  businessSize: string;
  tone: string;
  designations?: string[]; // Added designations field
};

export type ContentItem = {
  id: string;
  title: string;
  content: string;
  type: 'social' | 'email' | 'blog' | 'landing' | 'proposal';
  icpId: string;
  createdAt: string;
  aiGenerated: boolean;
};

export type GraphicItem = {
  id: string;
  title: string;
  imageUrl: string;
  contentId?: string;
  format: string;
  createdAt: string;
};

export type SocialMediaPlatform = 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram' | 'Pinterest' | 'TikTok';

export type CalendarItem = {
  id: string;
  title: string;
  date: string;
  contentId?: string;
  graphicId?: string;
  platform: string;
  status: 'draft' | 'ready' | 'scheduled' | 'live';
  assignee?: string;
  socialMediaDetails?: {
    platform: SocialMediaPlatform;
    time: string; // HH:MM format
    caption?: string;
    hashtags?: string[];
    scheduledStatus?: 'pending' | 'posted' | 'failed';
    postUrl?: string;
  };
};

export type Campaign = {
  id: string;
  title: string;
  description: string;
  icpId: string;
  startDate: string;
  endDate: string;
  contents: string[]; // ContentItem IDs
  graphics: string[]; // GraphicItem IDs
  calendarItems: string[]; // CalendarItem IDs
  createdAt: string;
};

type DataContextType = {
  icps: ICP[];
  contents: ContentItem[];
  graphics: GraphicItem[];
  calendarItems: CalendarItem[];
  campaigns: Campaign[];
  addICP: (icp: Omit<ICP, 'id'>) => void;
  updateICP: (icp: ICP) => void;
  deleteICP: (id: string) => void;
  addContent: (content: Omit<ContentItem, 'id' | 'createdAt'>) => string;
  updateContent: (content: ContentItem) => void;
  deleteContent: (id: string) => void;
  addGraphic: (graphic: Omit<GraphicItem, 'id' | 'createdAt'>) => string;
  updateGraphic: (graphic: GraphicItem) => void;
  deleteGraphic: (id: string) => void;
  addCalendarItem: (item: Omit<CalendarItem, 'id'>) => string;
  updateCalendarItem: (item: CalendarItem) => void;
  deleteCalendarItem: (id: string) => void;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => string;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  getICPById: (id: string) => ICP | undefined;
  getContentById: (id: string) => ContentItem | undefined;
  getGraphicById: (id: string) => GraphicItem | undefined;
  getCalendarItemById: (id: string) => CalendarItem | undefined;
  getCampaignById: (id: string) => Campaign | undefined;
  scheduleSocialMediaPost: (postDetails: Omit<CalendarItem, 'id'>) => string;
  getSocialMediaPosts: (platform?: SocialMediaPlatform) => CalendarItem[];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [icps, setICPs] = useState<ICP[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [graphics, setGraphics] = useState<GraphicItem[]>([]);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const storedICPs = localStorage.getItem('aiva_icps');
      const storedContents = localStorage.getItem('aiva_contents');
      const storedGraphics = localStorage.getItem('aiva_graphics');
      const storedCalendarItems = localStorage.getItem('aiva_calendar_items');
      const storedCampaigns = localStorage.getItem('aiva_campaigns');

      if (storedICPs) setICPs(JSON.parse(storedICPs));
      if (storedContents) setContents(JSON.parse(storedContents));
      if (storedGraphics) setGraphics(JSON.parse(storedGraphics));
      if (storedCalendarItems) setCalendarItems(JSON.parse(storedCalendarItems));
      if (storedCampaigns) setCampaigns(JSON.parse(storedCampaigns));
    };

    loadData();
  }, []);

  // Add default data for demo purposes
  useEffect(() => {
    if (icps.length === 0) {
      // Add sample ICP
      const sampleICP = {
        id: "icp-1",
        name: "Tech SaaS CTO",
        industry: "SaaS",
        techStack: ["React", "Node.js"],
        location: "United States",
        persona: ["CTO", "Tech Lead"],
        businessSize: "SME",
        tone: "Professional",
        designations: ["cto", "developers"] // Added sample designations
      };
      
      setICPs([sampleICP]);
      localStorage.setItem('aiva_icps', JSON.stringify([sampleICP]));

      // Add sample content
      const sampleContent = {
        id: "content-1",
        title: "AI Benefits for SaaS",
        content: "Discover how AI can transform your SaaS operations and drive efficiency across development, customer service, and marketing teams.",
        type: "social" as const,
        icpId: "icp-1",
        createdAt: new Date().toISOString(),
        aiGenerated: true
      };

      setContents([sampleContent]);
      localStorage.setItem('aiva_contents', JSON.stringify([sampleContent]));

      // Add sample graphic
      const sampleGraphic = {
        id: "graphic-1",
        title: "AI Benefits Infographic",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        contentId: "content-1",
        format: "LinkedIn",
        createdAt: new Date().toISOString()
      };

      setGraphics([sampleGraphic]);
      localStorage.setItem('aiva_graphics', JSON.stringify([sampleGraphic]));

      // Add sample calendar item with social media details
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const sampleCalendarItem = {
        id: "calendar-1",
        title: "AI Benefits Post",
        date: nextWeek.toISOString(),
        contentId: "content-1",
        graphicId: "graphic-1",
        platform: "LinkedIn",
        status: "ready" as const,
        socialMediaDetails: {
          platform: "LinkedIn" as SocialMediaPlatform,
          time: "09:30",
          caption: "Excited to share our latest insights on AI benefits for SaaS companies! #AI #SaaS #Innovation",
          hashtags: ["AI", "SaaS", "Innovation"],
          scheduledStatus: "pending" as const
        }
      };

      setCalendarItems([sampleCalendarItem]);
      localStorage.setItem('aiva_calendar_items', JSON.stringify([sampleCalendarItem]));

      // Add sample campaign
      const sampleCampaign = {
        id: "campaign-1",
        title: "Q2 AI Awareness",
        description: "Campaign focusing on AI benefits for SaaS businesses",
        icpId: "icp-1",
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        contents: ["content-1"],
        graphics: ["graphic-1"],
        calendarItems: ["calendar-1"],
        createdAt: new Date().toISOString()
      };

      setCampaigns([sampleCampaign]);
      localStorage.setItem('aiva_campaigns', JSON.stringify([sampleCampaign]));
    }
  }, [icps.length]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aiva_icps', JSON.stringify(icps));
  }, [icps]);

  useEffect(() => {
    localStorage.setItem('aiva_contents', JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem('aiva_graphics', JSON.stringify(graphics));
  }, [graphics]);

  useEffect(() => {
    localStorage.setItem('aiva_calendar_items', JSON.stringify(calendarItems));
  }, [calendarItems]);

  useEffect(() => {
    localStorage.setItem('aiva_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // ICP operations
  const addICP = (icp: Omit<ICP, 'id'>) => {
    const newICP = { ...icp, id: `icp-${Date.now()}` };
    setICPs(prev => [...prev, newICP]);
    toast.success("ICP created successfully");
  };

  const updateICP = (icp: ICP) => {
    setICPs(prev => prev.map(item => item.id === icp.id ? icp : item));
    toast.success("ICP updated successfully");
  };

  const deleteICP = (id: string) => {
    setICPs(prev => prev.filter(item => item.id !== id));
    toast.success("ICP deleted successfully");
  };

  // Content operations
  const addContent = (content: Omit<ContentItem, 'id' | 'createdAt'>) => {
    const id = `content-${Date.now()}`;
    const newContent = { ...content, id, createdAt: new Date().toISOString() };
    setContents(prev => [...prev, newContent]);
    toast.success("Content created successfully");
    return id;
  };

  const updateContent = (content: ContentItem) => {
    setContents(prev => prev.map(item => item.id === content.id ? content : item));
    toast.success("Content updated successfully");
  };

  const deleteContent = (id: string) => {
    setContents(prev => prev.filter(item => item.id !== id));
    toast.success("Content deleted successfully");
  };

  // Graphic operations
  const addGraphic = (graphic: Omit<GraphicItem, 'id' | 'createdAt'>) => {
    const id = `graphic-${Date.now()}`;
    const newGraphic = { ...graphic, id, createdAt: new Date().toISOString() };
    setGraphics(prev => [...prev, newGraphic]);
    toast.success("Graphic created successfully");
    return id;
  };

  const updateGraphic = (graphic: GraphicItem) => {
    setGraphics(prev => prev.map(item => item.id === graphic.id ? graphic : item));
    toast.success("Graphic updated successfully");
  };

  const deleteGraphic = (id: string) => {
    setGraphics(prev => prev.filter(item => item.id !== id));
    toast.success("Graphic deleted successfully");
  };

  // Calendar operations
  const addCalendarItem = (item: Omit<CalendarItem, 'id'>) => {
    const id = `calendar-${Date.now()}`;
    const newItem = { ...item, id };
    setCalendarItems(prev => [...prev, newItem]);
    toast.success("Calendar item created successfully");
    return id;
  };

  const updateCalendarItem = (item: CalendarItem) => {
    setCalendarItems(prev => prev.map(calItem => calItem.id === item.id ? item : calItem));
    toast.success("Calendar item updated successfully");
  };

  const deleteCalendarItem = (id: string) => {
    setCalendarItems(prev => prev.filter(item => item.id !== id));
    toast.success("Calendar item deleted successfully");
  };

  // New function for social media post scheduling
  const scheduleSocialMediaPost = (postDetails: Omit<CalendarItem, 'id'>) => {
    const id = addCalendarItem(postDetails);
    toast.success("Social media post scheduled successfully");
    return id;
  };

  // Get social media posts (filter by platform if provided)
  const getSocialMediaPosts = (platform?: SocialMediaPlatform) => {
    return calendarItems.filter(item => 
      item.socialMediaDetails && 
      (!platform || item.socialMediaDetails.platform === platform)
    );
  };

  // Campaign operations
  const addCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt'>) => {
    const id = `campaign-${Date.now()}`;
    const newCampaign = { ...campaign, id, createdAt: new Date().toISOString() };
    setCampaigns(prev => [...prev, newCampaign]);
    toast.success("Campaign created successfully");
    return id;
  };

  const updateCampaign = (campaign: Campaign) => {
    setCampaigns(prev => prev.map(item => item.id === campaign.id ? campaign : item));
    toast.success("Campaign updated successfully");
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(item => item.id !== id));
    toast.success("Campaign deleted successfully");
  };

  // Getter functions
  const getICPById = (id: string) => icps.find(icp => icp.id === id);
  const getContentById = (id: string) => contents.find(content => content.id === id);
  const getGraphicById = (id: string) => graphics.find(graphic => graphic.id === id);
  const getCalendarItemById = (id: string) => calendarItems.find(item => item.id === id);
  const getCampaignById = (id: string) => campaigns.find(campaign => campaign.id === id);

  return (
    <DataContext.Provider value={{
      icps,
      contents,
      graphics,
      calendarItems,
      campaigns,
      addICP,
      updateICP,
      deleteICP,
      addContent,
      updateContent,
      deleteContent,
      addGraphic,
      updateGraphic,
      deleteGraphic,
      addCalendarItem,
      updateCalendarItem,
      deleteCalendarItem,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      getICPById,
      getContentById,
      getGraphicById,
      getCalendarItemById,
      getCampaignById,
      scheduleSocialMediaPost,
      getSocialMediaPosts
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

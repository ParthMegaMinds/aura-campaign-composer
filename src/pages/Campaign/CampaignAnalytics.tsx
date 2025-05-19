
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO, subDays, differenceInDays } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { DownloadIcon, FileTextIcon, ChevronLeft } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';

const CampaignAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'all'>('all');
  const { campaigns, getICPById, getContentById, getGraphicById, getCalendarItemById } = useData();
  
  const campaign = campaigns.find(c => c.id === id);
  
  if (!campaign) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
          <p className="text-muted-foreground mb-8">The campaign you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/campaigns')}>Return to Campaigns</Button>
        </div>
      </MainLayout>
    );
  }
  
  const icp = getICPById(campaign.icpId);
  
  const campaignContents = campaign.contents
    .map(contentId => getContentById(contentId))
    .filter(content => content !== undefined);
    
  const campaignGraphics = campaign.graphics
    .map(graphicId => getGraphicById(graphicId))
    .filter(graphic => graphic !== undefined);
    
  const campaignCalendarItems = campaign.calendarItems
    .map(itemId => getCalendarItemById(itemId))
    .filter(item => item !== undefined);
  
  // Filter data based on date range
  const filteredCalendarItems = useMemo(() => {
    if (dateRange === 'all') return campaignCalendarItems;
    
    const cutoffDate = dateRange === '7days' 
      ? subDays(new Date(), 7) 
      : subDays(new Date(), 30);
      
    return campaignCalendarItems.filter(item => 
      new Date(item!.date) >= cutoffDate
    );
  }, [campaignCalendarItems, dateRange]);
  
  // Generate engagement metrics (mock data in a real app)
  const generateEngagementMetrics = () => {
    const baseViews = Math.floor(Math.random() * 1000) + 500;
    const baseClicks = Math.floor(baseViews * (Math.random() * 0.3 + 0.1));
    const baseConversions = Math.floor(baseClicks * (Math.random() * 0.2 + 0.05));
    
    // Scale based on calendar items count
    const scaleFactor = Math.max(1, campaignCalendarItems.length / 2);
    
    return {
      views: Math.floor(baseViews * scaleFactor),
      clicks: Math.floor(baseClicks * scaleFactor),
      conversions: Math.floor(baseConversions * scaleFactor),
      engagement: Math.floor((baseClicks / baseViews) * 100)
    };
  };
  
  const metrics = useMemo(generateEngagementMetrics, [campaignCalendarItems.length]);
  
  // Platform performance data
  const platformData = useMemo(() => {
    const platforms = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Email', 'Blog'];
    return platforms.map(platform => {
      const itemsCount = campaignCalendarItems.filter(item => 
        item?.platform === platform
      ).length;
      
      if (itemsCount === 0) return null;
      
      const engagementRate = Math.floor(Math.random() * 20) + 5;
      const clicks = Math.floor(Math.random() * 200) + 50 * itemsCount;
      
      return {
        name: platform,
        posts: itemsCount,
        engagement: engagementRate,
        clicks: clicks,
        conversions: Math.floor(clicks * (Math.random() * 0.2 + 0.05))
      };
    }).filter(item => item !== null);
  }, [campaignCalendarItems]);
  
  // Time-series data for content performance
  const timeSeriesData = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, 30);
    const days = differenceInDays(today, startDate);
    
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - i - 1);
      return {
        date: format(date, 'MMM dd'),
        views: Math.floor(Math.random() * 200) + 50,
        engagement: Math.floor(Math.random() * 50) + 10,
      };
    });
  }, []);
  
  // Content type distribution data
  const contentTypeData = useMemo(() => {
    const types: Record<string, number> = {};
    
    campaignContents.forEach(content => {
      if (!content) return;
      const type = content.type;
      types[type] = (types[type] || 0) + 1;
    });
    
    return Object.entries(types).map(([name, value]) => ({
      name,
      value
    }));
  }, [campaignContents]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF or CSV report
    toast.success('Report download started');
    setTimeout(() => {
      toast.success('Campaign report downloaded successfully');
    }, 2000);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0"
                onClick={() => navigate(`/campaign/${id}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Campaign
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{campaign.title} Analytics</h1>
            <p className="text-muted-foreground">
              {format(parseISO(campaign.startDate), 'MMM d, yyyy')} - {format(parseISO(campaign.endDate), 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleDownloadReport}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => navigate(`/campaign/${id}/pdf-report`)}>
              <FileTextIcon className="mr-2 h-4 w-4" />
              View PDF Report
            </Button>
          </div>
        </div>

        {/* Date range selector */}
        <div className="flex justify-end">
          <Tabs defaultValue={dateRange} onValueChange={(v) => setDateRange(v as any)}>
            <TabsList>
              <TabsTrigger value="7days">Last 7 days</TabsTrigger>
              <TabsTrigger value="30days">Last 30 days</TabsTrigger>
              <TabsTrigger value="all">All time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Overview metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.views.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10)}% from last period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.clicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20)}% from last period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 15)}% from last period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.engagement}%</div>
              <p className="text-xs text-muted-foreground">{Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 5)}% from last period</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and detailed data */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platform">Platform Data</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            {/* Time series chart */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Over Time</CardTitle>
                <CardDescription>Views and engagement metrics for the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    views: { color: "#0088FE" },
                    engagement: { color: "#00C49F" },
                  }}
                >
                  <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#0088FE" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="engagement" stroke="#00C49F" />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            {/* Content type distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Type Distribution</CardTitle>
                  <CardDescription>Breakdown by content format</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{}}>
                    <PieChart>
                      <Pie
                        data={contentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {contentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Status</CardTitle>
                  <CardDescription>Content status breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{}}>
                    <BarChart data={[
                      { name: 'Draft', count: campaignCalendarItems.filter(i => i?.status === 'draft').length },
                      { name: 'Ready', count: campaignCalendarItems.filter(i => i?.status === 'ready').length },
                      { name: 'Scheduled', count: campaignCalendarItems.filter(i => i?.status === 'scheduled').length },
                      { name: 'Live', count: campaignCalendarItems.filter(i => i?.status === 'live').length },
                    ]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#8884d8">
                        {[0, 1, 2, 3].map((index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="platform" className="space-y-6 pt-4">
            {/* Platform performance */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance Comparison</CardTitle>
                <CardDescription>Comparing engagement across different platforms</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer config={{}}>
                  <BarChart data={platformData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="engagement" name="Engagement %" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="clicks" name="Clicks" fill="#82ca9d" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            {/* Platform data table */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Data</CardTitle>
                <CardDescription>Detailed metrics by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {platformData.map((platform) => (
                      <TableRow key={platform.name}>
                        <TableCell className="font-medium">{platform.name}</TableCell>
                        <TableCell>{platform.posts}</TableCell>
                        <TableCell>{platform.engagement}%</TableCell>
                        <TableCell>{platform.clicks}</TableCell>
                        <TableCell>{platform.conversions}</TableCell>
                        <TableCell className="text-right">
                          {((platform.clicks / (platform.posts * 100)) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6 pt-4">
            {/* Content performance */}
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Analytics for individual content pieces</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignContents.map((content) => {
                      const views = Math.floor(Math.random() * 500) + 100;
                      const engagement = Math.floor(Math.random() * 100) + 20;
                      const clicks = Math.floor(Math.random() * 200) + 50;
                      const ctr = ((clicks / views) * 100).toFixed(1);
                      
                      return (
                        <TableRow key={content!.id}>
                          <TableCell className="font-medium">{content!.title}</TableCell>
                          <TableCell>{content!.type}</TableCell>
                          <TableCell>{views}</TableCell>
                          <TableCell>{engagement}</TableCell>
                          <TableCell>{clicks}</TableCell>
                          <TableCell className="text-right">{ctr}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* AI-generated insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>Automated analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-md text-blue-800">
                  <h3 className="font-medium text-lg mb-2">Performance Overview</h3>
                  <p>
                    This campaign is performing {Math.random() > 0.5 ? 'better' : 'slightly below'} average compared to your other campaigns. 
                    {' '}{campaignCalendarItems.length > 5 ? 'The high number of content pieces is helping with visibility.' : 'Consider adding more content pieces to increase visibility.'}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-100 rounded-md text-green-800">
                  <h3 className="font-medium text-lg mb-2">Top Performing Content</h3>
                  <p>
                    {campaignContents.length > 0 ? `"${campaignContents[0]!.title}" is your best performing content, with high engagement rates.` : 'No content performance data available yet.'}
                    {' '}We recommend creating more {campaignContents.length > 0 ? campaignContents[0]!.type : 'social'} posts based on this success.
                  </p>
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-md text-amber-800">
                  <h3 className="font-medium text-lg mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Post more frequently on {platformData.length > 0 ? platformData[0].name : 'LinkedIn'} for higher engagement</li>
                    <li>Experiment with different content formats</li>
                    <li>Optimize posting times based on audience activity</li>
                    <li>Consider A/B testing different content approaches</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CampaignAnalytics;

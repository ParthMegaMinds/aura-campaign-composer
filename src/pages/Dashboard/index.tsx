
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         PieChart, Pie, Legend, Cell, BarChart, Bar } from 'recharts';
import { ChartLine, PieChartIcon, BarChart3, BarChart2 } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const Dashboard = () => {
  const { campaigns, contents, calendarItems } = useData();
  const navigate = useNavigate();
  
  // Sample data for charts - in a real app, this would be derived from actual data
  const contentOverTimeData = [
    { name: 'Jan', count: 4 },
    { name: 'Feb', count: 6 },
    { name: 'Mar', count: 8 },
    { name: 'Apr', count: 10 },
    { name: 'May', count: 7 },
    { name: 'Jun', count: 12 },
    { name: 'Jul', count: 16 },
  ];
  
  const contentTypeData = [
    { name: 'Blog Posts', value: 35 },
    { name: 'Social Media', value: 45 },
    { name: 'Videos', value: 20 },
  ];
  
  const campaignStatusData = [
    { name: 'Active', count: 4 },
    { name: 'Completed', count: 2 },
    { name: 'Planned', count: 3 },
  ];
  
  const recentCampaigns = campaigns
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const CONTENT_TYPE_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
  
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <CardDescription>All marketing campaigns</CardDescription>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <PieChartIcon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10)}% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Content Pieces</CardTitle>
                <CardDescription>Total content created</CardDescription>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contents.length}</div>
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20)}% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Scheduled Items</CardTitle>
                <CardDescription>Upcoming content</CardDescription>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <ChartLine className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calendarItems.length}</div>
              <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 15)}% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Production Over Time</CardTitle>
              <CardDescription>Monthly content creation trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  count: { color: "#8884d8" }
                }}
              >
                <LineChart data={contentOverTimeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
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
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CONTENT_TYPE_COLORS[index % CONTENT_TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
              <CardDescription>Current campaign progress</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}}>
                <BarChart data={campaignStatusData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#8884d8">
                    {campaignStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CONTENT_TYPE_COLORS[index % CONTENT_TYPE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Campaigns</CardTitle>
                <Button 
                  variant="link" 
                  className="text-sm p-0 h-auto"
                  onClick={() => navigate('/campaigns')}
                >
                  View All
                </Button>
              </div>
              <CardDescription>Campaign analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.length > 0 ? (
                  recentCampaigns.map(campaign => (
                    <div 
                      key={campaign.id}
                      className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="truncate">
                        <p className="font-medium truncate">{campaign.title}</p>
                        <p className="text-xs text-muted-foreground">{campaign.contents.length} pieces of content</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/campaign/${campaign.id}/analytics`)}
                      >
                        <BarChart2 className="h-3.5 w-3.5 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No campaigns created yet</p>
                    <Button 
                      variant="link" 
                      className="mt-2 h-auto p-0"
                      onClick={() => navigate('/create-campaign')}
                    >
                      Create your first campaign
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

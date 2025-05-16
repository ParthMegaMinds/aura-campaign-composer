
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/MainLayout';
import { Plus, BarChart3, Clock, Calendar, Lightbulb, ChartLineUp, FileBarChart, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, Bar, Pie, LineChart, BarChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { campaigns, contents, graphics, icps } = useData();

  const analytics = {
    totalCampaigns: campaigns.length,
    totalContent: contents.length,
    totalGraphics: graphics.length,
    totalIcps: icps.length
  };

  // Get recent content
  const recentContent = contents.slice(0, 3);
  
  // Get recent campaigns
  const recentCampaigns = campaigns.slice(0, 2);

  // Content type distribution data for pie chart
  const contentTypeData = [
    { name: 'Social', value: contents.filter(c => c.type === 'social').length || 0 },
    { name: 'Email', value: contents.filter(c => c.type === 'email').length || 0 },
    { name: 'Blog', value: contents.filter(c => c.type === 'blog').length || 1 },
    { name: 'Landing', value: contents.filter(c => c.type === 'landing').length || 0 },
    { name: 'Proposal', value: contents.filter(c => c.type === 'proposal').length || 0 },
  ];

  // Mock data for content production over time
  const contentCreationData = [
    { name: 'Jan', content: 4, graphics: 2 },
    { name: 'Feb', content: 6, graphics: 5 },
    { name: 'Mar', content: 8, graphics: 7 },
    { name: 'Apr', content: 10, graphics: 8 },
    { name: 'May', content: contents.length, graphics: graphics.length },
  ];

  // Campaign status chart data
  const campaignStatusData = [
    { name: 'Active', value: campaigns.filter(c => new Date(c.endDate) > new Date()).length || 1 },
    { name: 'Completed', value: campaigns.filter(c => new Date(c.endDate) <= new Date()).length || 0 },
    { name: 'Draft', value: 1 },
  ];

  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981'];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back to your AIVA marketing assistant
            </p>
          </div>
          <Button onClick={() => navigate('/create-campaign')}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Campaigns</p>
                  <p className="text-3xl font-bold">{analytics.totalCampaigns}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Content Items</p>
                  <p className="text-3xl font-bold">{analytics.totalContent}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Graphics</p>
                  <p className="text-3xl font-bold">{analytics.totalGraphics}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ICPs</p>
                  <p className="text-3xl font-bold">{analytics.totalIcps}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Lightbulb className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Production Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Content Production</CardTitle>
              <CardDescription>Content and graphics created over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                config={{
                  content: {
                    color: '#8B5CF6'
                  },
                  graphics: {
                    color: '#D946EF'
                  }
                }}
              >
                <LineChart data={contentCreationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={(props) => (
                    <ChartTooltipContent {...props} />
                  )} />
                  <Legend />
                  <Line type="monotone" dataKey="content" stroke="#8B5CF6" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="graphics" stroke="#D946EF" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Content Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Content Type Distribution</CardTitle>
              <CardDescription>Breakdown of content by type</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <ChartContainer
                config={{
                  Social: {
                    color: '#8B5CF6'
                  },
                  Email: {
                    color: '#D946EF'
                  },
                  Blog: {
                    color: '#F97316'
                  },
                  Landing: {
                    color: '#0EA5E9'
                  },
                  Proposal: {
                    color: '#10B981'
                  }
                }}
              >
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => (
                    <ChartTooltipContent {...props} />
                  )} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Campaign Status Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
              <CardDescription>Overview of campaign statuses</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ChartContainer
                config={{
                  Active: {
                    color: '#8B5CF6'
                  },
                  Completed: {
                    color: '#10B981'
                  },
                  Draft: {
                    color: '#F97316'
                  }
                }}
              >
                <BarChart data={campaignStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={(props) => (
                    <ChartTooltipContent {...props} />
                  )} />
                  <Bar dataKey="value" fill="#8B5CF6">
                    {campaignStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* My Drafts */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>My Drafts</CardTitle>
              <CardDescription>Your recently created content</CardDescription>
            </CardHeader>
            <CardContent>
              {recentContent.length > 0 ? (
                <div className="space-y-4">
                  {recentContent.map(content => (
                    <div key={content.id} className="flex items-start border rounded-lg p-3 hover:bg-accent cursor-pointer" onClick={() => navigate(`/content/${content.id}`)}>
                      <div className="flex-1">
                        <p className="font-medium">{content.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{content.content.substring(0, 60)}...</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded-md">
                            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                          </span>
                          {content.aiGenerated && (
                            <span className="ml-2 text-xs bg-aiva-100 text-aiva-700 px-2 py-0.5 rounded-md">
                              AI Generated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full" onClick={() => navigate('/content-library')}>
                    View All Content
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't created any content yet</p>
                  <Button onClick={() => navigate('/content-generator')}>
                    Create Content
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Actions */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Your active marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {recentCampaigns.map(campaign => (
                    <div key={campaign.id} className="border rounded-lg p-3 hover:bg-accent cursor-pointer" onClick={() => navigate(`/campaign/${campaign.id}`)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{campaign.title}</p>
                          <p className="text-sm text-muted-foreground">{campaign.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-muted-foreground">
                        <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                        <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {campaign.contents.length} content • {campaign.graphics.length} graphics
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full" onClick={() => navigate('/campaigns')}>
                    View All Campaigns
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't created any campaigns yet</p>
                  <Button onClick={() => navigate('/create-campaign')}>
                    Create Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Features */}
        <h2 className="text-xl font-semibold mt-8 mb-4">AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="animated-gradient text-white">
            <CardContent className="pt-6 pb-8 px-6">
              <h3 className="text-xl font-semibold mb-2">Content Generator</h3>
              <p className="mb-6 opacity-90">Generate high-quality marketing content in seconds</p>
              <Button variant="secondary" onClick={() => navigate('/content-generator')}>
                Create Content
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-aiva-700 text-white">
            <CardContent className="pt-6 pb-8 px-6">
              <h3 className="text-xl font-semibold mb-2">Graphics Generator</h3>
              <p className="mb-6 opacity-90">Create post images with AI based on your content</p>
              <Button variant="secondary" onClick={() => navigate('/graphics-generator')}>
                Create Graphics
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-aiva-500 to-aiva-700 text-white">
            <CardContent className="pt-6 pb-8 px-6">
              <h3 className="text-xl font-semibold mb-2">Campaign Planner</h3>
              <p className="mb-6 opacity-90">Plan and organize your marketing campaigns</p>
              <Button variant="secondary" onClick={() => navigate('/create-campaign')}>
                Plan Campaign
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

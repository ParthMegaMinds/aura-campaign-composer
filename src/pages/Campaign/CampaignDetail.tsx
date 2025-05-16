
import React from 'react';
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
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Calendar, Image, FileText, Trash, Edit, Copy, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    campaigns, 
    getICPById, 
    getContentById, 
    getGraphicById, 
    getCalendarItemById, 
    contents: allContents,
    graphics: allGraphics,
    calendarItems: allCalendarItems,
    deleteContent
  } = useData();
  
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
  
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard');
  };
  
  const handleDeleteContent = (id: string) => {
    deleteContent(id);
    toast.success('Content deleted successfully');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0"
                onClick={() => navigate('/campaigns')}
              >
                Campaigns
              </Button>
              <span className="text-muted-foreground">/</span>
              <h1 className="text-3xl font-bold tracking-tight">{campaign.title}</h1>
            </div>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>
          <Button onClick={() => navigate(`/campaign/${campaign.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Campaign
          </Button>
        </div>

        {/* Campaign Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Basic campaign information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Target Audience:</p>
                <p className="font-medium">{icp ? icp.name : 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration:</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <p>{format(parseISO(campaign.startDate), 'MMM d, yyyy')} - {format(parseISO(campaign.endDate), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Content Items:</p>
                <p>{campaignContents.length} items</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Graphics:</p>
                <p>{campaignGraphics.length} graphics</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calendar Items:</p>
                <p>{campaignCalendarItems.length} scheduled items</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created:</p>
                <p>{format(parseISO(campaign.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Campaign Progress</CardTitle>
              <CardDescription>Track your campaign's progress</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Calendar Items Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">
                    {campaignCalendarItems.filter(item => item?.status === 'draft').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Draft</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">
                    {campaignCalendarItems.filter(item => item?.status === 'ready').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Ready</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">
                    {campaignCalendarItems.filter(item => item?.status === 'scheduled').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">
                    {campaignCalendarItems.filter(item => item?.status === 'live').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Live</p>
                </div>
              </div>
              
              {/* Platform Distribution */}
              <div className="mt-6">
                <h3 className="font-medium mb-3">Platform Distribution</h3>
                <div className="space-y-2">
                  {['LinkedIn', 'Twitter', 'Email', 'Blog'].map(platform => {
                    const count = campaignCalendarItems.filter(item => item?.platform === platform).length;
                    const percentage = campaignCalendarItems.length ? (count / campaignCalendarItems.length) * 100 : 0;
                    
                    return (
                      <div key={platform} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <p>{platform}</p>
                          <p>{count} items ({Math.round(percentage)}%)</p>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Assets</CardTitle>
            <CardDescription>View and manage all assets for this campaign</CardDescription>
          </CardHeader>
          <Tabs defaultValue="calendar" className="w-full">
            <div className="px-6">
              <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="content">
                  <FileText className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="graphics">
                  <Image className="mr-2 h-4 w-4" />
                  Graphics
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calendar" className="p-6 pt-0">
              {campaignCalendarItems.length > 0 ? (
                <div className="space-y-4">
                  {campaignCalendarItems
                    .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime())
                    .map(item => (
                      <div 
                        key={item!.id} 
                        className="border rounded-lg p-4 hover:bg-accent/50 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item!.title}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{format(parseISO(item!.date), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item!.platform}</Badge>
                            <Badge 
                              className={
                                item!.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                item!.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                                item!.status === 'scheduled' ? 'bg-amber-100 text-amber-700' :
                                'bg-green-100 text-green-700'
                              }
                            >
                              {item!.status.charAt(0).toUpperCase() + item!.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No calendar items scheduled for this campaign</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="content" className="p-6 pt-0">
              {campaignContents.length > 0 ? (
                <div className="space-y-4">
                  {campaignContents.map(content => (
                    <div key={content!.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{content!.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="secondary">{content!.type}</Badge>
                            {content!.aiGenerated && (
                              <Badge variant="outline" className="border-aiva-300 bg-aiva-100 text-aiva-700">
                                AI Generated
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/content/${content!.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyContent(content!.content)}>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Copy</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteContent(content!.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <p className="mt-3 text-muted-foreground line-clamp-3">
                        {content!.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No content added to this campaign</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="graphics" className="p-6 pt-0">
              {campaignGraphics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {campaignGraphics.map(graphic => (
                    <div key={graphic!.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-square bg-muted/60 relative">
                        <img 
                          src={graphic!.imageUrl} 
                          alt={graphic!.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-3">
                        <h3 className="font-medium">{graphic!.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {graphic!.format}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(graphic!.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No graphics added to this campaign</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CampaignDetail;

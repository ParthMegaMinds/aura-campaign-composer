
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, addDays, addMonths } from 'date-fns';
import { Calendar as CalendarIcon, Wand2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { icps, contents, graphics, addCampaign, addCalendarItem, getICPById } = useData();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icpId, setIcpId] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addMonths(new Date(), 1));
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [selectedGraphicIds, setSelectedGraphicIds] = useState<string[]>([]);

  const selectedIcp = icpId ? getICPById(icpId) : undefined;

  const handleAiSuggestContent = () => {
    if (!icpId) {
      toast.error('Please select an ICP first');
      return;
    }
    
    // Simulate AI suggestions by selecting random content
    const randomContentIds = contents
      .filter(content => content.icpId === icpId)
      .slice(0, 3)
      .map(content => content.id);
      
    setSelectedContentIds(randomContentIds);
    toast.success('AI has suggested relevant content for your campaign');
  };

  const handleCreateCampaign = () => {
    if (!title || !description || !icpId || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const campaignId = addCampaign({
      title,
      description,
      icpId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      contents: selectedContentIds,
      graphics: selectedGraphicIds,
      calendarItems: []
    });

    // Create calendar items for selected content
    let calendarItemIds: string[] = [];
    
    if (selectedContentIds.length > 0 && startDate) {
      const contentCalendarItems = selectedContentIds.map((contentId, index) => {
        // Schedule each content item a few days apart
        const itemDate = addDays(startDate, index * 2);
        const content = contents.find(c => c.id === contentId);
        
        // Find a matching graphic if available
        const matchingGraphic = graphics.find(g => g.contentId === contentId);
        
        return addCalendarItem({
          title: content ? content.title : `Campaign Item ${index + 1}`,
          date: itemDate.toISOString(),
          contentId,
          graphicId: matchingGraphic?.id,
          platform: 'LinkedIn', // Default platform
          status: 'draft'
        });
      });
      
      calendarItemIds = contentCalendarItems;
    }

    toast.success('Campaign created successfully');
    navigate(`/campaign/${campaignId}`);
  };

  const toggleContentSelection = (contentId: string) => {
    setSelectedContentIds(current => 
      current.includes(contentId)
        ? current.filter(id => id !== contentId)
        : [...current, contentId]
    );
  };

  const toggleGraphicSelection = (graphicId: string) => {
    setSelectedGraphicIds(current => 
      current.includes(graphicId)
        ? current.filter(id => id !== graphicId)
        : [...current, graphicId]
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-muted-foreground">
            Plan a comprehensive marketing campaign
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>Basic information about your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Q2 Product Launch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the goals and strategy of your campaign"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icp">Target Audience (ICP)</Label>
                  <Select onValueChange={setIcpId} value={icpId}>
                    <SelectTrigger id="icp">
                      <SelectValue placeholder="Select your target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {icps.map((icp) => (
                        <SelectItem key={icp.id} value={icp.id}>{icp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!icps.length && (
                    <p className="text-sm text-muted-foreground">
                      No ICPs created yet.{' '}
                      <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/icp-builder')}>
                        Create an ICP
                      </Button>
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="startDate"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : <span>Pick a start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="endDate"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : <span>Pick an end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Content Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Content</CardTitle>
                <CardDescription>Select content to include in your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={handleAiSuggestContent}
                    disabled={!icpId}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI Suggest Content
                  </Button>
                </div>
                
                {contents.length > 0 ? (
                  <div className="space-y-3">
                    {contents.map(content => (
                      <div 
                        key={content.id} 
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedContentIds.includes(content.id) ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                        }`}
                        onClick={() => toggleContentSelection(content.id)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedContentIds.includes(content.id)}
                            onChange={() => {}} // Handled by parent div click
                            className="mr-3 h-4 w-4"
                            onClick={e => e.stopPropagation()}
                          />
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-md">
                              {content.content.substring(0, 80)}...
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-secondary px-2 py-0.5 rounded-md">
                                {content.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No content available</p>
                    <Button onClick={() => navigate('/content-generator')}>
                      Create Content
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Graphics Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Graphics</CardTitle>
                <CardDescription>Select graphics to include</CardDescription>
              </CardHeader>
              <CardContent>
                {graphics.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {graphics.map(graphic => (
                      <div 
                        key={graphic.id} 
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-colors ${
                          selectedGraphicIds.includes(graphic.id) ? 'border-primary ring-2 ring-primary/30' : ''
                        }`}
                        onClick={() => toggleGraphicSelection(graphic.id)}
                      >
                        <div className="aspect-video bg-muted relative">
                          <img 
                            src={graphic.imageUrl} 
                            alt={graphic.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <input
                              type="checkbox"
                              checked={selectedGraphicIds.includes(graphic.id)}
                              onChange={() => {}} // Handled by parent div click
                              className="h-4 w-4 bg-white/80"
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-sm font-medium truncate">{graphic.title}</p>
                          <p className="text-xs text-muted-foreground">{graphic.format}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No graphics available</p>
                    <Button onClick={() => navigate('/graphics-generator')}>
                      Create Graphics
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Campaign Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Summary</CardTitle>
                <CardDescription>Review your campaign details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title:</p>
                  <p className="font-medium">{title || 'Not set'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Target Audience:</p>
                  <p>{selectedIcp ? selectedIcp.name : 'Not selected'}</p>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date:</p>
                    <p>{startDate ? format(startDate, 'PPP') : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Date:</p>
                    <p>{endDate ? format(endDate, 'PPP') : 'Not set'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Content Items:</p>
                  <p>{selectedContentIds.length}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Graphics:</p>
                  <p>{selectedGraphicIds.length}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleCreateCampaign}
                  disabled={!title || !description || !icpId || !startDate || !endDate}
                >
                  Create Campaign
                </Button>
              </CardFooter>
            </Card>
            
            {selectedIcp && (
              <Card className="bg-aiva-100 border-aiva-200">
                <CardHeader>
                  <CardTitle className="text-aiva-800">AI Insights</CardTitle>
                  <CardDescription>
                    Based on your selected ICP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-medium text-aiva-700 mb-1">Content Strategy</h3>
                    <p>Focus on {selectedIcp.persona.join(', ')} pain points in {selectedIcp.industry} to drive engagement.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-aiva-700 mb-1">Recommended Platforms</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>LinkedIn (primary)</li>
                      <li>Industry-specific newsletters</li>
                      <li>Professional Webinars</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-aiva-700 mb-1">Optimal Posting Times</h3>
                    <p>Based on your ICP: Tuesday-Thursday, 10am-2pm</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateCampaign;

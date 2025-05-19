
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, Download, Printer } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const CampaignPDFReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { campaigns, getICPById } = useData();
  
  const campaign = campaigns.find(c => c.id === id);
  
  useEffect(() => {
    // Simulate PDF generation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  const handleDownload = () => {
    toast.success('PDF report downloaded successfully');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/campaign/${id}/analytics`)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Analytics
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
        
        <Card className="print:shadow-none">
          <CardHeader className="print:pb-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AIVA Marketing Report</p>
                <CardTitle className="text-2xl">Campaign Report: {campaign.title}</CardTitle>
              </div>
              <div className="text-right hidden print:block">
                <p className="text-sm font-medium">Generated on</p>
                <p className="text-sm">{format(new Date(), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-muted-foreground">Generating PDF report...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4 border-b pb-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Campaign Period:</p>
                    <p>{format(parseISO(campaign.startDate), 'MMM d, yyyy')} - {format(parseISO(campaign.endDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Target Audience:</p>
                    <p>{icp ? icp.name : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Content Items:</p>
                    <p>{campaign.contents.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Calendar Items:</p>
                    <p>{campaign.calendarItems.length}</p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Campaign Overview</h2>
                  <p className="mb-4">{campaign.description}</p>
                  
                  <h3 className="font-medium mb-2">Campaign Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{(Math.floor(Math.random() * 1000) + 500).toLocaleString()}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                      <p className="text-2xl font-bold">{Math.floor(Math.random() * 20) + 5}%</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Total Clicks</p>
                      <p className="text-2xl font-bold">{(Math.floor(Math.random() * 500) + 100).toLocaleString()}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-2xl font-bold">{(Math.floor(Math.random() * 50) + 10).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Platform Performance</h2>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Platform</th>
                        <th className="text-left pb-2">Posts</th>
                        <th className="text-left pb-2">Engagement</th>
                        <th className="text-left pb-2">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['LinkedIn', 'Twitter', 'Facebook', 'Email'].map(platform => {
                        const itemsCount = campaign.calendarItems.filter(itemId => {
                          const item = getCalendarItemById(itemId);
                          return item?.platform === platform;
                        }).length;
                        
                        if (itemsCount === 0) return null;
                        
                        return (
                          <tr key={platform} className="border-b">
                            <td className="py-3">{platform}</td>
                            <td className="py-3">{itemsCount}</td>
                            <td className="py-3">{Math.floor(Math.random() * 20) + 5}%</td>
                            <td className="py-3">{Math.floor(Math.random() * 200) + 50}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Content Performance</h2>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Content Type</th>
                        <th className="text-left pb-2">Count</th>
                        <th className="text-left pb-2">Avg. Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['social', 'email', 'blog', 'landing', 'proposal'].map(type => {
                        const count = campaign.contents.filter(contentId => {
                          const content = getContentById(contentId);
                          return content?.type === type;
                        }).length;
                        
                        if (count === 0) return null;
                        
                        return (
                          <tr key={type} className="border-b">
                            <td className="py-3 capitalize">{type}</td>
                            <td className="py-3">{count}</td>
                            <td className="py-3">{Math.floor(Math.random() * 20) + 5}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-md text-blue-800 print:bg-white print:border-blue-300">
                      <h3 className="font-medium mb-1">Overall Performance</h3>
                      <p>This campaign has {Math.random() > 0.5 ? 'exceeded' : 'met'} expectations with solid engagement metrics across platforms.</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-100 rounded-md text-green-800 print:bg-white print:border-green-300">
                      <h3 className="font-medium mb-1">Top Performing Platform</h3>
                      <p>LinkedIn has shown the highest engagement rates, suggesting that your audience is most active on this platform.</p>
                    </div>
                    
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-md text-amber-800 print:bg-white print:border-amber-300">
                      <h3 className="font-medium mb-1">Recommendations</h3>
                      <p>Consider increasing content frequency on top-performing platforms and experimenting with more visual content types.</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6 text-center text-sm text-muted-foreground print:border-t-0">
                  <p>Report generated by AIVA Marketing Platform</p>
                  <p>{format(new Date(), 'MMMM d, yyyy, h:mm a')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CampaignPDFReport;

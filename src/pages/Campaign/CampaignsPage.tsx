import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/SupabaseDataContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Calendar, BarChart3, MoreVertical, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import { toast } from '@/components/ui/sonner';

const CampaignsPage = () => {
  const navigate = useNavigate();
  const { campaigns, deleteCampaign, getICPById } = useData();
  
  const getCampaignStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    if (isBefore(today, start)) {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (isAfter(today, end)) {
      return { status: 'completed', color: 'bg-green-100 text-green-700' };
    } else {
      return { status: 'active', color: 'bg-amber-100 text-amber-700' };
    }
  };
  
  const handleDeleteCampaign = (id: string) => {
    deleteCampaign(id);
    toast.success('Campaign deleted successfully');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">
              All your marketing campaigns in one place
            </p>
          </div>
          <Button onClick={() => navigate('/create-campaign')}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {campaigns.length > 0 ? (
          <div className="grid gap-6">
            {campaigns.map(campaign => {
              const icp = getICPById(campaign.icpId);
              const { status, color } = getCampaignStatus(campaign.startDate, campaign.endDate);
              
              return (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/campaign/${campaign.id}`)}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold">{campaign.title}</h2>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/campaign/${campaign.id}`);
                              }}>
                                View Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCampaign(campaign.id);
                              }}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Campaign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <p className="text-muted-foreground mt-2">
                          {campaign.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                          <Badge className={color}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                          
                          {icp && (
                            <Badge variant="outline">
                              ICP: {icp.name}
                            </Badge>
                          )}
                          
                          <span className="text-sm text-muted-foreground">
                            {format(parseISO(campaign.startDate), 'MMM d')} - {format(parseISO(campaign.endDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col justify-start gap-4 md:border-l md:pl-6">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Calendar Items</p>
                            <p className="font-medium">{campaign.calendarItems.length}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Content/Graphics</p>
                            <p className="font-medium">{campaign.contents.length}/{campaign.graphics.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No Campaigns Created Yet</h3>
              <p className="text-muted-foreground mb-6">Start organizing your marketing efforts by creating your first campaign</p>
              <Button onClick={() => navigate('/create-campaign')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default CampaignsPage;

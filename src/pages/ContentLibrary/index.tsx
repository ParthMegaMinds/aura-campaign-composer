
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreVertical, Copy, Edit, Trash, FileText, Image } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const ContentLibrary = () => {
  const navigate = useNavigate();
  const { contents, graphics, deleteContent, deleteGraphic, getICPById } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('content');

  const filteredContents = contents.filter(content => 
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGraphics = graphics.filter(graphic => 
    graphic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard');
  };
  
  const handleDeleteContent = (id: string) => {
    deleteContent(id);
    toast.success('Content deleted successfully');
  };
  
  const handleDeleteGraphic = (id: string) => {
    deleteGraphic(id);
    toast.success('Graphic deleted successfully');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
            <p className="text-muted-foreground">
              Manage all your AI-generated content and graphics
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 flex-shrink w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/content-generator')}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>New Content</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/graphics-generator')}>
                    <Image className="mr-2 h-4 w-4" />
                    <span>New Graphic</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="content" className="w-full" onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="content">
                  <FileText className="mr-2 h-4 w-4" />
                  Content ({filteredContents.length})
                </TabsTrigger>
                <TabsTrigger value="graphics">
                  <Image className="mr-2 h-4 w-4" />
                  Graphics ({filteredGraphics.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
                {filteredContents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredContents.map((content) => {
                      const icp = getICPById(content.icpId);
                      return (
                        <div key={content.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{content.title}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="secondary">{content.type}</Badge>
                                {content.aiGenerated && (
                                  <Badge variant="outline" className="border-aiva-300 bg-aiva-100 text-aiva-700">
                                    AI Generated
                                  </Badge>
                                )}
                                {icp && (
                                  <Badge variant="outline">ICP: {icp.name}</Badge>
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
                                <DropdownMenuItem onClick={() => navigate(`/content/${content.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCopyContent(content.content)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>Copy</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteContent(content.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <p className="mt-3 text-muted-foreground line-clamp-3">
                            {content.content}
                          </p>
                          
                          <p className="text-xs text-muted-foreground mt-4">
                            Created: {new Date(content.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No content found</p>
                    <Button onClick={() => navigate('/content-generator')}>
                      Create Content
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="graphics">
                {filteredGraphics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredGraphics.map((graphic) => (
                      <div key={graphic.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-square bg-muted/60 relative">
                          <img 
                            src={graphic.imageUrl} 
                            alt={graphic.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteGraphic(graphic.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <h3 className="font-medium">{graphic.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {graphic.format}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {new Date(graphic.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No graphics found</p>
                    <Button onClick={() => navigate('/graphics-generator')}>
                      Create Graphics
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ContentLibrary;


import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useData, ContentItem } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, Download, Wand2, Save } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';

const GraphicsGenerator = () => {
  const navigate = useNavigate();
  const { contents, addGraphic } = useData();
  
  const [selectedContent, setSelectedContent] = useState<string>('none'); // Changed from empty string to 'none'
  const [format, setFormat] = useState('LinkedIn');
  const [customMessage, setCustomMessage] = useState('');
  const [theme, setTheme] = useState('Tech Minimalist');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [graphicTitle, setGraphicTitle] = useState('');

  const getContent = (id: string): ContentItem | undefined => {
    return contents.find(content => content.id === id);
  };

  const content = selectedContent !== 'none' ? getContent(selectedContent) : undefined; // Updated condition

  // Sample placeholder images for demonstration
  const placeholderImages = [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
  ];

  const handleGenerateGraphics = () => {
    if (selectedContent === 'none' && !customMessage) { // Updated condition
      toast.error('Please select content or enter a custom message');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with a timeout
    setTimeout(() => {
      setGeneratedImages(placeholderImages);
      setIsGenerating(false);
      
      // Set default title
      if (content) {
        setGraphicTitle(`${content.title} - ${format} Graphic`);
      } else {
        setGraphicTitle(`${format} Graphic - ${new Date().toLocaleDateString()}`);
      }
    }, 2000);
  };

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleSaveGraphic = () => {
    if (selectedImageIndex === null) {
      toast.error('Please select an image first');
      return;
    }

    addGraphic({
      title: graphicTitle,
      imageUrl: generatedImages[selectedImageIndex],
      contentId: selectedContent === 'none' ? undefined : selectedContent, // Updated condition
      format
    });

    toast.success('Graphic saved successfully');
    navigate('/content-library');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Graphics Generator</h1>
          <p className="text-muted-foreground">
            Create AI-powered visuals for your marketing content
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Configure Graphics</CardTitle>
              <CardDescription>Set up parameters for your graphic generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contentSource">Content Source</Label>
                <Tabs defaultValue="existing" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="existing">Existing Content</TabsTrigger>
                    <TabsTrigger value="custom">Custom Message</TabsTrigger>
                  </TabsList>
                  <TabsContent value="existing" className="pt-4">
                    <div className="space-y-4">
                      <Select onValueChange={setSelectedContent} value={selectedContent}>
                        <SelectTrigger id="content">
                          <SelectValue placeholder="Select existing content" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {contents.map((content) => (
                            <SelectItem key={content.id} value={content.id}>{content.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {!contents.length && (
                        <p className="text-sm text-muted-foreground">
                          No content created yet.{' '}
                          <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/content-generator')}>
                            Create content
                          </Button>
                        </p>
                      )}
                      
                      {content && (
                        <div className="p-3 border rounded-lg bg-accent/30">
                          <p className="font-medium text-sm mb-1">Selected Content Preview:</p>
                          <p className="text-xs text-muted-foreground line-clamp-3">{content.content}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="custom" className="pt-4">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter your custom message here..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">Post Format</Label>
                <Select onValueChange={setFormat} defaultValue="LinkedIn">
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn Post</SelectItem>
                    <SelectItem value="Instagram">Instagram Post</SelectItem>
                    <SelectItem value="Twitter">Twitter Post</SelectItem>
                    <SelectItem value="Facebook">Facebook Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme">Visual Theme</Label>
                <Select onValueChange={setTheme} defaultValue="Tech Minimalist">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tech Minimalist">Tech Minimalist</SelectItem>
                    <SelectItem value="Gradient Abstract">Gradient Abstract</SelectItem>
                    <SelectItem value="Corporate Professional">Corporate Professional</SelectItem>
                    <SelectItem value="Bold Modern">Bold Modern</SelectItem>
                    <SelectItem value="Creative Vibrant">Creative Vibrant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleGenerateGraphics}
                disabled={isGenerating || (selectedContent === 'none' && !customMessage)} // Updated condition
              >
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Graphics
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Area */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Graphics</CardTitle>
              <CardDescription>
                {generatedImages.length > 0 ? (
                  <div className="flex items-center">
                    <Badge variant="secondary" className="mr-2">
                      AI Generated
                    </Badge>
                    {format && <Badge>{format} Format</Badge>}
                  </div>
                ) : (
                  "Your AI-generated graphics will appear here"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Wand2 className="h-10 w-10 mb-4 mx-auto animate-pulse text-primary" />
                    <p className="text-lg font-medium">Generating graphics...</p>
                    <p className="text-muted-foreground">Our AI is creating your visuals</p>
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Graphic Title</Label>
                    <Input
                      id="title"
                      value={graphicTitle}
                      onChange={(e) => setGraphicTitle(e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {generatedImages.map((image, index) => (
                      <div 
                        key={index} 
                        className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedImageIndex === index ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                        }`}
                        onClick={() => handleSelectImage(index)}
                      >
                        <img 
                          src={image} 
                          alt={`Generated graphic ${index + 1}`}
                          className="w-full h-36 object-cover"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute top-2 right-2 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <p>Fill out the form and click "Generate Graphics"</p>
                    <p className="text-sm mt-2">
                      The AI will create visuals based on your content and preferences
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {generatedImages.length > 0 && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" disabled={selectedImageIndex === null}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleSaveGraphic} disabled={selectedImageIndex === null}>
                  <Save className="mr-2 h-4 w-4" />
                  Save to Library
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default GraphicsGenerator;

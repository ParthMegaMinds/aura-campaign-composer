import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useData, ICP } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Copy, Save, Wand2, Clock, Check } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';

const ContentGenerator = () => {
  const navigate = useNavigate();
  const { icps, getICPById, addContent } = useData();
  
  const [contentType, setContentType] = useState<'social' | 'email' | 'blog' | 'landing' | 'proposal'>('social');
  const [icpId, setIcpId] = useState('');
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('default'); // Changed from empty string to 'default'
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentTitle, setContentTitle] = useState('');

  const selectedIcp: ICP | undefined = icpId ? getICPById(icpId) : undefined;

  const handleGenerateContent = () => {
    if (!icpId || !contentType) {
      toast.error('Please select an ICP and content type');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with a timeout
    setTimeout(() => {
      const icp = getICPById(icpId);
      
      // Default title based on topic and content type
      let title = '';
      if (topic) {
        title = `${topic} for ${icp?.industry || 'Your Industry'}`;
      } else {
        title = `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} for ${icp?.industry || 'Your Industry'}`;
      }
      setContentTitle(title);

      // Generate mock content based on the ICP and content type
      let content = '';
      const persona = icp?.persona?.[0] || 'professionals';
      const industry = icp?.industry || 'your industry';
      
      switch(contentType) {
        case 'social':
          content = `Attention all ${persona} in the ${industry} space!\n\n`;
          content += topic 
            ? `Looking to solve the challenges of ${topic}? We've got you covered.\n\n` 
            : `We understand the unique challenges you face every day.\n\n`;
          content += `Our solution helps you:\n`;
          content += `• Save time with automated workflows\n`;
          content += `• Reduce costs by 30% or more\n`;
          content += `• Improve overall efficiency\n\n`;
          content += `Learn more about how we're transforming ${industry}: [Link]`;
          break;
          
        case 'email':
          content = `Subject: Transform Your ${industry} Results with Our Solution\n\n`;
          content += `Dear ${persona},\n\n`;
          content += `I hope this email finds you well.\n\n`;
          content += topic 
            ? `We understand that ${topic} is a key challenge in your role.\n\n` 
            : `We understand the unique challenges you face in the ${industry} space.\n\n`;
          content += `Our clients in ${industry} have seen remarkable results, including:\n\n`;
          content += `• 35% reduction in operational costs\n`;
          content += `• 42% improvement in team productivity\n`;
          content += `• 28% faster time-to-market for new initiatives\n\n`;
          content += `Would you be interested in a 15-minute call to discuss how we might help your team achieve similar results?\n\n`;
          content += `Looking forward to connecting,\n`;
          content += `[Your Name]`;
          break;
          
        case 'blog':
          content = `# ${title}\n\n`;
          content += `## Introduction\n\n`;
          content += topic 
            ? `In today's rapidly evolving ${industry} landscape, ${topic} has become increasingly important for organizations looking to maintain a competitive edge.\n\n` 
            : `In today's rapidly evolving ${industry} landscape, staying ahead requires innovative solutions and strategic thinking.\n\n`;
          content += `## The Challenge\n\n`;
          content += `${persona} face numerous challenges in implementing effective solutions, including:\n\n`;
          content += `1. Limited resources and budget constraints\n`;
          content += `2. Integration with existing systems and processes\n`;
          content += `3. Ensuring security and compliance\n\n`;
          content += `## Best Practices\n\n`;
          content += `Based on our research and experience with leading ${industry} organizations, we've identified these key best practices:\n\n`;
          content += `### 1. Start with a Clear Strategy\n`;
          content += `Before implementing any new solution, ensure you have a well-defined strategy aligned with your business objectives.\n\n`;
          content += `### 2. Focus on User Adoption\n`;
          content += `The most powerful solution will fail without proper user adoption. Invest in training and change management.\n\n`;
          content += `### 3. Measure and Optimize\n`;
          content += `Establish clear KPIs and regularly assess the impact of your implementation, making adjustments as needed.\n\n`;
          content += `## Conclusion\n\n`;
          content += `By following these best practices, ${persona} can successfully navigate the complexities of ${industry} and achieve sustainable results.`;
          break;
          
        case 'landing':
          content = `# Transform Your ${industry} Business\n\n`;
          content += `## The Leading Solution for Forward-Thinking ${persona}\n\n`;
          content += topic 
            ? `Are you struggling with ${topic}? You're not alone.\n\n` 
            : `Are you facing the everyday challenges of the ${industry} industry? You're not alone.\n\n`;
          content += `### Our Solution Delivers:\n\n`;
          content += `✓ 40% reduction in operational costs\n`;
          content += `✓ 3x faster implementation than competitors\n`;
          content += `✓ 99.9% uptime reliability\n`;
          content += `✓ Enterprise-grade security and compliance\n\n`;
          content += `### Trusted by Industry Leaders\n\n`;
          content += `"This solution has transformed how we approach our daily operations. The ROI was evident within the first quarter." - CTO, Leading ${industry} Company\n\n`;
          content += `## Ready to Transform Your Business?\n\n`;
          content += `Book a Demo | Request Pricing | Watch Video`;
          break;
          
        case 'proposal':
          content = `# Business Proposal: Enhancing ${industry} Operations\n\n`;
          content += `## Executive Summary\n\n`;
          content += topic 
            ? `This proposal outlines our comprehensive solution for addressing ${topic} challenges in your ${industry} organization.\n\n` 
            : `This proposal outlines our comprehensive solution for enhancing operations in your ${industry} organization.\n\n`;
          content += `## Your Challenges\n\n`;
          content += `Based on our discussions and industry expertise, we understand you're facing:\n\n`;
          content += `1. Increasing operational costs\n`;
          content += `2. Siloed systems preventing efficient workflows\n`;
          content += `3. Difficulty scaling with current infrastructure\n\n`;
          content += `## Our Solution\n\n`;
          content += `Our proven approach includes:\n\n`;
          content += `1. Initial assessment and strategy development\n`;
          content += `2. Custom solution implementation\n`;
          content += `3. Team training and knowledge transfer\n`;
          content += `4. Ongoing support and optimization\n\n`;
          content += `## Investment and ROI\n\n`;
          content += `Our solution requires an initial investment of $XX,XXX with an expected ROI within 6-8 months through:\n\n`;
          content += `- 30% reduction in operational costs\n`;
          content += `- 25% improvement in team productivity\n`;
          content += `- 40% faster time-to-market for new initiatives\n\n`;
          content += `## Next Steps\n\n`;
          content += `1. Detailed discovery session\n`;
          content += `2. Solution customization workshop\n`;
          content += `3. Implementation planning\n`;
          content += `4. Contract finalization`;
          break;
      }

      setGeneratedContent(content);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveContent = () => {
    if (!generatedContent || !contentTitle) {
      toast.error('Please generate content first');
      return;
    }

    const newContentId = addContent({
      title: contentTitle,
      content: generatedContent,
      type: contentType,
      icpId: icpId,
      aiGenerated: true
    });

    toast.success('Content saved successfully');
    navigate(`/content-library`);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Content Generator</h1>
          <p className="text-muted-foreground">
            Create high-quality marketing content in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>Configure your content generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Tabs defaultValue="social" className="w-full" onValueChange={(value) => setContentType(value as any)}>
                  <TabsList className="grid grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="blog">Blog</TabsTrigger>
                    <TabsTrigger value="landing">Landing</TabsTrigger>
                    <TabsTrigger value="proposal">Proposal</TabsTrigger>
                  </TabsList>
                </Tabs>
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
              
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Product (Optional)</Label>
                <Input
                  id="topic"
                  placeholder="e.g., AI Content Generator, Cloud Migration"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="length">Content Length</Label>
                <Select onValueChange={setLength} defaultValue="medium">
                  <SelectTrigger id="length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Tone (Optional)</Label>
                <Select onValueChange={setTone} value={tone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="witty">Witty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Selected ICP Details */}
              {selectedIcp && (
                <div className="mt-6 p-4 border rounded-lg bg-secondary/30">
                  <p className="font-medium mb-2">Selected ICP: {selectedIcp.name}</p>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>Industry: {selectedIcp.industry}</p>
                    <p>Business Size: {selectedIcp.businessSize}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="font-medium text-foreground">Persona: </span>
                      {selectedIcp.persona.map((p, i) => (
                        <Badge key={i} variant="outline" className="font-normal">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full mt-4" 
                onClick={handleGenerateContent}
                disabled={isGenerating || !icpId}
              >
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Area */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                {generatedContent ? (
                  <div className="flex items-center">
                    <Badge variant="secondary" className="mr-2">
                      <Check className="h-3 w-3 mr-1" /> AI Generated
                    </Badge>
                    {contentType && <Badge>{contentType}</Badge>}
                  </div>
                ) : (
                  "Your AI-generated content will appear here"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Wand2 className="h-10 w-10 mb-4 mx-auto animate-pulse text-primary" />
                    <p className="text-lg font-medium">Generating content...</p>
                    <p className="text-muted-foreground">Our AI is crafting your content</p>
                  </div>
                </div>
              ) : generatedContent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={contentTitle}
                      onChange={(e) => setContentTitle(e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <p>Fill out the form and click "Generate Content"</p>
                    <p className="text-sm mt-2">
                      The AI will create content based on your parameters
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {generatedContent && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCopyContent}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button onClick={handleSaveContent}>
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

export default ContentGenerator;

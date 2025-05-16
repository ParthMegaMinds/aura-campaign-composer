
import React, { useState, useEffect } from 'react';
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
import { Copy, Save, Wand2, Clock, Check, Globe, Link, Mail, FileText, MessageSquare } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { AIService, AIProvider } from '@/services/AIService';
import { WordPressService } from '@/services/WordPressService';

type ContentTypeFields = {
  social: {
    platform: string;
    hashtags: string;
    includeImage: boolean;
    postType: string;
  };
  email: {
    subject: string;
    includeButton: boolean;
    buttonText: string;
    buttonUrl: string;
    emailType: string;
  };
  blog: {
    wordCount: number;
    includeHeadings: boolean;
    includeBulletPoints: boolean;
    includeConclusion: boolean;
    aiProvider: AIProvider;
    aiModel: string;
    aiTemperature: number;
    useWordPress: boolean;
  };
  landing: {
    sections: string[];
    includeTestimonials: boolean;
    includePricing: boolean;
    includeCTA: boolean;
    ctaText: string;
  };
  proposal: {
    includeTimeline: boolean;
    includeBudget: boolean;
    includeTeam: boolean;
    proposalType: string;
  };
};

const ContentGenerator = () => {
  const navigate = useNavigate();
  const { icps, getICPById, addContent } = useData();
  
  const [contentType, setContentType] = useState<'social' | 'email' | 'blog' | 'landing' | 'proposal'>('social');
  const [icpId, setIcpId] = useState('');
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('default');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // State for AI providers
  const [chatgptApiKey, setChatgptApiKey] = useState('');
  const [perplexityApiKey, setPerplexityApiKey] = useState('');
  const [showApiKeyFields, setShowApiKeyFields] = useState(false);

  // Fields for each content type
  const [fields, setFields] = useState<ContentTypeFields>({
    social: {
      platform: 'linkedin',
      hashtags: '',
      includeImage: false,
      postType: 'update'
    },
    email: {
      subject: '',
      includeButton: false,
      buttonText: 'Learn More',
      buttonUrl: '',
      emailType: 'newsletter'
    },
    blog: {
      wordCount: 800,
      includeHeadings: true,
      includeBulletPoints: true,
      includeConclusion: true,
      aiProvider: 'mock',
      aiModel: 'gpt-4o-mini',
      aiTemperature: 0.7,
      useWordPress: false
    },
    landing: {
      sections: ['hero', 'features', 'benefits'],
      includeTestimonials: true,
      includePricing: true,
      includeCTA: true,
      ctaText: 'Get Started'
    },
    proposal: {
      includeTimeline: true,
      includeBudget: true,
      includeTeam: false,
      proposalType: 'business'
    }
  });

  const selectedIcp: ICP | undefined = icpId ? getICPById(icpId) : undefined;

  // WordPress site connection
  const [wpSiteUrl, setWpSiteUrl] = useState('');
  const [isWordPressConnected, setIsWordPressConnected] = useState(false);

  useEffect(() => {
    // Check if WordPress site URL is stored
    const storedUrl = WordPressService.getSiteUrl();
    if (storedUrl) {
      setWpSiteUrl(storedUrl);
      setIsWordPressConnected(true);
    }
  }, []);

  const connectWordPress = () => {
    if (!wpSiteUrl) {
      toast.error('Please enter your WordPress site URL');
      return;
    }

    try {
      WordPressService.setSiteUrl(wpSiteUrl);
      setIsWordPressConnected(true);
      toast.success('WordPress site connected successfully');
      
      // Update blog fields to enable WordPress integration
      setFields(prev => ({
        ...prev,
        blog: {
          ...prev.blog,
          useWordPress: true
        }
      }));
    } catch (error) {
      console.error('Error connecting to WordPress:', error);
      toast.error('Failed to connect to WordPress site');
    }
  };

  const disconnectWordPress = () => {
    // Clear WordPress site URL
    localStorage.removeItem('wordpress_site_url');
    setWpSiteUrl('');
    setIsWordPressConnected(false);
    
    // Update blog fields to disable WordPress integration
    setFields(prev => ({
      ...prev,
      blog: {
        ...prev.blog,
        useWordPress: false
      }
    }));
    
    toast.success('WordPress site disconnected');
  };

  // Handle field changes
  const updateFields = (type: keyof ContentTypeFields, field: string, value: any) => {
    setFields(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleGenerateContent = async () => {
    if (!icpId || !contentType) {
      toast.error('Please select an ICP and content type');
      return;
    }

    setIsGenerating(true);

    try {
      const icp = getICPById(icpId);
      
      // Default title based on topic and content type
      let title = '';
      if (topic) {
        title = `${topic} for ${icp?.industry || 'Your Industry'}`;
      } else {
        title = `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} for ${icp?.industry || 'Your Industry'}`;
      }
      setContentTitle(title);

      // Create AI generation parameters
      let content = '';
      
      // Use AI service for blog content when selected
      if (contentType === 'blog' && fields.blog.aiProvider !== 'mock') {
        // Build prompt based on blog settings
        const wordCountText = fields.blog.wordCount > 0 ? `approximately ${fields.blog.wordCount} words` : '';
        const headingsText = fields.blog.includeHeadings ? 'with clear headings and subheadings' : '';
        const bulletPointsText = fields.blog.includeBulletPoints ? 'including bullet points where appropriate' : '';
        const conclusionText = fields.blog.includeConclusion ? 'with a strong conclusion' : '';
        
        const prompt = `Write a blog post about "${topic || 'industry trends'}" for ${icp?.industry || 'the industry'} 
          targeting ${icp?.persona?.[0] || 'professionals'} ${wordCountText} ${headingsText} ${bulletPointsText} ${conclusionText}.
          The tone should be ${tone === 'default' ? 'professional' : tone}.`;
        
        content = await AIService.generateContent({
          prompt,
          provider: fields.blog.aiProvider,
          model: fields.blog.aiModel,
          temperature: fields.blog.aiTemperature,
          apiKey: fields.blog.aiProvider === 'chatgpt' ? chatgptApiKey : perplexityApiKey
        });
      } else {
        // Fall back to mock generation for other content types
        // Generate mock content based on the ICP and content type
        const persona = icp?.persona?.[0] || 'professionals';
        const industry = icp?.industry || 'your industry';
        
        switch(contentType) {
          case 'social':
            content = `${fields.social.postType === 'question' ? 'What are your thoughts on ' : ''}`;
            content += `Attention all ${persona} in the ${industry} space!\n\n`;
            content += topic 
              ? `Looking to solve the challenges of ${topic}? We've got you covered.\n\n` 
              : `We understand the unique challenges you face every day.\n\n`;
            content += `Our solution helps you:\n`;
            content += `• Save time with automated workflows\n`;
            content += `• Reduce costs by 30% or more\n`;
            content += `• Improve overall efficiency\n\n`;
            content += `Learn more about how we're transforming ${industry}: [Link]`;
            
            if (fields.social.hashtags) {
              content += `\n\n${fields.social.hashtags}`;
            }
            break;
            
          case 'email':
            content = `Subject: ${fields.email.subject || `Transform Your ${industry} Results with Our Solution`}\n\n`;
            content += `Dear ${persona},\n\n`;
            content += `I hope this email finds you well.\n\n`;
            content += topic 
              ? `We understand that ${topic} is a key challenge in your role.\n\n` 
              : `We understand the unique challenges you face in the ${industry} space.\n\n`;
            content += `Our clients in ${industry} have seen remarkable results, including:\n\n`;
            content += `• 35% reduction in operational costs\n`;
            content += `• 42% improvement in team productivity\n`;
            content += `• 28% faster time-to-market for new initiatives\n\n`;
            
            if (fields.email.includeButton) {
              content += `[${fields.email.buttonText || 'Learn More'}](${fields.email.buttonUrl || '#'})\n\n`;
            } else {
              content += `Would you be interested in a 15-minute call to discuss how we might help your team achieve similar results?\n\n`;
            }
            
            content += `Looking forward to connecting,\n`;
            content += `[Your Name]`;
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
            
            if (fields.landing.includeTestimonials) {
              content += `### Trusted by Industry Leaders\n\n`;
              content += `"This solution has transformed how we approach our daily operations. The ROI was evident within the first quarter." - CTO, Leading ${industry} Company\n\n`;
            }
            
            if (fields.landing.includePricing) {
              content += `### Pricing Plans\n\n`;
              content += `**Starter:** Perfect for small teams\n`;
              content += `**Business:** Ideal for growing organizations\n`;
              content += `**Enterprise:** Complete solution for large companies\n\n`;
            }
            
            if (fields.landing.includeCTA) {
              content += `## Ready to Transform Your Business?\n\n`;
              content += `[${fields.landing.ctaText}](#) | Request Pricing | Watch Video`;
            }
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
            
            if (fields.proposal.includeTimeline) {
              content += `## Implementation Timeline\n\n`;
              content += `- Week 1-2: Discovery & Planning\n`;
              content += `- Week 3-6: Implementation & Configuration\n`;
              content += `- Week 7-8: Testing & Training\n`;
              content += `- Week 9+: Launch & Ongoing Support\n\n`;
            }
            
            if (fields.proposal.includeBudget) {
              content += `## Investment and ROI\n\n`;
              content += `Our solution requires an initial investment of $XX,XXX with an expected ROI within 6-8 months through:\n\n`;
              content += `- 30% reduction in operational costs\n`;
              content += `- 25% improvement in team productivity\n`;
              content += `- 40% faster time-to-market for new initiatives\n\n`;
            }
            
            if (fields.proposal.includeTeam) {
              content += `## Our Team\n\n`;
              content += `- Project Manager: 10+ years in ${industry} implementations\n`;
              content += `- Technical Lead: Expert in integration & customization\n`;
              content += `- Training Specialist: Focus on adoption & user success\n\n`;
            }
            
            content += `## Next Steps\n\n`;
            content += `1. Detailed discovery session\n`;
            content += `2. Solution customization workshop\n`;
            content += `3. Implementation planning\n`;
            content += `4. Contract finalization`;
            break;
            
          case 'blog':
          default:
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
        }
      }

      setGeneratedContent(content);
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
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
                    <TabsTrigger value="social">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Social
                    </TabsTrigger>
                    <TabsTrigger value="email">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="blog">
                      <FileText className="h-4 w-4 mr-2" />
                      Blog
                    </TabsTrigger>
                    <TabsTrigger value="landing">
                      <Globe className="h-4 w-4 mr-2" />
                      Landing
                    </TabsTrigger>
                    <TabsTrigger value="proposal">
                      <FileText className="h-4 w-4 mr-2" />
                      Proposal
                    </TabsTrigger>
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
                <Label htmlFor="tone">Tone</Label>
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
              
              {/* Content-specific options */}
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Content-Specific Options</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    {isCollapsed ? 'Show Options' : 'Hide Options'}
                  </Button>
                </div>
                
                {!isCollapsed && (
                  <>
                    {/* Social Media Options */}
                    {contentType === 'social' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="platform">Platform</Label>
                          <Select 
                            value={fields.social.platform} 
                            onValueChange={(value) => updateFields('social', 'platform', value)}
                          >
                            <SelectTrigger id="platform">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="twitter">Twitter/X</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="instagram">Instagram</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="postType">Post Type</Label>
                          <Select 
                            value={fields.social.postType} 
                            onValueChange={(value) => updateFields('social', 'postType', value)}
                          >
                            <SelectTrigger id="postType">
                              <SelectValue placeholder="Select post type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="update">Update</SelectItem>
                              <SelectItem value="question">Question</SelectItem>
                              <SelectItem value="promotion">Promotion</SelectItem>
                              <SelectItem value="testimonial">Testimonial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="hashtags">Hashtags</Label>
                          <Input
                            id="hashtags"
                            placeholder="#marketing #growth"
                            value={fields.social.hashtags}
                            onChange={(e) => updateFields('social', 'hashtags', e.target.value)}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeImage" 
                            checked={fields.social.includeImage}
                            onCheckedChange={(checked) => updateFields('social', 'includeImage', Boolean(checked))}
                          />
                          <Label htmlFor="includeImage">Include placeholder for image</Label>
                        </div>
                      </div>
                    )}
                    
                    {/* Email Options */}
                    {contentType === 'email' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="emailType">Email Type</Label>
                          <Select 
                            value={fields.email.emailType} 
                            onValueChange={(value) => updateFields('email', 'emailType', value)}
                          >
                            <SelectTrigger id="emailType">
                              <SelectValue placeholder="Select email type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newsletter">Newsletter</SelectItem>
                              <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                              <SelectItem value="product-update">Product Update</SelectItem>
                              <SelectItem value="follow-up">Follow-up</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">Email Subject</Label>
                          <Input
                            id="subject"
                            placeholder="Enter email subject"
                            value={fields.email.subject}
                            onChange={(e) => updateFields('email', 'subject', e.target.value)}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeButton" 
                            checked={fields.email.includeButton}
                            onCheckedChange={(checked) => updateFields('email', 'includeButton', Boolean(checked))}
                          />
                          <Label htmlFor="includeButton">Include call-to-action button</Label>
                        </div>
                        
                        {fields.email.includeButton && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="buttonText">Button Text</Label>
                              <Input
                                id="buttonText"
                                placeholder="Learn More"
                                value={fields.email.buttonText}
                                onChange={(e) => updateFields('email', 'buttonText', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="buttonUrl">Button URL</Label>
                              <Input
                                id="buttonUrl"
                                placeholder="https://example.com"
                                value={fields.email.buttonUrl}
                                onChange={(e) => updateFields('email', 'buttonUrl', e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Blog Options */}
                    {contentType === 'blog' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wordCount">Word Count</Label>
                          <Select 
                            value={fields.blog.wordCount.toString()} 
                            onValueChange={(value) => updateFields('blog', 'wordCount', parseInt(value))}
                          >
                            <SelectTrigger id="wordCount">
                              <SelectValue placeholder="Select word count" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="500">Short (~500 words)</SelectItem>
                              <SelectItem value="800">Medium (~800 words)</SelectItem>
                              <SelectItem value="1200">Long (~1200 words)</SelectItem>
                              <SelectItem value="2000">Comprehensive (~2000 words)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeHeadings" 
                              checked={fields.blog.includeHeadings}
                              onCheckedChange={(checked) => updateFields('blog', 'includeHeadings', Boolean(checked))}
                            />
                            <Label htmlFor="includeHeadings">Include headings and subheadings</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeBulletPoints" 
                              checked={fields.blog.includeBulletPoints}
                              onCheckedChange={(checked) => updateFields('blog', 'includeBulletPoints', Boolean(checked))}
                            />
                            <Label htmlFor="includeBulletPoints">Include bullet points</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeConclusion" 
                              checked={fields.blog.includeConclusion}
                              onCheckedChange={(checked) => updateFields('blog', 'includeConclusion', Boolean(checked))}
                            />
                            <Label htmlFor="includeConclusion">Include conclusion</Label>
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        {isWordPressConnected && (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="useWordPress" 
                              checked={fields.blog.useWordPress}
                              onCheckedChange={(checked) => updateFields('blog', 'useWordPress', Boolean(checked))}
                            />
                            <div>
                              <Label htmlFor="useWordPress">Prepare for WordPress</Label>
                              <p className="text-sm text-muted-foreground">Format content for WordPress publishing</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="aiProvider">AI Provider</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowApiKeyFields(!showApiKeyFields)}
                            >
                              {showApiKeyFields ? 'Hide API Keys' : 'Configure API Keys'}
                            </Button>
                          </div>
                          <Select 
                            value={fields.blog.aiProvider} 
                            onValueChange={(value) => updateFields('blog', 'aiProvider', value as AIProvider)}
                          >
                            <SelectTrigger id="aiProvider">
                              <SelectValue placeholder="Select AI provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mock">Default (Mock)</SelectItem>
                              <SelectItem value="chatgpt">ChatGPT</SelectItem>
                              <SelectItem value="perplexity">Perplexity</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {showApiKeyFields && (
                          <div className="space-y-4 p-4 border rounded-md bg-secondary/10">
                            <div className="space-y-2">
                              <Label htmlFor="chatgptApiKey">ChatGPT API Key</Label>
                              <Input
                                id="chatgptApiKey"
                                type="password"
                                placeholder="Enter ChatGPT API Key"
                                value={chatgptApiKey}
                                onChange={(e) => setChatgptApiKey(e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground">API key is stored in memory only and not saved</p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="perplexityApiKey">Perplexity API Key</Label>
                              <Input
                                id="perplexityApiKey"
                                type="password"
                                placeholder="Enter Perplexity API Key"
                                value={perplexityApiKey}
                                onChange={(e) => setPerplexityApiKey(e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground">API key is stored in memory only and not saved</p>
                            </div>
                          </div>
                        )}
                        
                        {fields.blog.aiProvider !== 'mock' && (
                          <div className="space-y-4">
                            {fields.blog.aiProvider === 'chatgpt' && (
                              <div className="space-y-2">
                                <Label htmlFor="aiModel">Model</Label>
                                <Select 
                                  value={fields.blog.aiModel} 
                                  onValueChange={(value) => updateFields('blog', 'aiModel', value)}
                                >
                                  <SelectTrigger id="aiModel">
                                    <SelectValue placeholder="Select AI model" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                                    <SelectItem value="gpt-4o">GPT-4o (Better quality)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="aiTemperature">Creativity</Label>
                                <span className="text-sm text-muted-foreground">
                                  {fields.blog.aiTemperature <= 0.3 ? 'Factual' : 
                                   fields.blog.aiTemperature <= 0.7 ? 'Balanced' : 'Creative'}
                                </span>
                              </div>
                              <Select 
                                value={fields.blog.aiTemperature.toString()} 
                                onValueChange={(value) => updateFields('blog', 'aiTemperature', parseFloat(value))}
                              >
                                <SelectTrigger id="aiTemperature">
                                  <SelectValue placeholder="Select creativity level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0.2">Conservative (Factual)</SelectItem>
                                  <SelectItem value="0.5">Balanced</SelectItem>
                                  <SelectItem value="0.7">Standard</SelectItem>
                                  <SelectItem value="1.0">Creative</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Landing Page Options */}
                    {contentType === 'landing' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Sections to Include</Label>
                          <div className="flex flex-col gap-2">
                            {['Hero', 'Features', 'Benefits', 'How it Works', 'Pricing', 'FAQ'].map((section) => (
                              <div key={section} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`section-${section}`}
                                  checked={fields.landing.sections.includes(section.toLowerCase())}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      updateFields('landing', 'sections', [...fields.landing.sections, section.toLowerCase()]);
                                    } else {
                                      updateFields('landing', 'sections', 
                                        fields.landing.sections.filter(s => s !== section.toLowerCase())
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor={`section-${section}`}>{section}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeTestimonials" 
                              checked={fields.landing.includeTestimonials}
                              onCheckedChange={(checked) => updateFields('landing', 'includeTestimonials', Boolean(checked))}
                            />
                            <Label htmlFor="includeTestimonials">Include testimonials</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includePricing" 
                              checked={fields.landing.includePricing}
                              onCheckedChange={(checked) => updateFields('landing', 'includePricing', Boolean(checked))}
                            />
                            <Label htmlFor="includePricing">Include pricing section</Label>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeCTA" 
                              checked={fields.landing.includeCTA}
                              onCheckedChange={(checked) => updateFields('landing', 'includeCTA', Boolean(checked))}
                            />
                            <Label htmlFor="includeCTA">Include call-to-action</Label>
                          </div>
                          
                          {fields.landing.includeCTA && (
                            <div className="ml-6 mt-2">
                              <Label htmlFor="ctaText">CTA Button Text</Label>
                              <Input
                                id="ctaText"
                                placeholder="Get Started"
                                value={fields.landing.ctaText}
                                onChange={(e) => updateFields('landing', 'ctaText', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Proposal Options */}
                    {contentType === 'proposal' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="proposalType">Proposal Type</Label>
                          <Select 
                            value={fields.proposal.proposalType} 
                            onValueChange={(value) => updateFields('proposal', 'proposalType', value)}
                          >
                            <SelectTrigger id="proposalType">
                              <SelectValue placeholder="Select proposal type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="business">Business Proposal</SelectItem>
                              <SelectItem value="project">Project Proposal</SelectItem>
                              <SelectItem value="partnership">Partnership Proposal</SelectItem>
                              <SelectItem value="sales">Sales Proposal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeTimeline" 
                              checked={fields.proposal.includeTimeline}
                              onCheckedChange={(checked) => updateFields('proposal', 'includeTimeline', Boolean(checked))}
                            />
                            <Label htmlFor="includeTimeline">Include timeline</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeBudget" 
                              checked={fields.proposal.includeBudget}
                              onCheckedChange={(checked) => updateFields('proposal', 'includeBudget', Boolean(checked))}
                            />
                            <Label htmlFor="includeBudget">Include budget section</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeTeam" 
                              checked={fields.proposal.includeTeam}
                              onCheckedChange={(checked) => updateFields('proposal', 'includeTeam', Boolean(checked))}
                            />
                            <Label htmlFor="includeTeam">Include team information</Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* WordPress connection section for blog posts */}
              {contentType === 'blog' && (
                <div className="mt-4 p-4 border rounded-lg bg-secondary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        WordPress Integration
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Connect to your WordPress site for publishing
                      </p>
                    </div>
                    
                    {isWordPressConnected ? (
                      <Badge variant="secondary" className="ml-auto">Connected</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-auto">Not Connected</Badge>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    {isWordPressConnected ? (
                      <div className="space-y-2">
                        <p className="text-sm">Connected to: <span className="font-medium">{wpSiteUrl}</span></p>
                        <Button variant="destructive" size="sm" onClick={disconnectWordPress}>
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://your-wordpress-site.com"
                          value={wpSiteUrl}
                          onChange={(e) => setWpSiteUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={connectWordPress}>
                          Connect
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Selected ICP Details */}
              {selectedIcp && (
                <div className="mt-2 p-4 border rounded-lg bg-secondary/30">
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
                    {fields.blog.aiProvider !== 'mock' && contentType === 'blog' && (
                      <Badge variant="outline" className="ml-2">{fields.blog.aiProvider}</Badge>
                    )}
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


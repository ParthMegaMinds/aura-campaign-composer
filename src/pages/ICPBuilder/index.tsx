
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Trash, Save, User, Users, Briefcase, Wrench, Cog, ChartBar, Projector, Building, Handshake, Globe } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";

const ICPBuilder = () => {
  const { addICP, icps, deleteICP } = useData();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [persona, setPersona] = useState<string[]>([]);
  const [businessSize, setBusinessSize] = useState('');
  const [tone, setTone] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [personaInput, setPersonaInput] = useState('');
  const [designations, setDesignations] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const industries = [
    'SaaS', 'FinTech', 'EdTech', 'Healthcare', 'E-commerce', 
    'Manufacturing', 'Consulting', 'Real Estate', 'Media'
  ];

  const businessSizes = ['Startup', 'SME', 'Enterprise'];
  
  const tones = ['Bold', 'Formal', 'Friendly', 'Conversational', 'Professional', 'Technical'];

  const locations = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'China',
    'India',
    'Brazil',
    'Mexico',
    'Netherlands',
    'Singapore',
    'Global'
  ];

  const availableDesignations = [
    { id: 'ceo', label: 'CEO', icon: Building },
    { id: 'cto', label: 'CTO', icon: Cog },
    { id: 'sales-exec', label: 'Sales Executive', icon: Briefcase },
    { id: 'sales-person', label: 'Sales Person', icon: Briefcase },
    { id: 'project-manager', label: 'Project Manager', icon: Projector },
    { id: 'business-analytics', label: 'Business Analytics', icon: ChartBar },
    { id: 'developers', label: 'Developers', icon: Wrench },
    { id: 'hr', label: 'HR', icon: Handshake },
  ];

  const handleAddTechStack = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techStackInput.trim()) {
      e.preventDefault();
      setTechStack([...techStack, techStackInput.trim()]);
      setTechStackInput('');
    }
  };

  const handleAddPersona = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && personaInput.trim()) {
      e.preventDefault();
      setPersona([...persona, personaInput.trim()]);
      setPersonaInput('');
    }
  };

  const handleRemoveTechStack = (index: number) => {
    const newTechStack = [...techStack];
    newTechStack.splice(index, 1);
    setTechStack(newTechStack);
  };

  const handleRemovePersona = (index: number) => {
    const newPersona = [...persona];
    newPersona.splice(index, 1);
    setPersona(newPersona);
  };

  const handleDesignationChange = (designation: string) => {
    setDesignations(prev => {
      if (prev.includes(designation)) {
        return prev.filter(d => d !== designation);
      } else {
        return [...prev, designation];
      }
    });
  };

  const isFormValid = () => {
    return (
      name.trim() !== '' && 
      industry !== '' && 
      techStack.length > 0 && 
      location !== '' && 
      persona.length > 0 && 
      businessSize !== '' && 
      tone !== ''
    );
  };

  const handleSave = () => {
    setFormSubmitted(true);
    
    if (!isFormValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    addICP({
      name,
      industry,
      techStack,
      location,
      persona,
      businessSize,
      tone,
      designations: designations
    });

    // Reset form
    setName('');
    setIndustry('');
    setTechStack([]);
    setLocation('');
    setPersona([]);
    setBusinessSize('');
    setTone('');
    setTechStackInput('');
    setPersonaInput('');
    setDesignations([]);
    setFormSubmitted(false);
  };

  // AI-generated campaign suggestion based on ICP
  const generateSuggestion = (industry: string, persona: string[]) => {
    const campaigns = [
      `${industry} Thought Leadership Series`,
      `${persona[0]} Pain Point Solutions`,
      `${industry} Industry Trends Report`,
      `ROI Calculator for ${persona[0]}s`,
      `${industry} Tech Stack Evolution Webinar`,
      `Case Studies: ${persona[0]}s in ${industry}`
    ];
    
    return campaigns[Math.floor(Math.random() * campaigns.length)];
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ICP Builder</h1>
          <p className="text-muted-foreground">
            Create your Ideal Customer Profile to target your marketing campaigns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ICP Builder Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Create New ICP</CardTitle>
                <CardDescription>Define who your ideal customer is</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ICP Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Tech SaaS CTO"
                    className={formSubmitted && !name.trim() ? "border-red-500" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={setIndustry} value={industry}>
                    <SelectTrigger className={formSubmitted && !industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(ind => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Input 
                    id="techStack" 
                    value={techStackInput} 
                    onChange={e => setTechStackInput(e.target.value)}
                    onKeyDown={handleAddTechStack}
                    placeholder="Type and press Enter to add"
                    className={formSubmitted && techStack.length === 0 ? "border-red-500" : ""}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {tech}
                        <button 
                          type="button" 
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTechStack(index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select onValueChange={setLocation} value={location}>
                    <SelectTrigger className={formSubmitted && !location ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="persona">Persona</Label>
                  <Input 
                    id="persona" 
                    value={personaInput} 
                    onChange={e => setPersonaInput(e.target.value)}
                    onKeyDown={handleAddPersona}
                    placeholder="Type and press Enter to add"
                    className={formSubmitted && persona.length === 0 ? "border-red-500" : ""}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {persona.map((p, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {p}
                        <button 
                          type="button" 
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemovePersona(index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* New Designations Section */}
                <div className="space-y-2">
                  <Label htmlFor="designations">Target Designations</Label>
                  <div className="grid sm:grid-cols-2 gap-3 mt-2">
                    {availableDesignations.map((designation) => (
                      <div key={designation.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={designation.id}
                          checked={designations.includes(designation.id)} 
                          onCheckedChange={() => handleDesignationChange(designation.id)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label 
                            htmlFor={designation.id}
                            className="flex items-center space-x-2 text-sm font-normal cursor-pointer"
                          >
                            {React.createElement(designation.icon, { className: "h-4 w-4 mr-1" })}
                            <span>{designation.label}</span>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessSize">Business Size</Label>
                  <Select onValueChange={setBusinessSize} value={businessSize}>
                    <SelectTrigger className={formSubmitted && !businessSize ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select business size" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessSizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone of Voice</Label>
                  <Select onValueChange={setTone} value={tone}>
                    <SelectTrigger className={formSubmitted && !tone ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full mt-4" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save ICP
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* AI Suggestions Panel */}
          <div className="space-y-6">
            <Card className="bg-aiva-100 border-aiva-200">
              <CardHeader>
                <CardTitle className="text-aiva-800">AI Insights</CardTitle>
                <CardDescription>
                  {name ? `Personalized suggestions for "${name}"` : "Build your ICP for personalized suggestions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {industry && persona.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-aiva-700 mb-1">Suggested Campaign</h3>
                      <p className="text-gray-700">{generateSuggestion(industry, persona)}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-aiva-700 mb-1">Challenges of this Persona</h3>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Time constraints in evaluating new technologies</li>
                        <li>Managing security and compliance</li>
                        <li>Balancing innovation with stability</li>
                        <li>Reducing operational costs</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-aiva-700 mb-1">Recommended Content Types</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-white">Case Studies</Badge>
                        <Badge variant="outline" className="bg-white">Technical Whitepapers</Badge>
                        <Badge variant="outline" className="bg-white">Video Demos</Badge>
                        <Badge variant="outline" className="bg-white">LinkedIn Posts</Badge>
                        <Badge variant="outline" className="bg-white">Email Sequences</Badge>
                      </div>
                    </div>

                    {designations.length > 0 && (
                      <div>
                        <h3 className="font-medium text-aiva-700 mb-1">Target Designations</h3>
                        <div className="flex flex-wrap gap-2">
                          {designations.map((designation) => {
                            const designObj = availableDesignations.find(d => d.id === designation);
                            if (designObj) {
                              return (
                                <Badge key={designation} variant="outline" className="bg-white flex items-center">
                                  {React.createElement(designObj.icon, { className: "h-3.5 w-3.5 mr-1" })}
                                  {designObj.label}
                                </Badge>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <p>Fill in the ICP details to get AI-powered insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Saved ICPs */}
            <Card>
              <CardHeader>
                <CardTitle>Saved ICPs</CardTitle>
                <CardDescription>Your previously created Ideal Customer Profiles</CardDescription>
              </CardHeader>
              <CardContent>
                {icps.length > 0 ? (
                  <div className="space-y-3">
                    {icps.map((icp) => (
                      <div key={icp.id} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent">
                        <div>
                          <p className="font-medium">{icp.name}</p>
                          <p className="text-sm text-muted-foreground">{icp.industry} • {icp.businessSize}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {icp.persona.map((p, i) => (
                              <span key={i} className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                                {p}
                              </span>
                            ))}
                          </div>
                          {icp.designations && icp.designations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {icp.designations.slice(0, 3).map((d, i) => {
                                const designObj = availableDesignations.find(des => des.id === d);
                                return (
                                  <span key={i} className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded flex items-center">
                                    {designObj && React.createElement(designObj.icon, { className: "h-3 w-3 mr-1" })}
                                    {designObj ? designObj.label : d}
                                  </span>
                                );
                              })}
                              {icp.designations.length > 3 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                  +{icp.designations.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteICP(icp.id)}
                        >
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No saved ICPs yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ICPBuilder;

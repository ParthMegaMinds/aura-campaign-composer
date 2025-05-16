
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AivaLogo from '@/components/AivaLogo';

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Welcome to AIVA",
      description: "Your AI-powered marketing assistant",
      content: (
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b" 
              alt="AIVA AI" 
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
          <p className="text-lg">
            AIVA helps you create better marketing campaigns with AI-powered content generation, 
            graphics creation, and intelligent planning.
          </p>
        </div>
      )
    },
    {
      title: "AI Content Generation",
      description: "Create compelling content in seconds",
      content: (
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
              alt="Content Generation" 
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
          <p className="text-lg">
            Generate social posts, emails, blog outlines and more with our AI tools.
            Just select your target audience, campaign goals, and content type.
          </p>
        </div>
      )
    },
    {
      title: "Visual Content Creation",
      description: "Design eye-catching graphics with AI",
      content: (
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Visual Content" 
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
          <p className="text-lg">
            Our AI tools help you create beautiful post graphics, infographics, 
            and visuals for all your marketing channels.
          </p>
        </div>
      )
    },
    {
      title: "Campaign Planning",
      description: "Streamline your marketing workflow",
      content: (
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
              alt="Campaign Planning" 
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
          <p className="text-lg">
            Plan, schedule, and organize your marketing campaigns with our AI calendar, 
            ICP builder, and content library.
          </p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/');
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AivaLogo />
          </div>
          <CardTitle className="text-2xl">{slides[currentSlide].title}</CardTitle>
          <CardDescription>{slides[currentSlide].description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
          {slides[currentSlide].content}
          
          {/* Progress dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={handleSkip}>
              Skip tour
            </Button>
            <Button onClick={handleNext}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;

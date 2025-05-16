
import { toast } from "@/components/ui/sonner";

export type AIProvider = 'chatgpt' | 'perplexity' | 'mock';

export type AIGenerationParams = {
  prompt: string;
  model?: string;
  temperature?: number;
  provider: AIProvider;
  apiKey?: string; // For temporary client-side usage
};

export const AIService = {
  // Generate content using selected AI provider
  async generateContent(params: AIGenerationParams): Promise<string> {
    try {
      switch(params.provider) {
        case 'chatgpt':
          return await this.generateWithChatGPT(params);
        case 'perplexity':
          return await this.generateWithPerplexity(params);
        case 'mock':
        default:
          return this.generateMockContent(params.prompt);
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast.error("Failed to generate content with AI");
      return "";
    }
  },
  
  // Generate with OpenAI's ChatGPT
  async generateWithChatGPT(params: AIGenerationParams): Promise<string> {
    if (!params.apiKey) {
      toast.error("ChatGPT API key is required");
      return "";
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${params.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: params.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional content writer specializing in marketing and business content.'
            },
            {
              role: 'user',
              content: params.prompt
            }
          ],
          temperature: params.temperature || 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`ChatGPT API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error("ChatGPT API error:", error);
      toast.error("Failed to generate content with ChatGPT");
      return "";
    }
  },
  
  // Generate with Perplexity AI
  async generateWithPerplexity(params: AIGenerationParams): Promise<string> {
    if (!params.apiKey) {
      toast.error("Perplexity API key is required");
      return "";
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${params.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a professional content writer specializing in marketing and business content.'
            },
            {
              role: 'user',
              content: params.prompt
            }
          ],
          temperature: params.temperature || 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          search_domain_filter: ['perplexity.ai'],
          search_recency_filter: 'month',
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error("Perplexity API error:", error);
      toast.error("Failed to generate content with Perplexity");
      return "";
    }
  },
  
  // Generate mock content for testing without API keys
  generateMockContent(prompt: string): string {
    const templates = {
      blog: `# Blog Post: ${prompt}

## Introduction
This is a sample blog post introduction about ${prompt}. It would typically provide context and hook the reader.

## Main Points
1. First key insight about ${prompt}
2. Second important aspect of ${prompt}
3. Industry trends related to ${prompt}

## Best Practices
- Follow these guidelines for best results
- Implement these strategies consistently
- Measure and adjust your approach

## Conclusion
In conclusion, ${prompt} represents an important opportunity for businesses that understand how to leverage it effectively.`,
      
      default: `Content about ${prompt} would be generated here. This is placeholder text for demonstration purposes.`
    };
    
    // Return blog template if prompt contains blog, otherwise return default template
    return prompt.toLowerCase().includes('blog') ? templates.blog : templates.default;
  }
};

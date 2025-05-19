
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WordPressService } from '@/services/WordPressService';
import { toast } from "@/components/ui/sonner";
import { Globe, Key } from 'lucide-react';

export const WordPressCredentialsForm = () => {
  const [wpSiteUrl, setWpSiteUrl] = useState(WordPressService.getSiteUrl() || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(WordPressService.hasApiCredentials());

  const handleSaveUrl = () => {
    if (!wpSiteUrl) {
      toast.error("Please enter a valid WordPress site URL");
      return;
    }
    
    WordPressService.setSiteUrl(wpSiteUrl);
    toast.success("WordPress site URL saved");
  };

  const handleSaveCredentials = () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    WordPressService.saveApiCredentials(username, password);
    setHasCredentials(true);
    setPassword(''); // Clear password for security
  };

  const handleClearCredentials = () => {
    WordPressService.clearApiCredentials();
    setHasCredentials(false);
    setUsername('');
    setPassword('');
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    
    try {
      const isConnected = await WordPressService.testConnection();
      
      if (isConnected) {
        toast.success("Successfully connected to WordPress site");
      } else {
        toast.error("Failed to connect to WordPress site");
      }
    } catch (error) {
      console.error("Connection test error:", error);
      toast.error("Failed to connect to WordPress site");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          WordPress Configuration
        </CardTitle>
        <CardDescription>
          Connect to your WordPress site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wp-url">WordPress Site URL</Label>
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input 
                id="wp-url"
                placeholder="https://your-wordpress-site.com" 
                value={wpSiteUrl}
                onChange={(e) => setWpSiteUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveUrl}>Save</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your WordPress site URL (e.g., https://example.com)
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Key className="mr-2 h-4 w-4" />
            <h3 className="text-sm font-medium">API Credentials</h3>
          </div>
          
          {hasCredentials ? (
            <div className="space-y-4">
              <p className="text-sm">Credentials are saved. You can:</p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleClearCredentials}>
                  Clear Credentials
                </Button>
                <Button 
                  onClick={handleTestConnection}
                  disabled={isLoading}
                >
                  {isLoading ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  placeholder="WordPress username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="WordPress password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  For security, use an application password from WordPress
                </p>
              </div>
              <Button onClick={handleSaveCredentials}>
                Save Credentials
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Your credentials are stored locally and never transmitted to our servers
        </p>
      </CardFooter>
    </Card>
  );
};

export default WordPressCredentialsForm;

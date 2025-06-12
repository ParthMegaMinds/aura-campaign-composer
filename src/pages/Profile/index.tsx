
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Shield, Bell, Eye, Save, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const Profile = () => {
  const { user, updateUserRole } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'marketing',
    bio: 'Marketing professional with 5+ years of experience in digital campaigns and content strategy.',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    phone: '+1 (555) 123-4567',
    website: 'https://johndoe.com'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    campaignUpdates: true,
    contentSuggestions: true,
    weeklyReports: false,
    marketingTips: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'team',
    dataSharing: false,
    analyticsTracking: true,
    thirdPartyIntegrations: true
  });

  const handleProfileSave = () => {
    // In a real app, this would make an API call
    if (profileData.role !== user?.role) {
      updateUserRole(profileData.role as 'marketing' | 'design' | 'sales');
    }
    toast.success('Profile updated successfully!');
  };

  const handlePreferencesSave = () => {
    // In a real app, this would make an API call
    toast.success('Preferences updated successfully!');
  };

  const handlePrivacySave = () => {
    // In a real app, this would make an API call
    toast.success('Privacy settings updated successfully!');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" alt={profileData.name} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="mb-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-gray-500">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={profileData.role}
                      onValueChange={(value) => setProfileData({...profileData, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => setProfileData({...profileData, timezone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button onClick={handleProfileSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={(e) => setPreferences({...preferences, pushNotifications: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Campaign Updates</h4>
                      <p className="text-sm text-gray-500">Get notified about campaign performance</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.campaignUpdates}
                      onChange={(e) => setPreferences({...preferences, campaignUpdates: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Content Suggestions</h4>
                      <p className="text-sm text-gray-500">Receive AI-powered content recommendations</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.contentSuggestions}
                      onChange={(e) => setPreferences({...preferences, contentSuggestions: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Reports</h4>
                      <p className="text-sm text-gray-500">Get weekly performance summaries</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.weeklyReports}
                      onChange={(e) => setPreferences({...preferences, weeklyReports: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Tips</h4>
                      <p className="text-sm text-gray-500">Receive tips and best practices</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketingTips}
                      onChange={(e) => setPreferences({...preferences, marketingTips: e.target.checked})}
                      className="toggle"
                    />
                  </div>
                </div>

                <Button onClick={handlePreferencesSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="team">Team Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Sharing</h4>
                      <p className="text-sm text-gray-500">Allow anonymized data sharing for product improvement</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.dataSharing}
                      onChange={(e) => setPrivacy({...privacy, dataSharing: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analytics Tracking</h4>
                      <p className="text-sm text-gray-500">Enable usage analytics for better experience</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.analyticsTracking}
                      onChange={(e) => setPrivacy({...privacy, analyticsTracking: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Third-party Integrations</h4>
                      <p className="text-sm text-gray-500">Allow integrations with external services</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.thirdPartyIntegrations}
                      onChange={(e) => setPrivacy({...privacy, thirdPartyIntegrations: e.target.checked})}
                      className="toggle"
                    />
                  </div>
                </div>

                <Button onClick={handlePrivacySave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Change Password</h4>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                      <Button variant="outline">Update Password</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <Badge variant="outline" className="mb-3">Not Enabled</Badge>
                    <div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Active Sessions</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Manage your active sessions across devices
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-gray-500">Chrome on macOS • San Francisco, CA</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;

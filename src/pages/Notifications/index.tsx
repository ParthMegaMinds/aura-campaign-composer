
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCheck, Trash2, Settings } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'campaign' | 'content' | 'system' | 'social';
  isRead: boolean;
  timestamp: Date;
  actionUrl?: string;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Campaign Performance Update',
      message: 'Your "Summer Launch" campaign has reached 1,000 impressions.',
      type: 'campaign',
      isRead: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      actionUrl: '/campaigns/1'
    },
    {
      id: '2',
      title: 'Content Published Successfully',
      message: 'Your LinkedIn post "AI in Marketing" has been published.',
      type: 'social',
      isRead: false,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: '3',
      title: 'New ICP Suggestion',
      message: 'We found a new potential ICP based on your recent campaigns.',
      type: 'system',
      isRead: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      actionUrl: '/icp-builder'
    },
    {
      id: '4',
      title: 'Content Generation Complete',
      message: '5 new content pieces have been generated for your Tech Startup ICP.',
      type: 'content',
      isRead: true,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      actionUrl: '/content-library'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notification deleted');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'campaign': return 'bg-blue-100 text-blue-800';
      case 'content': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={`mb-4 ${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <Badge variant="secondary" className={getTypeColor(notification.type)}>
                {notification.type}
              </Badge>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
            <p className="text-xs text-gray-400">{formatTime(notification.timestamp)}</p>
          </div>
          <div className="flex gap-1 ml-4">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(notification.id)}
                className="p-1 h-8 w-8"
              >
                <CheckCheck className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteNotification(notification.id)}
              className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} new</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {allNotifications.length > 0 ? (
              <div>
                {allNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="unread">
            {unreadNotifications.length > 0 ? (
              <div>
                {unreadNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCheck className="w-12 h-12 mx-auto text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-500">No unread notifications.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Notifications;

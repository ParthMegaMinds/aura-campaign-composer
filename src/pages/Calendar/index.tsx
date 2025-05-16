
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useData, CalendarItem } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format, addDays, startOfWeek, getDay, isSameDay, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const CalendarPlanner = () => {
  const { calendarItems, contents, graphics, addCalendarItem, updateCalendarItem, deleteCalendarItem } = useData();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [view, setView] = useState<'month' | 'week'>('month');
  const [filterPlatforms, setFilterPlatforms] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  // New calendar item form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDate, setNewItemDate] = useState<Date | undefined>(new Date());
  const [newItemPlatform, setNewItemPlatform] = useState('LinkedIn');
  const [newItemStatus, setNewItemStatus] = useState<'draft' | 'ready' | 'scheduled' | 'live'>('draft');
  const [newItemContentId, setNewItemContentId] = useState('');
  const [newItemGraphicId, setNewItemGraphicId] = useState('');
  
  const platforms = ['LinkedIn', 'Instagram', 'Twitter', 'Facebook', 'Email', 'Blog'];
  const statuses = ['draft', 'ready', 'scheduled', 'live'];

  const filteredCalendarItems = calendarItems.filter(item => {
    const matchesPlatform = filterPlatforms.length === 0 || filterPlatforms.includes(item.platform);
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(item.status);
    return matchesPlatform && matchesStatus;
  });

  const handleAddCalendarItem = () => {
    if (!newItemTitle || !newItemDate) {
      return;
    }

    addCalendarItem({
      title: newItemTitle,
      date: newItemDate.toISOString(),
      contentId: newItemContentId || undefined,
      graphicId: newItemGraphicId || undefined,
      platform: newItemPlatform,
      status: newItemStatus
    });

    // Reset form
    setNewItemTitle('');
    setNewItemDate(new Date());
    setNewItemPlatform('LinkedIn');
    setNewItemStatus('draft');
    setNewItemContentId('');
    setNewItemGraphicId('');
    setIsDialogOpen(false);
  };

  const togglePlatformFilter = (platform: string) => {
    setFilterPlatforms(current =>
      current.includes(platform)
        ? current.filter(p => p !== platform)
        : [...current, platform]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setFilterStatus(current =>
      current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-700';
      case 'ready': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-amber-100 text-amber-700';
      case 'live': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const dateHasCalendarItems = (date: Date): boolean => {
    return filteredCalendarItems.some(item => {
      const itemDate = parseISO(item.date);
      return isSameDay(date, itemDate);
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
            <p className="text-muted-foreground">
              Plan and manage your content publishing schedule
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Calendar Item</DialogTitle>
                  <DialogDescription>
                    Create a new item in your content calendar
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="e.g., LinkedIn Post on AI Benefits"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newItemDate ? format(newItemDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newItemDate}
                          onSelect={setNewItemDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select onValueChange={setNewItemPlatform} defaultValue={newItemPlatform}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map(platform => (
                          <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value: 'draft' | 'ready' | 'scheduled' | 'live') => setNewItemStatus(value)} defaultValue={newItemStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content (Optional)</Label>
                    <Select onValueChange={setNewItemContentId} value={newItemContentId}>
                      <SelectTrigger id="content">
                        <SelectValue placeholder="Select content" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {contents.map(content => (
                          <SelectItem key={content.id} value={content.id}>{content.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="graphic">Graphic (Optional)</Label>
                    <Select onValueChange={setNewItemGraphicId} value={newItemGraphicId}>
                      <SelectTrigger id="graphic">
                        <SelectValue placeholder="Select graphic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {graphics.map(graphic => (
                          <SelectItem key={graphic.id} value={graphic.id}>{graphic.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCalendarItem}>
                    Add to Calendar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <p className="font-medium mb-1 text-sm">Platform</p>
                  {platforms.map(platform => (
                    <DropdownMenuCheckboxItem
                      key={platform}
                      checked={filterPlatforms.includes(platform)}
                      onCheckedChange={() => togglePlatformFilter(platform)}
                    >
                      {platform}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <p className="font-medium mb-1 text-sm">Status</p>
                  {statuses.map(status => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filterStatus.includes(status)}
                      onCheckedChange={() => toggleStatusFilter(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Calendar View</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant={view === 'month' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setView('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={view === 'week' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setView('week')}
                >
                  Week
                </Button>
              </div>
            </div>
            <CardDescription>
              {date ? format(date, 'MMMM yyyy') : 'Select a date'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                onMonthChange={setDate}
                className="rounded-md border pointer-events-auto"
                classNames={{
                  day: (day) => 
                    cn("", { 
                      'bg-primary/10 font-bold': dateHasCalendarItems(day) 
                    })
                }}
              />
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">
                {selectedDate 
                  ? `Content for ${format(selectedDate, 'MMMM d, yyyy')}` 
                  : 'Upcoming Content'
                }
              </h3>
              
              <div className="space-y-3">
                {filteredCalendarItems
                  .filter(item => {
                    if (!selectedDate) return true;
                    const itemDate = parseISO(item.date);
                    return isSameDay(selectedDate, itemDate);
                  })
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((item) => (
                    <div 
                      key={item.id} 
                      className="border rounded-lg p-3 hover:bg-accent/50 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{format(parseISO(item.date), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                            {item.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {filteredCalendarItems
                  .filter(item => {
                    if (!selectedDate) return false;
                    const itemDate = parseISO(item.date);
                    return isSameDay(selectedDate, itemDate);
                  })
                  .length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>{selectedDate ? 'No content scheduled for this date' : 'Select a date to view content'}</p>
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarPlanner;

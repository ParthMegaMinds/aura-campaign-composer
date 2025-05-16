
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellDot, User, Settings, Plus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AivaLogo from './AivaLogo';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="border-b p-4 flex justify-between items-center bg-white">
        <div className="flex items-center gap-6">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <AivaLogo />
          </div>
          <div className="hidden md:flex border rounded-md items-center px-3 py-1 bg-secondary">
            <Search className="w-4 h-4 mr-2 text-muted-foreground" />
            <Input 
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent" 
              placeholder="Search..." 
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate('/notifications')}
          >
            <BellDot className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => navigate('/create-campaign')}>
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r p-4 bg-secondary/50">
          <nav className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/')}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/campaigns')}
            >
              Campaigns
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/content-generator')}
            >
              Content Generator
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/graphics-generator')}
            >
              Graphics Generator
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/calendar')}
            >
              Content Calendar
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/icp-builder')}
            >
              ICP Builder
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/content-library')}
            >
              Content Library
            </Button>
          </nav>

          <div className="mt-auto pt-6">
            <div className="bg-aiva-100 rounded-lg p-4 text-sm">
              <p className="font-medium text-aiva-700">Need help?</p>
              <p className="text-gray-600 mt-1">Check out our guides or contact support</p>
              <Button 
                variant="link" 
                className="px-0 text-aiva-600"
                onClick={() => navigate('/help')}
              >
                Learn more
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

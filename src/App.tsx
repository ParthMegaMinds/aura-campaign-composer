
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Auth Routes
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Onboarding from "./pages/Auth/Onboarding";

// Main Routes
import Dashboard from "./pages/Dashboard";
import ICPBuilder from "./pages/ICPBuilder";
import ContentGenerator from "./pages/ContentGenerator";
import GraphicsGenerator from "./pages/GraphicsGenerator";
import CalendarPlanner from "./pages/Calendar";
import ContentLibrary from "./pages/ContentLibrary";
import CampaignsPage from "./pages/Campaign/CampaignsPage";
import CreateCampaign from "./pages/Campaign/CreateCampaign";
import CampaignDetail from "./pages/Campaign/CampaignDetail";
import CampaignAnalytics from "./pages/Campaign/CampaignAnalytics";
import CampaignPDFReport from "./pages/Campaign/CampaignPDFReport";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/icp-builder" element={<ProtectedRoute><ICPBuilder /></ProtectedRoute>} />
              <Route path="/content-generator" element={<ProtectedRoute><ContentGenerator /></ProtectedRoute>} />
              <Route path="/graphics-generator" element={<ProtectedRoute><GraphicsGenerator /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><CalendarPlanner /></ProtectedRoute>} />
              <Route path="/content-library" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
              <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
              <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
              <Route path="/campaign/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
              <Route path="/campaign/:id/analytics" element={<ProtectedRoute><CampaignAnalytics /></ProtectedRoute>} />
              <Route path="/campaign/:id/pdf-report" element={<ProtectedRoute><CampaignPDFReport /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Catch All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

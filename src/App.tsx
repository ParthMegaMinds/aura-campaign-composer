
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseDataProvider } from "@/contexts/SupabaseDataContext";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SupabaseDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main Routes - No authentication required */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/icp-builder" element={<ICPBuilder />} />
              <Route path="/content-generator" element={<ContentGenerator />} />
              <Route path="/graphics-generator" element={<GraphicsGenerator />} />
              <Route path="/calendar" element={<CalendarPlanner />} />
              <Route path="/content-library" element={<ContentLibrary />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/campaign/:id" element={<CampaignDetail />} />
              <Route path="/campaign/:id/analytics" element={<CampaignAnalytics />} />
              <Route path="/campaign/:id/pdf-report" element={<CampaignPDFReport />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Catch All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

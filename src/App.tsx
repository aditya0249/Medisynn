import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HealthChecker from "./pages/HealthChecker";
import Doctors from "./pages/Doctors";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import MentalHealth from "./pages/MentalHealth";
import Emergency from "./pages/Emergency";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Navigation from "./components/Navigation"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <HotToaster
  position="top-center"/>


      
      <Sonner />
      {/* GLOBAL TOASTER - sab pages par toast show karega */}
      
    
      <BrowserRouter>
         
        {/* ✅ Navbar placed outside Routes so it stays visible on every page */}
        <Navigation />

        {/* ✅ All Routes */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/health-checker" element={<HealthChecker />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<Profile />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

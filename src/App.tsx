import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LanguageSelection from "./pages/LanguageSelection";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CropAdvisor from "./pages/CropAdvisor";
import Schemes from "./pages/Schemes";
import Community from "./pages/Community";
import OutcomeTracker from "./pages/OutcomeTracker";
import Weather from "./pages/Weather";
import AIAssistantPage from "./pages/AIAssistantPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Profile required wrapper
const ProfileRequired: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, hasProfile } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!hasProfile) {
    return <Navigate to="/profile-setup" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LanguageSelection />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/profile-setup" 
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProfileRequired>
            <Home />
          </ProfileRequired>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProfileRequired>
            <Profile />
          </ProfileRequired>
        } 
      />
      <Route 
        path="/crop-advisor" 
        element={
          <ProfileRequired>
            <CropAdvisor />
          </ProfileRequired>
        } 
      />
      <Route 
        path="/schemes" 
        element={
          <ProfileRequired>
            <Schemes />
          </ProfileRequired>
        } 
      />
      <Route 
        path="/community" 
        element={
          <ProfileRequired>
            <Community />
          </ProfileRequired>
        } 
      />
      <Route 
        path="/outcome-tracker" 
        element={
          <ProfileRequired>
            <OutcomeTracker />
          </ProfileRequired>
        } 
      />
      <Route 
        path="/weather" 
        element={
          <ProfileRequired>
            <Weather />
          </ProfileRequired>
        } 
      />
      <Route 
        path="/ai-assistant" 
        element={
          <ProfileRequired>
            <AIAssistantPage />
          </ProfileRequired>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

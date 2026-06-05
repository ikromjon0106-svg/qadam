import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound.jsx';
import { AuthProvider, useAuth } from '@/lib/AuthContext.jsx';
import UserNotRegisteredError from '@/components/UserNotRegisteredError.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import ForgotPassword from '@/pages/ForgotPassword.jsx';
import ResetPassword from '@/pages/ResetPassword.jsx';

import MobileLayout from '@/components/layout/MobileLayout.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import MapTracking from '@/pages/MapTracking.jsx';
import Leaderboard from '@/pages/Leaderboard.jsx';
import Marketplace from '@/pages/Marketplace.jsx';
import Profile from '@/pages/Profile.jsx';
import Missions from '@/pages/Missions.jsx';
import Achievements from '@/pages/Achievements.jsx';
import Referral from '@/pages/Referral.jsx';
import Subscription from '@/pages/Subscription.jsx';
import AICoach from '@/pages/AICoach.jsx';
import AdminDashboard from '@/pages/admin/AdminDashboard.jsx';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  useEffect(() => {
    if (authError?.type === 'auth_required') {
      navigateToLogin();
    }
  }, [authError, navigateToLogin]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary font-display">Q</span>
          </div>
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      return null;
    }
    return <div className="p-4 flex justify-center items-center h-screen text-red-500">Error: {authError.message}</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<MapTracking />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/missions" element={<Missions />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/ai-coach" element={<AICoach />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
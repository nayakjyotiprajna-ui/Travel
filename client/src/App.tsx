import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AccessibilityModal } from './components/common/AccessibilityModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { VirtualVisitSetupPage } from './pages/VirtualVisitSetupPage';
import { VirtualExperiencePage } from './pages/VirtualExperiencePage';
import { SimulatePage } from './pages/SimulatePage';
import { AiTravelTwinPage } from './pages/AiTravelTwinPage';
import { TravelTogetherPage } from './pages/TravelTogetherPage';
import { PassportPage } from './pages/PassportPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isExperienceScreen = location.pathname.startsWith('/experience');

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-tealAccent/30 selection:text-tealAccent-light">
      {!isExperienceScreen && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isExperienceScreen && <Footer />}
      <AccessibilityModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AccessibilityProvider>
          <Router>
            <LayoutWrapper>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/destination/:id" element={<DestinationDetailPage />} />
                <Route path="/virtual-visit" element={<VirtualVisitSetupPage />} />
                <Route path="/experience/:destinationId" element={<VirtualExperiencePage />} />
                <Route path="/simulate" element={<SimulatePage />} />
                <Route path="/ai-travel-twin" element={<AiTravelTwinPage />} />
                <Route path="/onboarding" element={<AiTravelTwinPage />} />
                <Route path="/travel-together" element={<TravelTogetherPage />} />
                <Route path="/passport" element={<PassportPage />} />
                <Route path="/memories" element={<MemoriesPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </LayoutWrapper>
          </Router>
        </AccessibilityProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;

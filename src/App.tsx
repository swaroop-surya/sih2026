import React, { useState } from 'react';
import { AegisProvider, useAegis } from './hooks/useAegisState';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VoiceTriggerProvider } from './context/VoiceTriggerContext';
import { ThemeProvider } from './context/ThemeContext';
import { DiscreetVoiceGuardModal } from './components/common/DiscreetVoiceGuardModal';
import { MobileShell } from './components/layout/MobileShell';
import { SplashScreen } from './components/auth/SplashScreen';
import { WelcomePage } from './pages/WelcomePage';
import { AuthCodePage } from './pages/AuthCodePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { RiskAssessmentPage } from './pages/RiskAssessmentPage';
import { RecruitmentCheckerPage } from './pages/RecruitmentCheckerPage';
import { SafetyCheckinPage } from './pages/SafetyCheckinPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { EvidenceVaultPage } from './pages/EvidenceVaultPage';
import { SafetyPlanPage } from './pages/SafetyPlanPage';
import { LocationSafetyPage } from './pages/LocationSafetyPage';
import { CyberSafetyPage } from './pages/CyberSafetyPage';
import { ResourceNavigatorPage } from './pages/ResourceNavigatorPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ResponderDashboardPage } from './pages/ResponderDashboardPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { NearbyPage } from './pages/NearbyPage';
import { NearbyProvider } from './context/NearbyContext';

const AppContent: React.FC = () => {
  const { currentPage, setCurrentPage } = useAegis();
  const { session, isLoading, communityProfile } = useAuth();
  const [authStep, setAuthStep] = useState<'welcome' | 'code'>('welcome');

  // 1. Initial Loading: Arch logo splash
  if (isLoading) {
    return <SplashScreen />;
  }

  // 2. Unauthenticated: Welcome & OTP screens
  if (!session) {
    if (authStep === 'welcome') {
      return <WelcomePage onCodeSent={() => setAuthStep('code')} />;
    }
    return (
      <AuthCodePage
        onChangeTarget={() => setAuthStep('welcome')}
        onSuccess={(onboarded) => {
          if (!onboarded) {
            setCurrentPage('onboarding');
          } else {
            setCurrentPage('home');
          }
        }}
      />
    );
  }

  // 3. First-login onboarding (if profile is not yet onboarded)
  if (communityProfile && !communityProfile.onboarded && currentPage === 'onboarding') {
    return <OnboardingPage />;
  }

  // 4. Authenticated Main Flow
  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding':
        return <OnboardingPage />;
      case 'home':
        return <HomePage />;
      case 'emergency':
        return <EmergencyPage />;
      case 'risk-check':
        return <RiskAssessmentPage />;
      case 'recruitment-checker':
        return <RecruitmentCheckerPage />;
      case 'checkin':
        return <SafetyCheckinPage />;
      case 'incidents':
        return <IncidentsPage />;
      case 'evidence':
        return <EvidenceVaultPage />;
      case 'safety-plan':
        return <SafetyPlanPage />;
      case 'location-safety':
        return <LocationSafetyPage />;
      case 'cyber-safety':
        return <CyberSafetyPage />;
      case 'resources':
        return <ResourceNavigatorPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'responder':
        return <ResponderDashboardPage />;
      case 'analytics':
        return <AnalyticsDashboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'nearby':
        return <NearbyPage />;
      default:
        return <HomePage />;
    }
  };

  return <MobileShell>{renderPage()}</MobileShell>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AegisProvider>
          <VoiceTriggerProvider>
            <NearbyProvider>
              <AppContent />
              <DiscreetVoiceGuardModal />
            </NearbyProvider>
          </VoiceTriggerProvider>
        </AegisProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

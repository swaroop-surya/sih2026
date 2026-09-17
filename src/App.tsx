import React from 'react';
import { AegisProvider, useAegis } from './hooks/useAegisState';
import { VoiceTriggerProvider } from './context/VoiceTriggerContext';
import { ThemeProvider } from './context/ThemeContext';
import { DiscreetVoiceGuardModal } from './components/common/DiscreetVoiceGuardModal';
import { MobileShell } from './components/layout/MobileShell';
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

const AppContent: React.FC = () => {
  const { currentPage } = useAegis();

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
      default:
        return <HomePage />;
    }
  };

  return <MobileShell>{renderPage()}</MobileShell>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AegisProvider>
        <VoiceTriggerProvider>
          <AppContent />
          <DiscreetVoiceGuardModal />
        </VoiceTriggerProvider>
      </AegisProvider>
    </ThemeProvider>
  );
}

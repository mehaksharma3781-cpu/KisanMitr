import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sprout, FileText, Cloud, Users, Map, TrendingUp,
  ChevronRight, AlertTriangle, CheckCircle, Clock,
  IndianRupee, Shield, Wheat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIAssistant from '@/components/AIAssistant';
import WeatherAlert from '@/components/WeatherAlert';
import CropCard from '@/components/CropCard';
import SchemeCard from '@/components/SchemeCard';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { profile, logout } = useAuth();
  const [showAI, setShowAI] = useState(false);

  const quickActions = [
    { id: 'crop', icon: Sprout, label: t('crop_advisor'), color: 'bg-primary' },
    { id: 'schemes', icon: FileText, label: t('schemes'), color: 'bg-secondary' },
    { id: 'weather', icon: Cloud, label: t('weather'), color: 'bg-accent' },
    { id: 'community', icon: Users, label: t('community'), color: 'bg-warning' },
    { id: 'farm', icon: Map, label: t('my_farm'), color: 'bg-success' },
    { id: 'track', icon: TrendingUp, label: t('track_progress'), color: 'bg-destructive' },
  ];

  const crops = [
    {
      name: 'Wheat',
      nameHi: 'गेहूं',
      emoji: '🌾',
      status: 'recommended' as const,
      subsidy: 15000,
      hasInsurance: true,
      hasMSP: true,
      season: 'Rabi',
    },
    {
      name: 'Rice',
      nameHi: 'चावल',
      emoji: '🍚',
      status: 'risky' as const,
      subsidy: 10000,
      hasInsurance: true,
      hasMSP: true,
      season: 'Kharif',
    },
    {
      name: 'Cotton',
      nameHi: 'कपास',
      emoji: '☁️',
      status: 'not_advised' as const,
      subsidy: 5000,
      hasInsurance: false,
      hasMSP: false,
      season: 'Kharif',
    },
  ];

  const schemes = [
    {
      name: 'PM-KISAN',
      description: 'Direct income support of ₹6000/year',
      status: 'ready' as const,
      amount: 6000,
      deadline: '15 Feb 2024',
    },
    {
      name: 'PMFBY',
      description: 'Crop insurance scheme',
      status: 'missing_docs' as const,
      missingDocs: ['Land Record', 'Bank Statement'],
      deadline: '28 Feb 2024',
    },
    {
      name: 'Soil Health Card',
      description: 'Free soil testing and recommendations',
      status: 'ready' as const,
      deadline: 'Open',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 pt-8 pb-12 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{t('hello_farmer')}</h1>
              <p className="text-primary-foreground/80 text-sm">
                {profile?.district}, {profile?.state}
              </p>
            </div>
            <button 
              onClick={logout}
              className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center"
            >
              <Sprout className="w-6 h-6" />
            </button>
          </div>
          
          <p className="text-primary-foreground/90">
            {t('dashboard_subtitle')}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 -mt-6 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button key={action.id} className="icon-btn animate-scale-in">
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Weather Alert */}
      <div className="px-4 mt-6 max-w-md mx-auto">
        <WeatherAlert />
      </div>

      {/* Crop Recommendations */}
      <div className="px-4 mt-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Wheat className="w-5 h-5 text-primary" />
            {t('crop_advisor')}
          </h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {crops.map((crop, index) => (
            <CropCard key={index} crop={crop} />
          ))}
        </div>
      </div>

      {/* Government Schemes */}
      <div className="px-4 mt-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            {t('schemes')}
          </h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {schemes.map((scheme, index) => (
            <SchemeCard key={index} scheme={scheme} />
          ))}
        </div>
      </div>

      {/* AI Assistant Button */}
      <button 
        onClick={() => setShowAI(true)}
        className="ai-float-btn"
        aria-label="Open AI Assistant"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </button>

      {/* AI Assistant Modal */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
};

export default Dashboard;

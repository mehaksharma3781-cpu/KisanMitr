import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, FileText, Cloud, Users, Map, TrendingUp,
  ChevronRight, Wheat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import WeatherAlert from '@/components/WeatherAlert';
import CropCard from '@/components/CropCard';
import SchemeCard from '@/components/SchemeCard';
import { playClickSound } from '@/hooks/useClickSound';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { id: 'crop', icon: Sprout, label: t('crop_advisor'), color: 'bg-primary', path: '/crop-advisor' },
    { id: 'schemes', icon: FileText, label: t('schemes'), color: 'bg-secondary', path: '/schemes' },
    { id: 'weather', icon: Cloud, label: t('weather'), color: 'bg-accent', path: '/weather' },
    { id: 'community', icon: Users, label: t('community'), color: 'bg-warning', path: '/community' },
    { id: 'farm', icon: Map, label: t('my_farm') || 'My Farm', color: 'bg-success', path: '/profile' },
    { id: 'track', icon: TrendingUp, label: t('track_progress'), color: 'bg-destructive', path: '/outcome-tracker' },
  ];

  const topCrops = [
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
  ];

  const topSchemes = [
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
      missingDocs: ['Land Record'],
      deadline: '28 Feb 2024',
    },
  ];

  return (
    <AppLayout 
      title={t('hello_farmer')}
      subtitle={profile?.district ? `${profile.district}, ${profile.state}` : undefined}
    >
      {/* Quick Actions */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <button 
              key={action.id} 
              className="icon-btn animate-scale-in"
              onClick={() => {
                playClickSound();
                navigate(action.path);
              }}
            >
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
      <div className="px-4 max-w-4xl mx-auto">
        <WeatherAlert />
      </div>

      {/* Crop Recommendations */}
      <div className="px-4 mt-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Wheat className="w-5 h-5 text-primary" />
            {t('crop_advisor')}
          </h2>
          <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/crop-advisor')}>
            {t('view_details') || 'View All'} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {topCrops.map((crop, index) => (
            <CropCard key={index} crop={crop} />
          ))}
        </div>
      </div>

      {/* Government Schemes */}
      <div className="px-4 mt-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            {t('schemes')}
          </h2>
          <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/schemes')}>
            {t('view_details') || 'View All'} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {topSchemes.map((scheme, index) => (
            <SchemeCard key={index} scheme={scheme} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;

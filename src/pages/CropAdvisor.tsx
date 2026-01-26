import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sprout, Filter, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import CropCard from '@/components/CropCard';

const CropAdvisor: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'recommended' | 'risky' | 'not_advised'>('all');

  const allCrops = [
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
    {
      name: 'Sugarcane',
      nameHi: 'गन्ना',
      emoji: '🎋',
      status: 'recommended' as const,
      subsidy: 20000,
      hasInsurance: true,
      hasMSP: true,
      season: 'Annual',
    },
    {
      name: 'Mustard',
      nameHi: 'सरसों',
      emoji: '🌻',
      status: 'recommended' as const,
      subsidy: 8000,
      hasInsurance: true,
      hasMSP: true,
      season: 'Rabi',
    },
    {
      name: 'Groundnut',
      nameHi: 'मूंगफली',
      emoji: '🥜',
      status: 'risky' as const,
      subsidy: 7000,
      hasInsurance: true,
      hasMSP: false,
      season: 'Kharif',
    },
    {
      name: 'Soybean',
      nameHi: 'सोयाबीन',
      emoji: '🫛',
      status: 'not_advised' as const,
      subsidy: 4000,
      hasInsurance: false,
      hasMSP: false,
      season: 'Kharif',
    },
    {
      name: 'Potato',
      nameHi: 'आलू',
      emoji: '🥔',
      status: 'recommended' as const,
      subsidy: 12000,
      hasInsurance: true,
      hasMSP: false,
      season: 'Rabi',
    },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: Filter, color: 'bg-muted text-foreground' },
    { id: 'recommended', label: t('recommended'), icon: CheckCircle, color: 'bg-success text-white' },
    { id: 'risky', label: t('risky'), icon: AlertTriangle, color: 'bg-warning text-white' },
    { id: 'not_advised', label: t('not_advised'), icon: XCircle, color: 'bg-destructive text-white' },
  ];

  const filteredCrops = activeFilter === 'all' 
    ? allCrops 
    : allCrops.filter(crop => crop.status === activeFilter);

  const getCounts = () => ({
    all: allCrops.length,
    recommended: allCrops.filter(c => c.status === 'recommended').length,
    risky: allCrops.filter(c => c.status === 'risky').length,
    not_advised: allCrops.filter(c => c.status === 'not_advised').length,
  });

  const counts = getCounts();

  return (
    <AppLayout 
      title={t('crop_advisor')}
      subtitle="Personalized crop recommendations"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="farm-card-elevated mb-6 bg-gradient-to-br from-primary/10 to-success/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <Sprout className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Should YOU grow this crop?
              </h2>
              <p className="text-muted-foreground text-sm">
                Based on your soil, water, season & schemes
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-success/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-success">{counts.recommended}</p>
              <p className="text-xs text-muted-foreground">{t('recommended')}</p>
            </div>
            <div className="bg-warning/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-warning">{counts.risky}</p>
              <p className="text-xs text-muted-foreground">{t('risky')}</p>
            </div>
            <div className="bg-destructive/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{counts.not_advised}</p>
              <p className="text-xs text-muted-foreground">{t('not_advised')}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 whitespace-nowrap ${
                activeFilter === filter.id ? filter.color : ''
              }`}
              onClick={() => setActiveFilter(filter.id as any)}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label} ({counts[filter.id as keyof typeof counts]})
            </Button>
          ))}
        </div>

        {/* Crop List */}
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredCrops.map((crop, index) => (
            <CropCard key={index} crop={crop} />
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <Sprout className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No crops found for this filter</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CropAdvisor;

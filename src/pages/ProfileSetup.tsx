import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Ruler, Droplets, Mountain, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const indianStates = [
  'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal'
];

const ProfileSetup: React.FC = () => {
  const { t } = useLanguage();
  const { saveProfile } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [landSize, setLandSize] = useState('');
  const [irrigationType, setIrrigationType] = useState('');
  const [soilType, setSoilType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({
      state,
      district,
      landSize,
      irrigationType,
      soilType,
    });
    navigate('/dashboard');
  };

  const irrigationOptions = [
    { value: 'rainfed', icon: '🌧️' },
    { value: 'drip', icon: '💧' },
    { value: 'sprinkler', icon: '🚿' },
    { value: 'canal', icon: '🏞️' },
    { value: 'borewell', icon: '🕳️' },
  ];

  const soilOptions = [
    { value: 'alluvial', icon: '🟤' },
    { value: 'black', icon: '⬛' },
    { value: 'red', icon: '🟥' },
    { value: 'laterite', icon: '🟧' },
    { value: 'sandy', icon: '🟨' },
  ];

  return (
    <div className="min-h-screen hero-gradient flex flex-col px-4 py-8 animate-fade-in">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('setup_profile')}
          </h1>
          <p className="text-muted-foreground">
            {t('setup_subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
          {/* State */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="w-4 h-4" />
              {t('state')}
            </label>
            <Select value={state} onValueChange={setState} required>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((s) => (
                  <SelectItem key={s} value={s} className="text-lg py-3">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="w-4 h-4" />
              {t('district')}
            </label>
            <Input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="h-14 text-lg"
              placeholder="Enter your district"
              required
            />
          </div>

          {/* Land Size */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Ruler className="w-4 h-4" />
              {t('land_size')}
            </label>
            <Input
              type="number"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              className="h-14 text-lg"
              placeholder="e.g., 5"
              required
            />
          </div>

          {/* Irrigation Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Droplets className="w-4 h-4" />
              {t('irrigation_type')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {irrigationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIrrigationType(opt.value)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    irrigationType === opt.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs font-medium">{t(opt.value)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Mountain className="w-4 h-4" />
              {t('soil_type')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {soilOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSoilType(opt.value)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    soilType === opt.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs font-medium">{t(opt.value)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full h-14 text-lg font-semibold mt-8"
            disabled={!state || !district || !landSize || !irrigationType || !soilType}
          >
            {t('save_continue')}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;

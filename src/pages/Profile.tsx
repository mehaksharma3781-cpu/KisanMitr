import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, MapPin, Ruler, Droplets, Mountain, 
  Edit2, Save, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/AppLayout';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    state: profile?.state || '',
    district: profile?.district || '',
    landSize: profile?.landSize || '',
    irrigationType: profile?.irrigationType || '',
    soilType: profile?.soilType || '',
  });

  const irrigationTypes = [
    { id: 'rainfed', icon: '🌧️', label: t('rainfed') },
    { id: 'drip', icon: '💧', label: t('drip') },
    { id: 'sprinkler', icon: '🌊', label: t('sprinkler') },
    { id: 'canal', icon: '🏞️', label: t('canal') },
    { id: 'borewell', icon: '🔧', label: t('borewell') },
  ];

  const soilTypes = [
    { id: 'alluvial', icon: '🏔️', label: t('alluvial') },
    { id: 'black', icon: '⬛', label: t('black') },
    { id: 'red', icon: '🟫', label: t('red') },
    { id: 'laterite', icon: '🟤', label: t('laterite') },
    { id: 'sandy', icon: '🏜️', label: t('sandy') },
  ];

  const handleSave = () => {
    updateProfile({
      state: formData.state,
      district: formData.district,
      landSize: formData.landSize,
      irrigationType: formData.irrigationType,
      soilType: formData.soilType,
    });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your farm profile has been saved successfully.",
    });
  };

  const ProfileField = ({ 
    icon: Icon, 
    label, 
    value 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string;
  }) => (
    <div className="farm-card flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value || 'Not set'}</p>
      </div>
    </div>
  );

  return (
    <AppLayout 
      title={t('profile') || 'Profile'}
      subtitle={t('my_farm') || 'My Farm'}
    >
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="farm-card-elevated mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {t('hello_farmer')}
                </h2>
                <p className="text-muted-foreground">
                  {profile?.district}, {profile?.state}
                </p>
              </div>
            </div>
            <Button
              variant={isEditing ? "destructive" : "outline"}
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('state')}
                </label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('district')}
                </label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Enter district"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('land_size')}
              </label>
              <Input
                type="number"
                value={formData.landSize}
                onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                placeholder="Enter land size in acres"
              />
            </div>

            {/* Irrigation Type Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                {t('irrigation_type')}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {irrigationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, irrigationType: type.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.irrigationType === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <p className="text-xs font-medium">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Soil Type Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                {t('soil_type')}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {soilTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, soilType: type.id })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.soilType === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <p className="text-xs font-medium">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-4">
              <Save className="w-5 h-5 mr-2" />
              {t('save_continue') || 'Save Changes'}
            </Button>
          </div>
        ) : (
          /* View Mode */
          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileField icon={MapPin} label={t('state')} value={profile?.state || ''} />
            <ProfileField icon={MapPin} label={t('district')} value={profile?.district || ''} />
            <ProfileField icon={Ruler} label={t('land_size')} value={profile?.landSize ? `${profile.landSize} Acres` : ''} />
            <ProfileField 
              icon={Droplets} 
              label={t('irrigation_type')} 
              value={irrigationTypes.find(t => t.id === profile?.irrigationType)?.label || ''} 
            />
            <ProfileField 
              icon={Mountain} 
              label={t('soil_type')} 
              value={soilTypes.find(t => t.id === profile?.soilType)?.label || ''} 
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;

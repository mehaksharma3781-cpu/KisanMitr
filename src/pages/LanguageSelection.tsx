import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const languages: { code: Language; name: string; native: string; flag: string }[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
];

const LanguageSelection: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col px-4 py-8 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Globe className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('select_language')}
          </h1>
          <p className="text-muted-foreground">
            Choose your preferred language
          </p>
        </div>

        {/* Language Cards */}
        <div className="w-full space-y-3 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`lang-card w-full ${language === lang.code ? 'selected' : ''}`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{lang.native}</p>
                <p className="text-sm text-muted-foreground">{lang.name}</p>
              </div>
              {language === lang.code && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {t('continue')}
        </Button>
      </div>

      {/* Footer branding */}
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          KrushiAI • Empowering Indian Farmers
        </p>
      </div>
    </div>
  );
};

export default LanguageSelection;

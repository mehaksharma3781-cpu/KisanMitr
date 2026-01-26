import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CloudRain, AlertTriangle, Thermometer, Wind } from 'lucide-react';

const WeatherAlert: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="farm-card bg-accent/10 border-accent/30 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
          <CloudRain className="w-6 h-6 text-accent" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="font-bold text-foreground">{t('weather_alert')}</h3>
          </div>
          <p className="text-sm text-foreground mb-3">
            {t('rainfall_warning')} - Next 3 days
          </p>

          {/* Weather Details */}
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Thermometer className="w-4 h-4" />
              <span>28°C</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CloudRain className="w-4 h-4" />
              <span>85%</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wind className="w-4 h-4" />
              <span>12 km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between">
          {['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'].map((day, index) => (
            <div key={day} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{day}</p>
              <span className="text-xl">
                {index < 3 ? '🌧️' : index === 3 ? '⛅' : '☀️'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherAlert;

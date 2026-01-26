import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Cloud, Sun, CloudRain, Wind, Droplets, 
  Thermometer, AlertTriangle, Calendar
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';

const Weather: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile } = useAuth();

  const currentWeather = {
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 12,
    rainfall: 0,
  };

  const forecast = [
    { day: 'Today', temp: 28, icon: Sun, condition: 'Sunny' },
    { day: 'Tomorrow', temp: 26, icon: CloudRain, condition: 'Rain' },
    { day: 'Wed', temp: 24, icon: CloudRain, condition: 'Heavy Rain' },
    { day: 'Thu', temp: 25, icon: Cloud, condition: 'Cloudy' },
    { day: 'Fri', temp: 27, icon: Sun, condition: 'Sunny' },
    { day: 'Sat', temp: 29, icon: Sun, condition: 'Hot' },
    { day: 'Sun', temp: 28, icon: Cloud, condition: 'Cloudy' },
  ];

  const alerts = [
    {
      type: 'warning',
      title: language === 'hi' ? 'भारी वर्षा की चेतावनी' : 'Heavy Rainfall Warning',
      description: language === 'hi' 
        ? 'अगले 48 घंटों में 50-80mm बारिश की संभावना। फसल कटाई जल्दी करें।'
        : 'Expected 50-80mm rainfall in next 48 hours. Complete harvesting quickly.',
      action: language === 'hi' ? 'जल निकासी की व्यवस्था करें' : 'Ensure proper drainage',
    },
    {
      type: 'info',
      title: language === 'hi' ? 'बुवाई का समय' : 'Sowing Advisory',
      description: language === 'hi'
        ? 'गेहूं की बुवाई के लिए अनुकूल समय। मिट्टी में नमी पर्याप्त है।'
        : 'Favorable time for wheat sowing. Soil moisture is adequate.',
      action: language === 'hi' ? 'बुवाई शुरू करें' : 'Begin sowing',
    },
  ];

  return (
    <AppLayout 
      title={t('weather')}
      subtitle={profile?.district || 'Your Location'}
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Current Weather */}
        <div className="farm-card-elevated mb-6 bg-gradient-to-br from-accent/20 to-primary/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground text-sm mb-1">
                {language === 'hi' ? 'अभी का मौसम' : 'Current Weather'}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-foreground">{currentWeather.temp}°</span>
                <span className="text-lg text-muted-foreground mb-1">C</span>
              </div>
              <p className="text-muted-foreground">{currentWeather.condition}</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <Sun className="w-12 h-12 text-secondary" />
            </div>
          </div>

          {/* Weather Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <Droplets className="w-6 h-6 mx-auto text-accent mb-1" />
              <p className="text-sm font-semibold">{currentWeather.humidity}%</p>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'नमी' : 'Humidity'}
              </p>
            </div>
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <Wind className="w-6 h-6 mx-auto text-accent mb-1" />
              <p className="text-sm font-semibold">{currentWeather.wind} km/h</p>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'हवा' : 'Wind'}
              </p>
            </div>
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <CloudRain className="w-6 h-6 mx-auto text-accent mb-1" />
              <p className="text-sm font-semibold">{currentWeather.rainfall} mm</p>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'वर्षा' : 'Rain'}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="space-y-3 mb-6">
          {alerts.map((alert, index) => (
            <div 
              key={index}
              className={`farm-card border-l-4 ${
                alert.type === 'warning' ? 'border-l-warning bg-warning/5' : 'border-l-accent bg-accent/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
                  alert.type === 'warning' ? 'text-warning' : 'text-accent'
                }`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <p className="text-sm font-medium text-primary">
                    👉 {alert.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 7-Day Forecast */}
        <div className="farm-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'hi' ? '7 दिन का पूर्वानुमान' : '7-Day Forecast'}
            </h3>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-3 min-w-max pb-2">
              {forecast.map((day, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-xl min-w-[70px] ${
                    index === 0 ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                  }`}
                >
                  <p className={`text-xs font-medium mb-2 ${
                    index === 0 ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {day.day}
                  </p>
                  <day.icon className={`w-8 h-8 mb-2 ${
                    day.condition.includes('Rain') ? 'text-accent' : 'text-secondary'
                  }`} />
                  <p className="font-bold text-foreground">{day.temp}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Farming Tips */}
        <div className="farm-card mt-6 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            {language === 'hi' ? 'खेती सलाह' : 'Farming Tips'}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {language === 'hi' 
                ? 'बारिश के बाद कीटनाशक न छिड़कें'
                : 'Avoid pesticide spraying after rain'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {language === 'hi'
                ? 'जल निकासी नालियां साफ रखें'
                : 'Keep drainage channels clean'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {language === 'hi'
                ? 'फसल बीमा का दावा समय पर करें'
                : 'File crop insurance claims on time'}
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default Weather;

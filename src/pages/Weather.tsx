import React, { useMemo, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Cloud, Sun, CloudRain, Wind, Droplets,
  Thermometer, AlertTriangle, Calendar, Loader2, CloudSun,
  RefreshCw, Sprout
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { getCropRecommendations, CropRecommendation } from '@/utils/cropAdvisory';

const Weather: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile } = useAuth();

  const location = profile?.district || 'Delhi, India';
  const { weather, loading, error, refetch } = useWeather(location);

  const getWeatherIcon = (condition: string) => {
    const lc = condition.toLowerCase();
    if (lc.includes('rain') || lc.includes('drizzle')) return CloudRain;
    if (lc.includes('cloud') || lc.includes('overcast')) return Cloud;
    if (lc.includes('partly')) return CloudSun;
    return Sun;
  };

  const forecast = useMemo(() => {
    if (!weather?.forecast) return [];
    return weather.forecast.slice(0, 5).map((day, index) => {
      const date = new Date(day.date + 'T00:00:00');
      const dayLabel = index === 0
        ? (language === 'hi' ? 'आज' : 'Today')
        : index === 1
          ? (language === 'hi' ? 'कल' : 'Tomorrow')
          : date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en', { weekday: 'short' });
      return {
        day: dayLabel,
        temp: Math.round(day.avgtemp_c),
        icon: getWeatherIcon(day.condition),
        condition: day.condition,
        chanceOfRain: day.daily_chance_of_rain,
      };
    });
  }, [weather, language]);

  const alerts = useMemo(() => {
    if (!weather) return [];
    const result: Array<{ type: 'warning' | 'info'; title: string; description: string; action: string }> = [];

    const rainyDays = weather.forecast.filter(d => d.daily_chance_of_rain > 60);
    if (rainyDays.length > 0) {
      const totalRain = rainyDays.reduce((s, d) => s + d.totalprecip_mm, 0);
      result.push({
        type: 'warning',
        title: language === 'hi' ? 'वर्षा की चेतावनी' : 'Rainfall Alert',
        description: language === 'hi'
          ? `अगले ${rainyDays.length} दिनों में ${Math.round(totalRain)}mm बारिश की संभावना।`
          : `Expected ${Math.round(totalRain)}mm rainfall in the next ${rainyDays.length} days.`,
        action: language === 'hi' ? 'जल निकासी की व्यवस्था करें' : 'Ensure proper drainage',
      });
    }

    weather.alerts.forEach(alert => {
      result.push({
        type: 'warning',
        title: alert.headline || alert.event,
        description: alert.desc?.substring(0, 200) || '',
        action: language === 'hi' ? 'सावधान रहें' : 'Stay alert',
      });
    });

    return result;
  }, [weather, language]);

  const cropRecommendations = useMemo(() => {
    if (!weather) return [];
    return getCropRecommendations(weather);
  }, [weather]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <AppLayout title={t('weather')} subtitle={location}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error || !weather) {
    return (
      <AppLayout title={t('weather')} subtitle={location}>
        <div className="px-4 py-6 text-center">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">
            {language === 'hi' ? 'मौसम डेटा लोड नहीं हो सका' : 'Failed to load weather data'}
          </p>
          {error && <p className="text-sm text-muted-foreground mb-4">{error}</p>}
          <Button onClick={handleRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </Button>
        </div>
      </AppLayout>
    );
  }

  const CurrentIcon = getWeatherIcon(weather.current.condition);
  const avgRainChance = weather.forecast.length > 0
    ? Math.round(weather.forecast.reduce((s, d) => s + d.daily_chance_of_rain, 0) / weather.forecast.length)
    : 0;

  return (
    <AppLayout title={t('weather')} subtitle={weather.location.name}>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Current Weather */}
        <div className="farm-card-elevated mb-6 bg-gradient-to-br from-accent/20 to-primary/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground text-sm mb-1">
                {language === 'hi' ? 'अभी का मौसम' : 'Current Weather'}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-foreground">{Math.round(weather.current.temp_c)}°</span>
                <span className="text-lg text-muted-foreground mb-1">C</span>
              </div>
              <p className="text-muted-foreground">{weather.current.condition}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'hi' ? 'महसूस होता है' : 'Feels like'} {Math.round(weather.current.feelslike_c)}°C
              </p>
            </div>
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <CurrentIcon className="w-12 h-12 text-secondary" />
            </div>
          </div>

          {/* Weather Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <Droplets className="w-5 h-5 mx-auto text-accent mb-1" />
              <p className="text-sm font-semibold">{weather.current.humidity}%</p>
              <p className="text-xs text-muted-foreground">{language === 'hi' ? 'नमी' : 'Humidity'}</p>
            </div>
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <Wind className="w-5 h-5 mx-auto text-accent mb-1" />
              <p className="text-sm font-semibold">{Math.round(weather.current.wind_kph)} km/h</p>
              <p className="text-xs text-muted-foreground">{language === 'hi' ? 'हवा' : 'Wind'}</p>
            </div>
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <CloudRain className="w-5 h-5 mx-auto text-accent mb-1" />
              <p className="text-sm font-semibold">{weather.current.precip_mm} mm</p>
              <p className="text-xs text-muted-foreground">{language === 'hi' ? 'वर्षा' : 'Rain'}</p>
            </div>
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <CloudRain className="w-5 h-5 mx-auto text-accent mb-1" />
              <p className="text-sm font-semibold">{avgRainChance}%</p>
              <p className="text-xs text-muted-foreground">{language === 'hi' ? 'बारिश संभावना' : 'Rain %'}</p>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
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
                    <p className="text-sm font-medium text-primary">👉 {alert.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5-Day Forecast */}
        <div className="farm-card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'hi' ? '5 दिन का पूर्वानुमान' : '5-Day Forecast'}
            </h3>
          </div>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-3 min-w-max pb-2">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] ${
                    index === 0 ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                  }`}
                >
                  <p className={`text-xs font-medium mb-2 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {day.day}
                  </p>
                  <day.icon className={`w-8 h-8 mb-2 ${
                    day.condition.toLowerCase().includes('rain') ? 'text-accent' : 'text-secondary'
                  }`} />
                  <p className="font-bold text-foreground">{day.temp}°</p>
                  <p className="text-xs text-muted-foreground mt-1">🌧 {day.chanceOfRain}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crop Advisory */}
        <div className="farm-card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              🌱 {language === 'hi' ? 'मौसम आधारित फसल सलाह (लाइव डेटा)' : 'Weather-Based Crop Advisory (Live Data)'}
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {cropRecommendations.map((crop) => (
              <CropAdvisoryCard key={crop.name} crop={crop} language={language} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          {language === 'hi'
            ? 'सभी सिफारिशें लाइव मौसम डेटा और अल्पकालिक पूर्वानुमानों का उपयोग करके तैयार की गई हैं।'
            : 'All recommendations are generated using live weather data and short-term forecasts.'}
        </p>
      </div>
    </AppLayout>
  );
};

function CropAdvisoryCard({ crop, language }: { crop: CropRecommendation; language: string }) {
  const colorClass = crop.level === 'high'
    ? 'border-l-success bg-success/5'
    : crop.level === 'medium'
      ? 'border-l-warning bg-warning/5'
      : 'border-l-destructive bg-destructive/5';

  const badgeClass = crop.level === 'high'
    ? 'bg-success/20 text-success'
    : crop.level === 'medium'
      ? 'bg-warning/20 text-warning'
      : 'bg-destructive/20 text-destructive';

  const levelLabel = crop.level === 'high'
    ? (language === 'hi' ? 'उच्च' : 'High')
    : crop.level === 'medium'
      ? (language === 'hi' ? 'मध्यम' : 'Medium')
      : (language === 'hi' ? 'कम' : 'Low');

  return (
    <div className={`farm-card border-l-4 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-foreground">
          {language === 'hi' ? crop.nameHi : crop.name}
        </h4>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {crop.suitability}% — {levelLabel}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-1">
        {language === 'hi' ? crop.reasonHi : crop.reason}
      </p>
      <p className="text-xs text-primary font-medium">
        💡 {language === 'hi' ? crop.adviceHi : crop.advice}
      </p>
    </div>
  );
}

export default Weather;

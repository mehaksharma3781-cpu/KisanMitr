 import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
 import { 
   Cloud, Sun, CloudRain, Wind, Droplets, 
   Thermometer, AlertTriangle, Calendar, Loader2, CloudSun
 } from 'lucide-react';
 import AppLayout from '@/components/AppLayout';
 import { useWeather } from '@/hooks/useWeather';

const Weather: React.FC = () => {
   const { t, language } = useLanguage();
   const { profile } = useAuth();
 
   // Use profile district or default to a location
   const location = profile?.district || 'Delhi, India';
   const { weather, loading, error } = useWeather(location);
 
   // Get appropriate icon based on condition
   const getWeatherIcon = (condition: string) => {
     const lowerCondition = condition.toLowerCase();
     if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
       return CloudRain;
     } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
       return Cloud;
     } else if (lowerCondition.includes('partly')) {
       return CloudSun;
     }
     return Sun;
   };
 
   // Format forecast data
   const forecast = useMemo(() => {
     if (!weather?.forecast) return [];
     
     const dayNames = language === 'hi' 
       ? ['आज', 'कल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि']
       : ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
     
     return weather.forecast.map((day, index) => ({
       day: dayNames[index] || new Date(day.date).toLocaleDateString('en', { weekday: 'short' }),
       temp: Math.round(day.avgtemp_c),
       icon: getWeatherIcon(day.condition),
       condition: day.condition,
       chanceOfRain: day.daily_chance_of_rain,
     }));
   }, [weather, language]);
 
   // Generate farming alerts based on weather conditions
   const alerts = useMemo(() => {
     const generatedAlerts: Array<{ type: 'warning' | 'info'; title: string; description: string; action: string }> = [];
     
     if (!weather) return generatedAlerts;
 
     // Check for rain in next few days
     const rainyDays = weather.forecast.filter(day => day.daily_chance_of_rain > 60);
     if (rainyDays.length > 0) {
       const totalRain = rainyDays.reduce((sum, day) => sum + day.totalprecip_mm, 0);
       generatedAlerts.push({
         type: 'warning',
         title: language === 'hi' ? 'वर्षा की चेतावनी' : 'Rainfall Alert',
         description: language === 'hi'
           ? `अगले ${rainyDays.length} दिनों में ${Math.round(totalRain)}mm बारिश की संभावना।`
           : `Expected ${Math.round(totalRain)}mm rainfall in the next ${rainyDays.length} days.`,
         action: language === 'hi' ? 'जल निकासी की व्यवस्था करें' : 'Ensure proper drainage',
       });
     }
 
     // Add weather API alerts
     weather.alerts.forEach((alert) => {
       generatedAlerts.push({
         type: 'warning',
         title: alert.headline || alert.event,
         description: alert.desc?.substring(0, 200) || '',
         action: language === 'hi' ? 'सावधान रहें' : 'Stay alert',
       });
     });
 
     // Add sowing advisory if conditions are good
     if (weather.current.humidity > 50 && weather.current.humidity < 80 && rainyDays.length === 0) {
       generatedAlerts.push({
         type: 'info',
         title: language === 'hi' ? 'बुवाई के लिए अनुकूल' : 'Good for Sowing',
         description: language === 'hi'
           ? 'मौसम अनुकूल है। मिट्टी में नमी पर्याप्त है।'
           : 'Weather conditions are favorable. Soil moisture is adequate.',
         action: language === 'hi' ? 'बुवाई शुरू करें' : 'Begin sowing',
       });
     }
 
     return generatedAlerts;
   }, [weather, language]);
 
   if (loading) {
     return (
       <AppLayout title={t('weather')} subtitle={location}>
         <div className="flex items-center justify-center min-h-[400px]">
           <Loader2 className="w-8 h-8 animate-spin text-primary" />
         </div>
       </AppLayout>
     );
   }
 
   if (error) {
     return (
       <AppLayout title={t('weather')} subtitle={location}>
         <div className="px-4 py-6 text-center">
           <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
           <p className="text-muted-foreground">{language === 'hi' ? 'मौसम डेटा लोड नहीं हो सका' : 'Failed to load weather data'}</p>
           <p className="text-sm text-muted-foreground mt-2">{error}</p>
         </div>
       </AppLayout>
     );
   }
 
   const CurrentIcon = weather ? getWeatherIcon(weather.current.condition) : Sun;

  return (
    <AppLayout 
      title={t('weather')}
       subtitle={weather?.location.name || location}
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
                 <span className="text-5xl font-bold text-foreground">{weather ? Math.round(weather.current.temp_c) : '--'}°</span>
                <span className="text-lg text-muted-foreground mb-1">C</span>
              </div>
               <p className="text-muted-foreground">{weather?.current.condition || '--'}</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
               <CurrentIcon className="w-12 h-12 text-secondary" />
            </div>
          </div>

          {/* Weather Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <Droplets className="w-6 h-6 mx-auto text-accent mb-1" />
               <p className="text-sm font-semibold">{weather?.current.humidity ?? '--'}%</p>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'नमी' : 'Humidity'}
              </p>
            </div>
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <Wind className="w-6 h-6 mx-auto text-accent mb-1" />
               <p className="text-sm font-semibold">{weather ? Math.round(weather.current.wind_kph) : '--'} km/h</p>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'हवा' : 'Wind'}
              </p>
            </div>
            <div className="bg-card/50 rounded-xl p-3 text-center">
              <CloudRain className="w-6 h-6 mx-auto text-accent mb-1" />
               <p className="text-sm font-semibold">{weather?.current.precip_mm ?? 0} mm</p>
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

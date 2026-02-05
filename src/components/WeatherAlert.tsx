 import React from 'react';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useAuth } from '@/contexts/AuthContext';
 import { CloudRain, AlertTriangle, Thermometer, Wind, Loader2 } from 'lucide-react';
 import { useWeather } from '@/hooks/useWeather';

 const WeatherAlert: React.FC = () => {
   const { t, language } = useLanguage();
   const { profile } = useAuth();
   
   const location = profile?.district || 'Delhi, India';
   const { weather, loading, error } = useWeather(location);
 
   if (loading) {
     return (
       <div className="farm-card bg-accent/10 border-accent/30 animate-fade-in">
         <div className="flex items-center justify-center py-4">
           <Loader2 className="w-6 h-6 animate-spin text-accent" />
         </div>
       </div>
     );
   }
 
   if (error || !weather) {
     return null; // Hide widget on error
   }
 
   // Check if there's significant rain expected
   const rainyDays = weather.forecast.filter(day => day.daily_chance_of_rain > 50);
   const hasRainAlert = rainyDays.length > 0;

   return (
     <div className={`farm-card animate-fade-in ${hasRainAlert ? 'bg-accent/10 border-accent/30' : 'bg-primary/5 border-primary/20'}`}>
      <div className="flex items-start gap-3">
         <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${hasRainAlert ? 'bg-accent/20' : 'bg-primary/10'}`}>
           <CloudRain className={`w-6 h-6 ${hasRainAlert ? 'text-accent' : 'text-primary'}`} />
         </div>
        
        <div className="flex-1">
           <div className="flex items-center gap-2 mb-1">
             {hasRainAlert && <AlertTriangle className="w-4 h-4 text-warning" />}
             <h3 className="font-bold text-foreground">
               {hasRainAlert 
                 ? (language === 'hi' ? 'वर्षा की चेतावनी' : 'Rain Alert')
                 : (language === 'hi' ? 'मौसम अपडेट' : 'Weather Update')
               }
             </h3>
           </div>
           <p className="text-sm text-foreground mb-3">
             {weather.current.condition} - {Math.round(weather.current.temp_c)}°C
           </p>

          {/* Weather Details */}
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Thermometer className="w-4 h-4" />
               <span>{Math.round(weather.current.temp_c)}°C</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CloudRain className="w-4 h-4" />
               <span>{weather.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wind className="w-4 h-4" />
               <span>{Math.round(weather.current.wind_kph)} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between">
           {weather.forecast.slice(0, 5).map((day, index) => {
             const dayNames = language === 'hi' 
               ? ['आज', 'कल', 'बुध', 'गुरु', 'शुक्र']
               : ['Today', 'Tmrw', 'Wed', 'Thu', 'Fri'];
             const emoji = day.daily_chance_of_rain > 50 
               ? '🌧️' 
               : day.condition.toLowerCase().includes('cloud') 
                 ? '⛅' 
                 : '☀️';
             return (
               <div key={day.date} className="text-center">
                 <p className="text-xs text-muted-foreground mb-1">
                   {dayNames[index] || new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                 </p>
                 <span className="text-xl">{emoji}</span>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default WeatherAlert;

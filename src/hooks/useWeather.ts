 import { useState, useEffect } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 
 export interface WeatherData {
   location: {
     name: string;
     region: string;
     country: string;
   };
   current: {
     temp_c: number;
     condition: string;
     condition_icon: string;
     humidity: number;
     wind_kph: number;
     precip_mm: number;
     feelslike_c: number;
     uv: number;
   };
   forecast: Array<{
     date: string;
     maxtemp_c: number;
     mintemp_c: number;
     avgtemp_c: number;
     condition: string;
     condition_icon: string;
     daily_chance_of_rain: number;
     totalprecip_mm: number;
   }>;
   alerts: Array<{
     headline: string;
     event: string;
     desc: string;
   }>;
 }
 
 export function useWeather(location: string) {
   const [weather, setWeather] = useState<WeatherData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   useEffect(() => {
     async function fetchWeather() {
       if (!location) {
         setLoading(false);
         return;
       }
 
       setLoading(true);
       setError(null);
 
       try {
         const { data, error: fnError } = await supabase.functions.invoke('get-weather', {
           body: { location, days: 7 },
         });
 
         if (fnError) {
           throw new Error(fnError.message);
         }
 
         if (data.error) {
           throw new Error(data.error);
         }
 
         setWeather(data);
       } catch (err) {
         console.error('Weather fetch error:', err);
         setError(err instanceof Error ? err.message : 'Failed to fetch weather');
       } finally {
         setLoading(false);
       }
     }
 
     fetchWeather();
   }, [location]);
 
   return { weather, loading, error, refetch: () => setWeather(null) };
 }
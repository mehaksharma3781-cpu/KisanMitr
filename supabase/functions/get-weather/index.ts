 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};
 
 interface WeatherRequest {
   location: string;
   days?: number;
 }
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const apiKey = Deno.env.get('WEATHER_API_KEY');
     if (!apiKey) {
       throw new Error('WEATHER_API_KEY is not configured');
     }
 
     const { location, days = 7 }: WeatherRequest = await req.json();
     
     if (!location) {
       throw new Error('Location is required');
     }
 
     // Fetch weather data from WeatherAPI.com
     const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=${days}&aqi=no&alerts=yes`;
     
     const response = await fetch(weatherUrl);
     
     if (!response.ok) {
       const errorData = await response.text();
       console.error('WeatherAPI error:', errorData);
       throw new Error(`WeatherAPI request failed: ${response.status}`);
     }
 
     const weatherData = await response.json();
 
     // Transform the response to a cleaner format
     const result = {
       location: {
         name: weatherData.location.name,
         region: weatherData.location.region,
         country: weatherData.location.country,
       },
       current: {
         temp_c: weatherData.current.temp_c,
         condition: weatherData.current.condition.text,
         condition_icon: weatherData.current.condition.icon,
         humidity: weatherData.current.humidity,
         wind_kph: weatherData.current.wind_kph,
         precip_mm: weatherData.current.precip_mm,
         feelslike_c: weatherData.current.feelslike_c,
         uv: weatherData.current.uv,
       },
       forecast: weatherData.forecast.forecastday.map((day: any) => ({
         date: day.date,
         maxtemp_c: day.day.maxtemp_c,
         mintemp_c: day.day.mintemp_c,
         avgtemp_c: day.day.avgtemp_c,
         condition: day.day.condition.text,
         condition_icon: day.day.condition.icon,
         daily_chance_of_rain: day.day.daily_chance_of_rain,
         totalprecip_mm: day.day.totalprecip_mm,
       })),
       alerts: weatherData.alerts?.alert || [],
     };
 
     return new Response(JSON.stringify(result), {
       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
     });
   } catch (error: unknown) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     console.error('Weather function error:', errorMessage);
     return new Response(
       JSON.stringify({ error: errorMessage }),
       { 
         status: 500,
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       }
     );
   }
 });
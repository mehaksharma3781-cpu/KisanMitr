import { WeatherData } from '@/hooks/useWeather';

export interface CropRecommendation {
  name: string;
  nameHi: string;
  suitability: number; // percentage
  level: 'high' | 'medium' | 'low';
  reason: string;
  reasonHi: string;
  advice: string;
  adviceHi: string;
}

interface CropProfile {
  name: string;
  nameHi: string;
  idealTempMin: number;
  idealTempMax: number;
  idealHumidityMin: number;
  idealHumidityMax: number;
  rainTolerance: 'high' | 'medium' | 'low'; // how much rain is ok
  reasonEn: string;
  reasonHi: string;
  adviceEn: string;
  adviceHi: string;
}

const CROP_PROFILES: CropProfile[] = [
  {
    name: 'Rice', nameHi: 'धान',
    idealTempMin: 20, idealTempMax: 37,
    idealHumidityMin: 60, idealHumidityMax: 95,
    rainTolerance: 'high',
    reasonEn: 'Thrives in warm, humid conditions with good rainfall.',
    reasonHi: 'गर्म, नम मौसम और अच्छी बारिश में अच्छा उगता है।',
    adviceEn: 'Ensure waterlogged paddy fields. Monitor for pest attacks after rain.',
    adviceHi: 'खेत में पानी भरा रखें। बारिश के बाद कीटों पर नज़र रखें।',
  },
  {
    name: 'Wheat', nameHi: 'गेहूं',
    idealTempMin: 10, idealTempMax: 25,
    idealHumidityMin: 30, idealHumidityMax: 70,
    rainTolerance: 'low',
    reasonEn: 'Best in cool, dry conditions with moderate moisture.',
    reasonHi: 'ठंडे, शुष्क मौसम में मध्यम नमी के साथ सबसे अच्छा।',
    adviceEn: 'Irrigate at crown root stage. Avoid excess water.',
    adviceHi: 'जड़ों की अवस्था में सिंचाई करें। अधिक पानी से बचें।',
  },
  {
    name: 'Maize', nameHi: 'मक्का',
    idealTempMin: 18, idealTempMax: 32,
    idealHumidityMin: 40, idealHumidityMax: 80,
    rainTolerance: 'medium',
    reasonEn: 'Grows well in warm weather with moderate rainfall.',
    reasonHi: 'गर्म मौसम और मध्यम बारिश में अच्छा उगता है।',
    adviceEn: 'Provide adequate drainage. Apply nitrogen fertilizer at knee-high stage.',
    adviceHi: 'अच्छी जल निकासी रखें। घुटने की ऊंचाई पर नाइट्रोजन डालें।',
  },
  {
    name: 'Mustard', nameHi: 'सरसों',
    idealTempMin: 10, idealTempMax: 25,
    idealHumidityMin: 30, idealHumidityMax: 60,
    rainTolerance: 'low',
    reasonEn: 'Prefers cool, dry weather with low humidity.',
    reasonHi: 'ठंडे, शुष्क मौसम और कम नमी में अच्छा होता है।',
    adviceEn: 'Irrigate at flowering stage. Watch for aphid attacks.',
    adviceHi: 'फूल आने पर सिंचाई करें। माहू कीट पर नज़र रखें।',
  },
  {
    name: 'Pulses', nameHi: 'दालें',
    idealTempMin: 15, idealTempMax: 30,
    idealHumidityMin: 40, idealHumidityMax: 70,
    rainTolerance: 'medium',
    reasonEn: 'Suitable for moderate temperature and humidity.',
    reasonHi: 'मध्यम तापमान और नमी के लिए उपयुक्त।',
    adviceEn: 'Use Rhizobium culture for seed treatment. Minimal irrigation needed.',
    adviceHi: 'बीज उपचार के लिए राइज़ोबियम का उपयोग करें। कम सिंचाई की जरूरत।',
  },
  {
    name: 'Seasonal Vegetables', nameHi: 'मौसमी सब्ज़ियाँ',
    idealTempMin: 15, idealTempMax: 35,
    idealHumidityMin: 50, idealHumidityMax: 85,
    rainTolerance: 'medium',
    reasonEn: 'Versatile crops that adapt to various conditions.',
    reasonHi: 'विभिन्न मौसम में उगने वाली फसलें।',
    adviceEn: 'Use raised beds for drainage. Apply organic compost regularly.',
    adviceHi: 'जल निकासी के लिए ऊँची क्यारियाँ बनाएं। जैविक खाद नियमित डालें।',
  },
];

function calcTempScore(temp: number, min: number, max: number): number {
  if (temp >= min && temp <= max) return 1;
  const distance = temp < min ? min - temp : temp - max;
  return Math.max(0, 1 - distance / 15);
}

function calcHumidityScore(humidity: number, min: number, max: number): number {
  if (humidity >= min && humidity <= max) return 1;
  const distance = humidity < min ? min - humidity : humidity - max;
  return Math.max(0, 1 - distance / 30);
}

function calcRainScore(rainChance: number, tolerance: 'high' | 'medium' | 'low'): number {
  if (tolerance === 'high') return rainChance > 30 ? 1 : 0.7;
  if (tolerance === 'medium') return rainChance > 70 ? 0.5 : rainChance > 30 ? 1 : 0.8;
  return rainChance > 60 ? 0.3 : rainChance > 30 ? 0.7 : 1;
}

export function getCropRecommendations(weather: WeatherData): CropRecommendation[] {
  const temp = weather.current.temp_c;
  const humidity = weather.current.humidity;
  const avgRainChance = weather.forecast.length > 0
    ? weather.forecast.reduce((sum, d) => sum + d.daily_chance_of_rain, 0) / weather.forecast.length
    : 0;

  return CROP_PROFILES.map(crop => {
    const tempScore = calcTempScore(temp, crop.idealTempMin, crop.idealTempMax);
    const humidityScore = calcHumidityScore(humidity, crop.idealHumidityMin, crop.idealHumidityMax);
    const rainScore = calcRainScore(avgRainChance, crop.rainTolerance);

    const raw = (tempScore * 0.4 + humidityScore * 0.3 + rainScore * 0.3) * 90;
    const suitability = Math.round(Math.min(90, Math.max(10, raw)));
    const level: 'high' | 'medium' | 'low' = suitability >= 75 ? 'high' : suitability >= 50 ? 'medium' : 'low';

    return {
      name: crop.name,
      nameHi: crop.nameHi,
      suitability,
      level,
      reason: crop.reasonEn,
      reasonHi: crop.reasonHi,
      advice: crop.adviceEn,
      adviceHi: crop.adviceHi,
    };
  }).sort((a, b) => b.suitability - a.suitability);
}

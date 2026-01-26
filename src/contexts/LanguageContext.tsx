import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Language selection
    'select_language': 'Select Your Language',
    'continue': 'Continue',
    
    // Login
    'welcome_back': 'Welcome Back',
    'login_subtitle': 'Sign in to access your farm assistant',
    'email': 'Email Address',
    'password': 'Password',
    'login': 'Login',
    'demo_section': 'Demo Login',
    'demo_email': 'Demo Email',
    'demo_password': 'Demo Password',
    'demo_helper': 'Use demo credentials to explore the prototype',
    
    // Profile setup
    'setup_profile': 'Setup Your Farm Profile',
    'setup_subtitle': 'Help us understand your farm better',
    'state': 'State',
    'district': 'District',
    'land_size': 'Land Size (Acres)',
    'irrigation_type': 'Irrigation Type',
    'soil_type': 'Soil Type',
    'save_continue': 'Save & Continue',
    
    // Irrigation options
    'rainfed': 'Rainfed',
    'drip': 'Drip Irrigation',
    'sprinkler': 'Sprinkler',
    'canal': 'Canal',
    'borewell': 'Borewell',
    
    // Soil options
    'alluvial': 'Alluvial',
    'black': 'Black Soil',
    'red': 'Red Soil',
    'laterite': 'Laterite',
    'sandy': 'Sandy',
    
    // Dashboard
    'hello_farmer': 'Hello, Farmer!',
    'dashboard_subtitle': 'What would you like to do today?',
    'crop_advisor': 'Crop Advisor',
    'schemes': 'Government Schemes',
    'weather': 'Weather',
    'community': 'Community',
    'my_farm': 'My Farm',
    'track_progress': 'Track Progress',
    
    // Crop recommendations
    'recommended': 'Recommended',
    'risky': 'Risky',
    'not_advised': 'Not Advised',
    'subsidy_available': 'Subsidy Available',
    'insurance_available': 'Insurance Available',
    'msp_support': 'MSP Support',
    
    // Scheme status
    'ready_apply': 'Ready to Apply',
    'missing_docs': 'Missing Documents',
    'not_eligible': 'Not Eligible',
    
    // AI Assistant
    'ai_assistant': 'Gemini AI Assistant',
    'ai_prototype': '(Prototype / Demo Mode)',
    'ask_anything': 'Ask me anything about farming...',
    'tap_speak': 'Tap to speak',
    'listening': 'Listening...',
    
    // Weather
    'weather_alert': 'Weather Alert',
    'rainfall_warning': 'Heavy Rainfall Expected',
    'drought_risk': 'Drought Risk',
    
    // Actions
    'view_details': 'View Details',
    'apply_now': 'Apply Now',
    'learn_more': 'Learn More',
    'home': 'Home',
    'profile': 'Profile',
    'logout': 'Logout',
  },
  hi: {
    'select_language': 'अपनी भाषा चुनें',
    'continue': 'जारी रखें',
    'welcome_back': 'वापस स्वागत है',
    'login_subtitle': 'अपने खेत सहायक तक पहुंचने के लिए साइन इन करें',
    'email': 'ईमेल पता',
    'password': 'पासवर्ड',
    'login': 'लॉगिन',
    'demo_section': 'डेमो लॉगिन',
    'demo_email': 'डेमो ईमेल',
    'demo_password': 'डेमो पासवर्ड',
    'demo_helper': 'प्रोटोटाइप देखने के लिए डेमो क्रेडेंशियल्स का उपयोग करें',
    'setup_profile': 'अपना खेत प्रोफ़ाइल सेटअप करें',
    'setup_subtitle': 'हमें आपके खेत को बेहतर समझने में मदद करें',
    'state': 'राज्य',
    'district': 'जिला',
    'land_size': 'भूमि का आकार (एकड़)',
    'irrigation_type': 'सिंचाई का प्रकार',
    'soil_type': 'मिट्टी का प्रकार',
    'save_continue': 'सहेजें और जारी रखें',
    'rainfed': 'वर्षा आधारित',
    'drip': 'ड्रिप सिंचाई',
    'sprinkler': 'स्प्रिंकलर',
    'canal': 'नहर',
    'borewell': 'बोरवेल',
    'alluvial': 'जलोढ़',
    'black': 'काली मिट्टी',
    'red': 'लाल मिट्टी',
    'laterite': 'लेटराइट',
    'sandy': 'रेतीली',
    'hello_farmer': 'नमस्ते, किसान!',
    'dashboard_subtitle': 'आज आप क्या करना चाहेंगे?',
    'crop_advisor': 'फसल सलाहकार',
    'schemes': 'सरकारी योजनाएं',
    'weather': 'मौसम',
    'community': 'समुदाय',
    'my_farm': 'मेरा खेत',
    'track_progress': 'प्रगति ट्रैक करें',
    'recommended': 'अनुशंसित',
    'risky': 'जोखिम भरा',
    'not_advised': 'सलाह नहीं',
    'subsidy_available': 'सब्सिडी उपलब्ध',
    'insurance_available': 'बीमा उपलब्ध',
    'msp_support': 'MSP सहायता',
    'ready_apply': 'आवेदन के लिए तैयार',
    'missing_docs': 'दस्तावेज़ गायब',
    'not_eligible': 'पात्र नहीं',
    'ai_assistant': 'जेमिनी AI सहायक',
    'ai_prototype': '(प्रोटोटाइप / डेमो मोड)',
    'ask_anything': 'खेती के बारे में कुछ भी पूछें...',
    'tap_speak': 'बोलने के लिए टैप करें',
    'listening': 'सुन रहा हूं...',
    'weather_alert': 'मौसम चेतावनी',
    'rainfall_warning': 'भारी वर्षा की संभावना',
    'drought_risk': 'सूखे का खतरा',
    'view_details': 'विवरण देखें',
    'apply_now': 'अभी आवेदन करें',
    'learn_more': 'और जानें',
    'home': 'होम',
    'profile': 'प्रोफ़ाइल',
    'logout': 'लॉगआउट',
  },
  mr: {
    'select_language': 'तुमची भाषा निवडा',
    'continue': 'पुढे चला',
    'welcome_back': 'पुन्हा स्वागत',
    'login_subtitle': 'तुमच्या शेत सहाय्यकात प्रवेश करा',
    'email': 'ईमेल पत्ता',
    'password': 'पासवर्ड',
    'login': 'लॉगिन',
    'demo_section': 'डेमो लॉगिन',
    'demo_email': 'डेमो ईमेल',
    'demo_password': 'डेमो पासवर्ड',
    'demo_helper': 'प्रोटोटाइप पाहण्यासाठी डेमो क्रेडेंशियल्स वापरा',
    'hello_farmer': 'नमस्कार, शेतकरी!',
    'dashboard_subtitle': 'आज तुम्हाला काय करायचे आहे?',
    'crop_advisor': 'पीक सल्लागार',
    'schemes': 'सरकारी योजना',
    'weather': 'हवामान',
    'community': 'समुदाय',
    'ai_assistant': 'जेमिनी AI सहाय्यक',
    'ai_prototype': '(प्रोटोटाइप / डेमो मोड)',
  },
  gu: {
    'select_language': 'તમારી ભાષા પસંદ કરો',
    'continue': 'ચાલુ રાખો',
    'welcome_back': 'પાછા સ્વાગત છે',
    'login': 'લૉગિન',
    'hello_farmer': 'નમસ્તે, ખેડૂત!',
    'crop_advisor': 'પાક સલાહકાર',
    'schemes': 'સરકારી યોજનાઓ',
    'weather': 'હવામાન',
    'ai_assistant': 'જેમિની AI સહાયક',
  },
  pa: {
    'select_language': 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    'continue': 'ਜਾਰੀ ਰੱਖੋ',
    'welcome_back': 'ਵਾਪਸ ਸਵਾਗਤ ਹੈ',
    'login': 'ਲੌਗਇਨ',
    'hello_farmer': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਕਿਸਾਨ!',
    'crop_advisor': 'ਫਸਲ ਸਲਾਹਕਾਰ',
    'schemes': 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
    'weather': 'ਮੌਸਮ',
    'ai_assistant': 'ਜੈਮਿਨੀ AI ਸਹਾਇਕ',
  },
  ta: {
    'select_language': 'உங்கள் மொழியை தேர்ந்தெடுக்கவும்',
    'continue': 'தொடரவும்',
    'welcome_back': 'மீண்டும் வரவேற்கிறோம்',
    'login': 'உள்நுழைவு',
    'hello_farmer': 'வணக்கம், விவசாயி!',
    'crop_advisor': 'பயிர் ஆலோசகர்',
    'schemes': 'அரசு திட்டங்கள்',
    'weather': 'வானிலை',
    'ai_assistant': 'ஜெமினி AI உதவியாளர்',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

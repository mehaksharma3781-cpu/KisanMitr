import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Mic, MicOff, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'hi' 
        ? 'नमस्ते! मैं आपका AI सहायक हूं। खेती, सरकारी योजनाओं, या मौसम के बारे में कुछ भी पूछें।'
        : 'Hello! I am your AI farming assistant. Ask me anything about crops, government schemes, or weather conditions.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulated AI responses for demo
    const responses: Record<string, string> = {
      wheat: language === 'hi' 
        ? 'गेहूं आपके क्षेत्र के लिए अच्छी फसल है। PM-KISAN के तहत ₹15,000 की सब्सिडी मिल सकती है। बुवाई का सही समय नवंबर है।'
        : 'Wheat is a good crop for your region. You can get ₹15,000 subsidy under PM-KISAN. Best sowing time is November.',
      scheme: language === 'hi'
        ? 'PM-KISAN योजना के तहत किसानों को सालाना ₹6,000 मिलते हैं। आवेदन के लिए आधार कार्ड, बैंक खाता और भूमि रिकॉर्ड चाहिए।'
        : 'Under PM-KISAN scheme, farmers receive ₹6,000 annually. You need Aadhaar card, bank account, and land records to apply.',
      weather: language === 'hi'
        ? 'अगले 3 दिनों में भारी बारिश की संभावना है। फसल की कटाई जल्दी करें और जल निकासी की व्यवस्था करें।'
        : 'Heavy rainfall expected in next 3 days. Complete harvesting quickly and ensure proper drainage.',
      default: language === 'hi'
        ? 'मैं आपकी मदद के लिए यहां हूं। कृपया खेती, योजनाओं या मौसम के बारे में पूछें।'
        : 'I am here to help you. Please ask about farming, schemes, or weather.',
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('wheat') || lowerMessage.includes('गेहूं')) return responses.wheat;
    if (lowerMessage.includes('scheme') || lowerMessage.includes('योजना') || lowerMessage.includes('kisan')) return responses.scheme;
    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('rain')) return responses.weather;
    return responses.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responseContent = await simulateAIResponse(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    // Auto speak response
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(responseContent);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(language === 'hi' 
        ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' 
        : 'Voice input is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const isFinal = event.results[0].isFinal;
      setInput(transcript);
      
      // Auto-send when speech is final
      if (isFinal && transcript.trim()) {
        setTimeout(() => {
          handleSendVoice(transcript);
        }, 300);
      }
    };

    recognition.start();
  };

  const handleSendVoice = async (voiceInput: string) => {
    if (!voiceInput.trim()) return;
    setIsListening(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: voiceInput,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    const responseContent = await simulateAIResponse(voiceInput);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(responseContent);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h1 className="font-bold">{t('ai_assistant')}</h1>
          </div>
          <p className="text-xs text-primary-foreground/70">{t('ai_prototype')}</p>
        </div>
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <VolumeX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">Gemini AI</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-4 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        {/* Voice Input Prompt - More Prominent */}
        {!isListening && !input && (
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              {language === 'hi' ? '🎤 बोलने के लिए माइक दबाएं या टाइप करें' : '🎤 Tap mic to speak or type below'}
            </p>
          </div>
        )}

        {/* Listening Animation */}
        {isListening && (
          <div className="flex flex-col items-center justify-center py-6 mb-4 bg-primary/10 rounded-2xl animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute inset-0" />
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center relative">
                <Mic className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <p className="text-lg font-bold text-primary mt-4">
              {language === 'hi' ? '🎤 सुन रहा हूं...' : '🎤 Listening...'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'hi' ? 'अपना सवाल बोलें' : 'Speak your question'}
            </p>
            {input && (
              <p className="text-sm text-foreground mt-2 px-4 py-2 bg-muted rounded-lg">
                "{input}"
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 max-w-md mx-auto">
          <Button
            variant={isListening ? 'destructive' : 'default'}
            size="icon"
            className={`w-14 h-14 rounded-full flex-shrink-0 transition-all ${
              isListening ? 'animate-pulse scale-110' : 'hover:scale-105'
            }`}
            onClick={toggleListening}
          >
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'hi' ? 'यहां टाइप करें...' : 'Type here...'}
            className="h-12 rounded-full px-5"
            disabled={isListening}
          />

          <Button
            size="icon"
            className="w-14 h-14 rounded-full flex-shrink-0"
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isListening}
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

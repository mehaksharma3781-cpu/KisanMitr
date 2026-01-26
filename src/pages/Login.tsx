import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sprout, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import kisanMitrLogo from '@/assets/kisanmitr-logo-new.png';

const DEMO_EMAIL = 'farmer.demo@krushiai.app';
const DEMO_PASSWORD = 'Demo@123';

const Login: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (login(email, password)) {
      navigate('/profile-setup');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const copyToClipboard = async (text: string, type: 'email' | 'password') => {
    await navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setEmail(text);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setPassword(text);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col px-4 py-8 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={kisanMitrLogo} 
            alt="KisanMitr Logo" 
            className="w-28 h-28 mx-auto mb-4 object-contain drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('welcome_back')}
          </h1>
          <p className="text-muted-foreground">
            {t('login_subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 text-lg"
                placeholder="farmer@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pl-12 pr-12 text-lg"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full h-14 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : t('login')}
          </Button>
        </form>

        {/* Demo Credentials Section */}
        <div className="w-full farm-card bg-secondary/10 border-secondary/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground">{t('demo_section')}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
              <div>
                <p className="text-xs text-muted-foreground">{t('demo_email')}</p>
                <p className="font-mono text-sm text-foreground">{DEMO_EMAIL}</p>
              </div>
              <button
                onClick={() => copyToClipboard(DEMO_EMAIL, 'email')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copiedEmail ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
              <div>
                <p className="text-xs text-muted-foreground">{t('demo_password')}</p>
                <p className="font-mono text-sm text-foreground">{DEMO_PASSWORD}</p>
              </div>
              <button
                onClick={() => copyToClipboard(DEMO_PASSWORD, 'password')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copiedPassword ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {t('demo_helper')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

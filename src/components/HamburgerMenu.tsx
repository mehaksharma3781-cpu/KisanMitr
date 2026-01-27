import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, User, Sprout, FileText, MessageSquare, 
  TrendingUp, Cloud, Sparkles, X, LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { playClickSound } from '@/hooks/useClickSound';
import kisanMitrLogo from '@/assets/kisanmitr-logo-new.png';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'home', path: '/dashboard', icon: Home, label: t('home') || 'Home', color: 'bg-primary' },
    { id: 'profile', path: '/profile', icon: User, label: t('profile') || 'Profile', color: 'bg-secondary' },
    { id: 'crop-advisor', path: '/crop-advisor', icon: Sprout, label: t('crop_advisor'), color: 'bg-success' },
    { id: 'schemes', path: '/schemes', icon: FileText, label: t('schemes'), color: 'bg-warning' },
    { id: 'community', path: '/community', icon: MessageSquare, label: t('community'), color: 'bg-accent' },
    { id: 'outcome-tracker', path: '/outcome-tracker', icon: TrendingUp, label: t('track_progress'), color: 'bg-destructive' },
    { id: 'weather', path: '/weather', icon: Cloud, label: t('weather'), color: 'bg-accent' },
    { id: 'ai-assistant', path: '/ai-assistant', icon: Sparkles, label: t('ai_assistant'), color: 'bg-primary' },
  ];

  const handleNavigation = (path: string) => {
    playClickSound();
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    playClickSound();
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-card z-50 shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={kisanMitrLogo} 
              alt="KisanMitr Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-bold text-lg">KisanMitr</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-3 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 border-2 border-primary" 
                        : "hover:bg-muted border-2 border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      item.color
                    )}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={cn(
                      "font-medium",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-destructive/10 transition-colors text-destructive"
          >
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">{t('logout') || 'Logout'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;

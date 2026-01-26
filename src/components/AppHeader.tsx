import React from 'react';
import { Menu, Sprout } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick: () => void;
  rightElement?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = 'KisanMitr', 
  subtitle,
  onMenuClick,
  rightElement 
}) => {
  return (
    <header className="bg-primary text-primary-foreground px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button */}
          <button
            onClick={onMenuClick}
            className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">{title}</h1>
              {subtitle && (
                <p className="text-xs text-primary-foreground/70">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {rightElement}
      </div>
    </header>
  );
};

export default AppHeader;

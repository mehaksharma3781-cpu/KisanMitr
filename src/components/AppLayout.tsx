import React, { useState } from 'react';
import HamburgerMenu from './HamburgerMenu';
import AppHeader from './AppHeader';
import AIAssistant from './AIAssistant';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  headerRightElement?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title,
  subtitle,
  showHeader = true,
  headerRightElement
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Header */}
      {showHeader && (
        <AppHeader 
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMenuOpen(true)}
          rightElement={headerRightElement}
        />
      )}

      {/* Main Content */}
      <main className="pb-24">
        {children}
      </main>

      {/* Floating AI Button */}
      <button 
        onClick={() => setShowAI(true)}
        className="ai-float-btn"
        aria-label="Open AI Assistant"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </button>

      {/* AI Assistant Modal */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
};

export default AppLayout;

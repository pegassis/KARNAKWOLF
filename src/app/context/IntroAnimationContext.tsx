import React, { createContext, useContext, useState, useEffect } from 'react';

interface IntroAnimationContextType {
  hasShown: boolean;
  markAsShown: () => void;
}

const IntroAnimationContext = createContext<IntroAnimationContextType | undefined>(undefined);

export function IntroAnimationProvider({ children }: { children: React.ReactNode }) {
  const [hasShown, setHasShown] = useState(() => {
    // Check localStorage on mount to persist across page reloads
    return localStorage.getItem('introAnimationShown') === 'true';
  });

  const markAsShown = () => {
    setHasShown(true);
    localStorage.setItem('introAnimationShown', 'true');
  };

  return (
    <IntroAnimationContext.Provider value={{ hasShown, markAsShown }}>
      {children}
    </IntroAnimationContext.Provider>
  );
}

export function useIntroAnimation() {
  const context = useContext(IntroAnimationContext);
  if (context === undefined) {
    throw new Error('useIntroAnimation must be used within IntroAnimationProvider');
  }
  return context;
}

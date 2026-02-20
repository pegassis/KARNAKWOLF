import React, { createContext, useContext, useState, useEffect } from 'react';

interface IntroAnimationContextType {
  hasShown: boolean;
  markAsShown: () => void;
}

const IntroAnimationContext = createContext<IntroAnimationContextType | undefined>(undefined);

export function IntroAnimationProvider({ children }: { children: React.ReactNode }) {
  const [hasShown, setHasShown] = useState(() => {
    // Check sessionStorage on mount - animation shows once per browser session
    return sessionStorage.getItem('introAnimationShown') === 'true';
  });

  const markAsShown = () => {
    setHasShown(true);
    sessionStorage.setItem('introAnimationShown', 'true');
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

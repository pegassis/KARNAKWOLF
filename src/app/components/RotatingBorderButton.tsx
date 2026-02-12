import React, { useState } from 'react';
import './RotatingBorderButton.css';

interface RotatingBorderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const RotatingBorderButton: React.FC<RotatingBorderButtonProps> = ({
  children,
  onClick,
  className = ''
}) => {
  const [isThunderActive, setIsThunderActive] = useState(false);

  const handleClick = () => {
    setIsThunderActive(true);
    
    // Trigger callback
    onClick?.();
    
    // Remove thunder animation after animation completes
    setTimeout(() => {
      setIsThunderActive(false);
    }, 600);
  };

  return (
    <button
      onClick={handleClick}
      className={`rotating-border-button ${isThunderActive ? 'thunder-active' : ''} ${className}`}
    >
      <span className="rotating-border-button-content">
        {children}
      </span>
    </button>
  );
};

export default RotatingBorderButton;


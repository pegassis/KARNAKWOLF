import React, { useEffect } from 'react';
import './IntroAnimation.css';

type Props = {
  onFinish?: () => void;
  duration?: number;
};

const IntroAnimation: React.FC<Props> = ({ onFinish, duration = 3000 }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      onFinish && onFinish();
    }, duration);
    return () => clearTimeout(t);
  }, [onFinish, duration]);

  const letters = ["K", "A", "R", "N", "A", "K", "'", "2", "6"];

  return (
    <div className="intro-overlay">
      <div className="loader-wrapper" role="img" aria-label="Loading">
        {letters.map((ch, i) => (
          <span key={i} className="loader-letter">
            {ch}
          </span>
        ))}

        <div className="loader" />

        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
      </div>
    </div>
  );
};

export default IntroAnimation;

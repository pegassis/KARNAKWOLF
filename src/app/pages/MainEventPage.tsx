import React, { useState, useEffect } from 'react';
import RevealLoader from '../components/RevealLoader';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GridScan } from '../components/GridScan';
import Carousel from '../components/Carousel';

export function MainEventPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showReveal, setShowReveal] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <div className="relative min-h-screen bg-[#0F0F0F] overflow-hidden">
      {/* RevealLoader overlay for Main Event page */}
      {showReveal && (
        <RevealLoader
          text="MAIN EVENTS"
          textSize="80px"
          textColor="#ff0000"
          bgColors={["#1a0000", "#750202", "#b82001"]}
          angle={120}
          staggerOrder="left-to-right"
          movementDirection="top-down"
          textFadeDelay={0.5}
          onComplete={() => setShowReveal(false)}
        />
      )}
      {/* Background Music Player (always mounted so it starts with reveal) */}
      <audio
        ref={audioRef}
        src="/music/mainmus.mp3"
        autoPlay
        loop
        style={{ display: 'none' }}
      />
      {/* Main content only shows after reveal animation */}
      {!showReveal && (
        <>
          <button
            onClick={() => setMuted(m => !m)}
            className={
              `z-50 bg-[#222] text-white rounded-full p-3 shadow-lg hover:bg-[#444] transition`
              + ' ' +
              'fixed right-6 top-6 md:top-6 md:right-6 md:block ' +
              'sm:top-6 sm:right-6 ' +
              'block md:block'
            }
            style={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // On mobile, move below header
              top: isMobile ? 80 : 24,
            }}
            aria-label={muted ? 'Unmute Music' : 'Mute Music'}
          >
            {muted ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>
            )}
          </button>
          {/* GridScan Background */}
          <div className="fixed inset-0 z-0">
            <GridScan
              sensitivity={0.55}
              lineThickness={1}
              linesColor="#A0A0A8"
              gridScale={0.1}
              scanColor="#DA0000"
              scanOpacity={0.4}
              enablePost
              bloomIntensity={0.6}
              chromaticAberration={0.002}
              noiseIntensity={0.01}
              className=""
              style={{}}
            />
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 min-h-screen"
          >
            {/* Header with Back Button */}
            <div className="flex items-center justify-between pt-8 px-1 sm:px-4 md:px-8 max-w-7xl mx-auto">
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-[#FF6B35] hover:text-[#FFA500] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </motion.button>
              <h2 style={{padding:'0px'}}className="text-2xl sm:text-3xl font-bold text-[#E8E8E8]"></h2>
              <div className="w-16" />
            </div>
            
            {/* Carousel Section */}
            <div  className="w-full flex  justify-center  pt-8 sm:pt- pb-8 sm:pb-16 px-4">
              <div style={{ 
                width: isMobile ? '10%' : '90%',
                height: isMobile ? '700px' : '700px',
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                maxWidth: '900px'
              }}>
                
                <Carousel
                  baseWidth={isMobile ? 250 : 500}
                  autoplay={false}
                  autoplayDelay={3000}
                  pauseOnHover={false}
                  loop={true}
                  round={false}
                />
              </div>
            </div>
          </motion.div>
		</>
      )}
    </div>
  );
}

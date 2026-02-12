import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoModalProps {
  isOpen: boolean;
  videoSrc: string;
  onClose: () => void;
  autoPlay?: boolean;
}

export function VideoModal({
  isOpen,
  videoSrc,
  onClose,
  autoPlay = true,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Play video
      setFadeOut(false);
      if (videoRef.current && autoPlay) {
        videoRef.current.play();
      }
    } else {
      // Re-enable scrolling
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [isOpen, autoPlay]);

  const handleVideoEnd = () => {
    // Start fade out 1 second before actual video end, or at the end
    setFadeOut(true);
    // Close after fade completes
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleVideoClick = () => {
    // Stop the video and exit
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setFadeOut(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Get duration and current time
      if (video.duration && video.currentTime >= video.duration - 1) {
        if (!fadeOut) {
          handleVideoEnd();
        }
      }
    };

    if (isOpen) {
      video.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isOpen, fadeOut]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black"
          style={{ 
            zIndex: 99999,
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: fadeOut ? 0 : 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full flex items-center justify-center overflow-hidden"
          >
            {/* Video Player - Full Screen with Border Fade */}
            <div className="relative w-full h-full overflow-hidden cursor-pointer" onClick={handleVideoClick}>
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover pointer-events-none"
                autoPlay={autoPlay}
              />
              
              {/* Border Fade Effect */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/50 to-transparent" />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent" />
                {/* Left fade */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/50 to-transparent" />
                {/* Right fade */}
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/50 to-transparent" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

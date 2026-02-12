import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AboutPage } from './AboutPage';
import { DepartmentsPage } from './DepartmentsPage';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import IntroAnimation from '../components/IntroAnimation';
import CircularGallery from '../components/CircularGallery';
import LiquidEther from '../components/LiquidEther';

import RotatingBorderButton from '../components/RotatingBorderButton';

// import RevealLoader from '../components/RevealLoader';




export function HomePage() {
  const [animationComplete, setAnimationComplete] = React.useState(false);
  // const [showReveal, setShowReveal] = React.useState(false);
  const navigate = useNavigate();
  
  // Handler for Main Event button
  const handleMainEventClick = () => {
    navigate('/mainevent');
  };

  return (
    <div className="min-h-screen">
      {/* Full-Screen Intro Animation Overlay */}
      {!animationComplete && (
        <IntroAnimation onFinish={() => setAnimationComplete(true)} duration={3000} />
      )}


      {/* LiquidEther Background */}
      <div className="fixed inset-0 z-0">
        <LiquidEther
          colors={['#FF6B35', '#FFA500', '#FF8C5A']}
          mouseForce={20}
          cursorSize={60}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen relative z-10"
      >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
        {/* Top-left logo and badge (only on Home) - positioned inside hero so it scrolls away */}
        <div className="absolute top-5 left-5 z-10 flex items-center gap-3">
          <Link to="/" onClick={() => {}} className="z-10">
            <img
              src="/pics/remlogo.png"
              alt="KARNAK logo"
              className="w-16 h-16 object-contain rounded-md shadow-lg"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                if (t.src.indexOf('remlogo.png') === -1) t.src = '/pics/remlogo.png';
              }}
            />
          </Link>

          
        </div>
            
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FF6B35]/10 via-transparent to-transparent" />
        
        {/* Floating tech symbols */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[#FF6B35]/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="2" />
                <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" />
                <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
                <line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
                <line x1="16" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 flex flex-col items-center justify-center text-center relative z-10">
          {/* Centered Content */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-[#FF6B35] text-xs sm:text-sm tracking-wide mb-4">
              MAR BASELIOS INSTITUTE OF TECHNOLOGY AND
            </span>

            <h1 id="page-logo" className="text-7xl sm:text-8xl md:text-9xl mb-6 tracking-tight bg-gradient-to-br from-[#E8E8E8] to-[#FF6B35] bg-clip-text text-transparent">
              KARNAK
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6"
            >
              
            </motion.div>

            
            <p className="text-lg sm:text-xl text-[#B0B0B0] mb-8 leading-relaxed">
              Experience the convergence of innovation and technology at MBITS's premier technical festival. 
              Join us for three days of competitions, workshops, and groundbreaking ideas.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 w-full">
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl text-[#FF6B35] mb-1">50+</div>
                <div className="text-xs sm:text-sm text-[#B0B0B0]">Events</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl text-[#FFA500] mb-1">5K+</div>
                <div className="text-xs sm:text-sm text-[#B0B0B0]">Participants</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl text-[#FF8C5A] mb-1">3</div>
                <div className="text-xs sm:text-sm text-[#B0B0B0]">Days</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">


              <Link to="/departments" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6B35] text-white rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  Explore Events
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <RotatingBorderButton 
                  className="w-full sm:w-auto px-8 py-4"
                  onClick={handleMainEventClick}
                >
                  Main Events
                </RotatingBorderButton>
              </motion.div>
              
              <Link to="/about" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#1A1A1A] border-2 border-[#FF6B35] text-[#FF6B35] rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  About KARNAK
                </motion.button>
              </Link>
            </div>
          </motion.div>
      
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-[#0F0F0F] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-4 text-[#E8E8E8]">Why KARNAK?</h2>
            <div className="w-24 h-1 bg-[#FF6B35] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: 'Competitions',
                description: 'Compete in cutting-edge technical challenges across multiple domains',
                color: '#FF6B35'
              },
              {
                icon: Users,
                title: 'Networking',
                description: 'Connect with industry experts, peers, and potential collaborators',
                color: '#FFA500'
              },
              {
                icon: Calendar,
                title: 'Workshops',
                description: 'Learn from industry professionals through hands-on sessions',
                color: '#FF8C5A'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#FF6B35]/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-2xl mb-3 text-[#E8E8E8]" style={{ color: feature.color }}>
                  {feature.title}
                </h3>
                <p className="text-[#B0B0B0] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About (inline) */}
      <div id="about">
        <AboutPage />
      </div>

      {/* Departments (inline) */}
      <div id="departments">
        <DepartmentsPage />
      </div>

      {/* Gallery Section */}
      <section className="py-24 bg-[#0F0F0F] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-4 text-[#E8E8E8]">Gallery</h2>
            <div className="w-24 h-1 bg-[#FF6B35] mx-auto" />
          </motion.div>
          
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery
              bend={1}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollSpeed={2}
              scrollEase={0.05}
            />
          </div>
        </div>
      </section>
      </motion.div>
    </div>
  );
}
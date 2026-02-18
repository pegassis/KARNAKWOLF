import React from 'react';
import { motion } from 'motion/react';
import SplashCursor from '../components/SplashCursor';
import ProfileCard from '../components/ProfileCard';
import ChromaGrid from '../components/ChromaGrid';

export function DevPage() {
  const developers = [
    {
      name: 'Leen Leo',
      title: 'Website Developer',
      handle: 'Leen Leo',
      status: 'Website Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      contactText: 'Contact'
    },
    {
      name: 'Cristepher C Biju',
      title: 'Website Developer',
      handle: 'Cristepher C Biju',
      status: 'Website Developer',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
      contactText: 'Contact'
    },
    {
      name: 'Aryan C S',
      title: 'Website Developer',
      handle: 'Aryan C S',
      status: 'Website Developer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
      contactText: 'Contact'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* SplashCursor Background */}
      <SplashCursor />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen relative z-10"
      >
        <section className="relative w-full py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-center mb-16"
              style={{ paddingTop: '50px', color: '#FF6B35' }}
            >
              DEVELOPERS
            </motion.h1>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
              {developers.map((dev, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <ProfileCard
                    avatarUrl={dev.image}
                    name={dev.name}
                    title={dev.title}
                    handle={dev.handle}
                    status={dev.status}
                    contactText={dev.contactText}
                    className="w-80 sm:w-96 md:w-auto text-lg sm:text-xl"
                    showUserInfo={true}
                    enableTilt={true}
                    enableMobileTilt={true}
                    mobileTiltSensitivity={8}
                    behindGlowEnabled={false}
                    onContactClick={() => console.log(`Contact ${dev.name}`)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Editor Section */}
            <section className="mt-16">
              <h2 className="text-5xl font-semibold mb-6" style={{ textAlign:'center',color: '#FFD166' }}>Editors</h2>
              <div className="editor-grid" style={{ position: 'relative' }}>
                <ChromaGrid
                  items={[]}
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                />
              </div>
            </section>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

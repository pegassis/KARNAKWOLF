import React from 'react';
import { motion } from 'motion/react';
import SplashCursor from '../components/SplashCursor';
import ChromaGrid from '../components/ChromaGrid';

export function DevPage() {
  const developers = [
    {
      name: 'Leen Leo',
      title: 'Website Developer',
      handle: 'S6 CSE C',
      status: 'Website Developer',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771437979/leen4_prxd8c.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/leenleo?igsh=MWw0amhmM29zM3doaQ%3D%3D&utm_source=qr'
    },
    {
      name: 'Christepher C Biju',
      title: 'Website Developer',
      handle: 'S6 CSE B',
      status: 'Website Developer',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771437577/christu2_fpg8ml.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/leenleo?igsh=MWw0amhmM29zM3doaQ%3D%3D&utm_source=qr'
    },
    {
      name: 'Aryan C S',
      title: 'Website Developer',
      handle: 'S6 CSE A',
      status: 'Website Developer',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771429145/aryan_sylfot.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/leenleo?igsh=MWw0amhmM29zM3doaQ%3D%3D&utm_source=qr'
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
        <section className="relative w-full py-8 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl lg:text-7xl font-bold text-center mb-8 md:mb-16"
              style={{ paddingTop: '20px', color: '#ce3d04' }}
            >
              DEVELOPERS
            </motion.h1>

            {/* Single ChromaGrid matching the editor layout */}
            <div className="editor-grid dev-grid" style={{ position: 'relative', height: 'auto' }}>
              <ChromaGrid
                items={developers.map(d => ({
                  image: d.image,
                  title: d.name,
                  subtitle: d.title,
                  handle: d.handle,
                  url: d.url,
                  borderColor: '#bc2020',
                  gradient: 'linear-gradient(145deg,#FF6B35,#000)'
                }))}
                radius={300}
                columns={3}
                rows={1}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
              />
            </div>

            {/* Editor Section */}
            <section className="mt-8 md:mt-16">
              <h2 className="text-3xl md:text-5xl font-semibold mb-6" style={{ textAlign:'center',color: '#FFD166' }}>Editors</h2>
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

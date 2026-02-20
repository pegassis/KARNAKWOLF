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
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771571231/leen4_wkpxby.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/leochan_jr?igsh=YWFxMzBqNHFnODE=',
      borderColor: '#FF6B35',
      gradient: 'linear-gradient(145deg,#FF6B35,#000)'
    },
    {
      name: 'Christepher C Biju',
      title: 'Website Developer',
      handle: 'S6 CSE B',
      status: 'Website Developer',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771437577/christu2_fpg8ml.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/crazy_chris007/',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(145deg,#06B6D4,#000)'
    },
    {
      name: 'Aryan C S',
      title: 'Website Developer',
      handle: 'S6 CSE A',
      status: 'Website Developer',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771429145/aryan_sylfot.jpg',
      contactText: 'Contact',
      url: 'https://wa.me/8891510918',
      borderColor: '#3d035d',
      gradient: 'linear-gradient(145deg,#8B5CF6,#000)'
    }
  ];
   const coordinators = [
    {
      name: 'Rehab Hamsa',
      title: 'Coordinator',
      handle: 'S6 CSE C',
      status: 'Coordinator',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771421285/rehab_wvcd9y.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/rrrrrehab?igsh=dHNtMG01cWlqZTk=',
      borderColor: '#10B981',
      gradient: 'linear-gradient(145deg,#10B981,#000)'
      
    },
    {
      name: 'Anandhu K R',
      title: 'Coordinator',
      handle: 'S6 CSE DS',
      status: 'Coordinator',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771528459/anandhu_erukq4.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/anandhu__k__r?igsh=eG9jN21nc2dhbTU3',
      borderColor: '#721782',
      gradient: 'linear-gradient(145deg,#721782,#000)'
      
    },
   
  ];
    const editors = [
    {
      name: 'Eldho P P',
      title: 'Media Wing',
      handle: 'S6 CSE B',
      status: 'Media Wing',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771421949/eldhopp_pumxuo.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/e.ldho7?igsh=MWw0amhmM29zM3doaQ%3D%3D&utm_source=qr',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(145deg,#F59E0B,#000)'
    },
    {
      name: 'AbuTahir F',
      title: 'Media Wing',
      handle: 'S2 CSE AI/ML',
      status: 'Media Wing',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771421290/abutahir_rosx4c.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/abu._thahirr?igsh=MWhobHg3Nmc1ZDN1eA==',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(145deg,#EF4444,#000)'
    },
    {
      name: 'Abraham Hayden Joseph',
      title: 'Media Wing',
      handle: 'S4 CSE A',
      status: 'Media Wing',
      image: 'https://res.cloudinary.com/dts9wynrs/image/upload/v1771423187/abraham_ezuffz.jpg',
      contactText: 'Contact',
      url: 'https://www.instagram.com/hayden_a_elite?igsh=MWhlZjJrcHV3MWJ4Yg==',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(145deg,#8B9CF6,#000)'
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
              className="text-5xl md:text-5xl lg:text-7xl font-bold text-center mb-8 md:mb-16"
              style={{ textAlign: 'center',paddingTop: '40px', color: '#ce3d04' }}
            >
            DEVELOPERS
            </motion.h1>

            {/* Single ChromaGrid matching the editor layout */}
            <div  style={{ position: 'relative', height: 'auto' }}>
              <ChromaGrid
                items={developers.map(d => ({
                  image: d.image,
                  title: d.name,
                  subtitle: d.title,
                  handle: d.handle,
                  url: d.url,
                  borderColor: d.borderColor,
                  gradient: d.gradient
                }))}
                radius={300}
                columns={3}
                rows={1}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
              />
            </div>
             <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-5xl lg:text-7xl font-bold text-center mb-8 md:mb-16"
              style={{ textAlign: 'center', paddingTop: '50px', color: '#0fc40c' }}
            >
            COORDINATORS
            </motion.h1>
             {/* Single ChromaGrid matching the editor layout */}
            <div  style={{ position: 'relative', height: 'auto' }}>
              <ChromaGrid
                className="centered-grid"
                items={coordinators.map(d => ({
                  image: d.image,
                  title: d.name,
                  subtitle: d.title,
                  handle: d.handle,
                  url: d.url,
                  borderColor: d.borderColor,
                  gradient: d.gradient
                }))}
                radius={300}
                columns={2}
                rows={1}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
              />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-5xl lg:text-7xl font-bold text-center mb-8 md:mb-16"
              style={{ textAlign: 'center', paddingTop: '50px', color: '#e4c00f' }}
            >
            EDITORS
            </motion.h1>
            <div  style={{ position: 'relative', height: 'auto' }}>
              <ChromaGrid
                items={editors.map(d => ({
                  image: d.image,
                  title: d.name,
                  subtitle: d.title,
                  handle: d.handle,
                  url: d.url,
                  borderColor: d.borderColor,
                  gradient: d.gradient
                }))}
                radius={300}
                columns={3}
                rows={1}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
              />
            </div>
            

            
           
          </div>
        </section>
      </motion.div>
    </div>
  );
}

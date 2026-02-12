import React from 'react';
import CircularGallery from '../components/CircularGallery';

export default function GalleryPage() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
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
  );
}

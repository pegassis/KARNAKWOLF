import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useTransform } from 'motion/react';

import './Carousel.css';

const DEFAULT_ITEMS = [
  {
    title: 'Karnak Conference',
    description: 'Join us for the grand opening ceremony of KARNAK 2026, the premier tech festival bringing together innovators, engineers, and visionaries. Witness cutting-edge presentations, live demonstrations, and collaborative workshops showcasing the future of technology across all engineering disciplines. Network with industry leaders and fellow enthusiasts in an electrifying atmosphere of innovation.',
    id: 1,
    image: '/mainpic/mn1.jpg'
  },
  {
    title: 'Auto Show',
    description: '',
    id: 2,
    image: '/mainpic/mn2.jpg'
  },
  {
    title: 'BEYOND THOUGHTS',
    description: '',
    id: 3,
    image: '/mainpic/mn3.jpg'
  },
  {
    title: 'ROBO VERSE',
    description: '',
    id: 4,
    image: '/mainpic/mn4.jpg'
  },
  {
    title: 'FASHION SHOW',
    description: '',
    id: 5,
    image: '/mainpic/mn5.jpg'
  },
  {
    title: 'PRO SHOW',
    description: '',
    id: 6,
    image: '/mainpic/mn6.jpg'
  },
  {
    title: 'THANDAV',
    description: '',
    id: 7,
    image: '/mainpic/mn7.jpg'
  },{
    title: 'Gaming XP',
    description: '',
    id: 8,
    image: '/mainpic/mn8.jpeg'
  },
  {
    title: 'Virtual Reality (VR) Show',
    description: 'An immersive experience zone where participants explore cutting-edge virtual reality applications in engineering, design, gaming, simulation, and interactive learning.',
    id: 9,
    image: '/mainpic/mn9.jpg'
  },
  {
    title: 'Drone Expo & Workshops ',
    description: 'Interactive drone demonstrations and hands-on workshops covering aerial surveying, mapping, and emerging UAV technologies.',
    id: 10,
    image: '/mainpic/mn10.jpg'
  },
   {
    title: 'Heavy Haulage',
    description: 'The Construction Equipment & Vehicles Expo is a premier industry event showcasing the latest innovations in heavy machinery, earth-moving equipment, transport vehicles, and construction technology. Bringing together leading manufacturers, suppliers, engineers, and industry professionals, the expo provides a dynamic platform for networking, live demonstrations, product launches, and business opportunities.\n\nCoordinators: ELDHO PAULOSE, AMEENUDHEEN',
    id: 11,
    image: '/mainpic/mn11.jpg'
  },
  
  {
    title: 'Coordinators',
    description: '',
    id: 12,
    image: '/mainpic/mn12.jpg'
  }
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition, onOpen }) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`carousel-item ${round ? 'round' : ''}`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY: rotateY,
        ...(round && { borderRadius: '50%' })
      }}
      transition={transition}
    >
      <div className={`carousel-item-header ${round ? 'round' : ''}`}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="carousel-item-image"
            onClick={() => onOpen && onOpen(item.image, item)}
            role="button"
          />
        ) : (
          <span className="carousel-icon-container">{item.icon}</span>
        )}
      </div>
    </motion.div>
  );
}

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = true, // Force loop for infinite effect
  round = false
}) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  const handlePrevious = () => {
    setPosition(prev => {
      const next = prev - 1;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const handleNext = () => {
    setPosition(prev => {
      const next = prev + 1;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  // Modal state for full-screen image and description
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const openModal = (src: string, item?: any) => {
    setModalImage(src);
    if (item) setSelectedItem(item);
  };
  const closeModal = () => {
    setModalImage(null);
    setSelectedItem(null);
  };

  useEffect(() => {
    if (modalImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalImage]);

  return (
    <div
      ref={containerRef}
      className={`carousel-container ${round ? 'round' : ''}`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px`, borderRadius: '50%' })
      }}
    >
      {!isMobile && (
        <button className="carousel-nav-button carousel-nav-button-left" onClick={handlePrevious}>
          ‹
        </button>
      )}
      <motion.div
        className="carousel-track"
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{
          width: 'auto',
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
            onOpen={openModal}
          />
        ))}
      </motion.div>
      <div className={`carousel-indicators-container ${round ? 'round' : ''}`}>
        <div className="carousel-indicators">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`carousel-indicator ${activeIndex === index ? 'active' : 'inactive'}`}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
      {!isMobile && (
        <button className="carousel-nav-button carousel-nav-button-right" onClick={handleNext}>
          ›
        </button>
      )}
      {modalImage && typeof document !== 'undefined' && createPortal(
        <div className="carousel-modal-overlay" onClick={closeModal}>
          <div className="carousel-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="carousel-modal-image-wrapper" onClick={closeModal}>
              <img src={modalImage} alt="Enlarged" className="carousel-modal-image" />
            </div>
            {selectedItem && (
              <div className="carousel-modal-description" onClick={closeModal}>
                <h3  className=" carousel-modal-title">{selectedItem.title}</h3>
                <p className="text-justify carousel-modal-text">{selectedItem.description}</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

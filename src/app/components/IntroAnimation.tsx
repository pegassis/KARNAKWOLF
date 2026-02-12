import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

type Props = {
  onFinish?: () => void;
  duration?: number;
};

export const IntroAnimation: React.FC<Props> = ({ onFinish, duration = 3000 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const [startExit, setStartExit] = useState(false);
  const [exitTransform, setExitTransform] = useState<{ x: number; y: number; scale: number } | null>(null);
  const [pinnedStyle, setPinnedStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(DPR, DPR);

    const particleCount = Math.max(40, Math.floor((width * height) / 30000));
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 1 + Math.random() * 2,
      });
    }

    const maxDist = 120;
    // sparks for quick bright flickers
    type Spark = { x: number; y: number; vx: number; vy: number; r: number; life: number; maxLife: number };
    const sparks: Spark[] = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const DPR = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(DPR, DPR);
    }

    let last = performance.now();

    function draw(now: number) {
      const dt = Math.min(48, now - last) / 16.666;
      last = now;

      ctx.clearRect(0, 0, width, height);

      // background subtle radial
      const g = ctx.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.5, height * 0.5, Math.max(width, height));
      g.addColorStop(0, 'rgba(255,107,53,0.04)');
      g.addColorStop(1, 'rgba(15,15,15,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // draw particles
      for (let p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,107,53,0.9)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // spawn occasional sparks near random particles
      if (Math.random() < 0.06) {
        const anchor = particles[Math.floor(Math.random() * particles.length)];
        if (anchor) {
          sparks.push({
            x: anchor.x + (Math.random() - 0.5) * 20,
            y: anchor.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 1.8,
            vy: (Math.random() - 0.5) * 1.8 - 0.6,
            r: 0.8 + Math.random() * 1.8,
            life: 18 + Math.floor(Math.random() * 16),
            maxLife: 18 + Math.floor(Math.random() * 16),
          });
        }
      }

      // update & draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt * 1.2;
        s.y += s.vy * dt * 1.2;
        s.vy -= 0.02 * dt; // slight upward drift
        s.life -= 1 * dt;
        const alpha = Math.max(0, s.life / s.maxLife);

        if (alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const rg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        rg.addColorStop(0, `rgba(255,200,120,${0.95 * alpha})`);
        rg.addColorStop(0.4, `rgba(255,150,80,${0.45 * alpha})`);
        rg.addColorStop(1, `rgba(255,150,80,0)`);
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // connect
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = 1 - dist / maxDist;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,107,53,${0.12 * alpha})`;
            ctx.lineWidth = 1 * alpha;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration);
    return () => clearTimeout(t);
  }, [onFinish, duration]);

  useEffect(() => {
    // schedule an exit animation to move the intro logo to the page logo
    const stagger = 0.25 + letters.length * 0.08 + 0.8; // matches per-letter timing
    const delay = (stagger + 0.25) * 1000; // small pause after reveal

    const id = setTimeout(() => {
      const target = document.getElementById('page-logo');
      const source = logoRef.current;
      if (!target || !source) {
        // simply fade out
        setStartExit(true);
        setExitTransform(null);
        setTimeout(() => onFinish && onFinish(), 900);
        return;
      }

      const s = source.getBoundingClientRect();
      const t = target.getBoundingClientRect();

      // Pin the source element to viewport absolute coordinates so transforms map exactly
      setPinnedStyle({
        position: 'fixed',
        left: `${s.left}px`,
        top: `${s.top}px`,
        width: `${s.width}px`,
        height: `${s.height}px`,
        margin: 0,
        transformOrigin: '50% 50%',
      });

      // compute center-to-center delta and scale so the source shrinks/moves to the
      // center of the target `#page-logo`. Clamp scale so we never grow the intro
      // (user requested it should only shrink), i.e. final scale <= 1.
      const sCenterX = s.left + s.width / 2;
      const sCenterY = s.top + s.height / 2;
      const tCenterX = t.left + t.width / 2;
      const tCenterY = t.top + t.height / 2;

      const dx = tCenterX - sCenterX;
      const dy = tCenterY - sCenterY;
      const rawScale = t.width / s.width || 1;
      const scale = Math.min(1, rawScale);

      setExitTransform({ x: dx, y: dy, scale });
      // start the exit animation next frame
      requestAnimationFrame(() => setStartExit(true));
    }, delay);

    return () => clearTimeout(id);
  }, []);

  const letters = 'KARNAK'.split('');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F0F]"
      animate={{ opacity: startExit ? 0 : 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.2 }}
      onAnimationComplete={() => {
        if (startExit) {
          onFinish && onFinish();
        }
      }}
    >
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        animate={{ opacity: startExit ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          ref={logoRef}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={
            startExit
              ? exitTransform
                ? { x: exitTransform.x, y: exitTransform.y, scale: exitTransform.scale }
                : { opacity: 0 }
              : undefined
          }
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (startExit) {
              onFinish && onFinish();
            }
          }}
          style={{ ...(pinnedStyle || {}), willChange: 'transform, opacity', transformOrigin: pinnedStyle?.transformOrigin ?? '50% 50%' }}
          className="flex items-center tracking-tight"
        >
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.08, ease: 'easeOut' }}
              className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight bg-gradient-to-br from-[#E8E8E8] to-[#FF6B35] bg-clip-text text-transparent"
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntroAnimation;

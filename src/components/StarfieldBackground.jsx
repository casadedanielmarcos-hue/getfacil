import { useEffect, useRef } from 'react';

export function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Create stars
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      opacity: Math.random(),
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      opacitySpeed: Math.random() * 0.006 + 0.002,
      isBlue: Math.random() > 0.65
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        // Move
        star.x += star.speedX;
        star.y += star.speedY;

        // Flicker
        star.opacity += star.opacitySpeed * star.opacityDir;
        if (star.opacity >= 1) { star.opacity = 1; star.opacityDir = -1; }
        if (star.opacity <= 0.05) { star.opacity = 0.05; star.opacityDir = 1; }

        // Wrap
        if (star.x < -5) star.x = canvas.width + 5;
        if (star.x > canvas.width + 5) star.x = -5;
        if (star.y < -5) star.y = canvas.height + 5;
        if (star.y > canvas.height + 5) star.y = -5;

        // Draw core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.isBlue
          ? `rgba(0, 212, 255, ${star.opacity * 0.85})`
          : `rgba(255, 255, 255, ${star.opacity * 0.7})`;
        ctx.fill();

        // Glow halo for larger stars
        if (star.size > 1.5) {
          const gradient = ctx.createRadialGradient(
            star.x, star.y, star.size,
            star.x, star.y, star.size * 4
          );
          const glowAlpha = star.opacity * 0.12;
          gradient.addColorStop(0, star.isBlue
            ? `rgba(0, 212, 255, ${glowAlpha})`
            : `rgba(255, 255, 255, ${glowAlpha})`);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
}

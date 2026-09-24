import React, { useEffect, useRef } from 'react';

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FadingVideo: React.FC<FadingVideoProps> = ({ src, className, style }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start video with initial opacity 0
    video.style.opacity = '0';
    fadingOutRef.current = false;

    const fadeTo = (targetOpacity: number, duration: number = 500) => {
      // Cancel previous transition animation if running
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Read current opacity directly from video element style
      const currentOpacityStr = video.style.opacity;
      const startOpacity = currentOpacityStr ? parseFloat(currentOpacityStr) : 0;
      const difference = targetOpacity - startOpacity;

      if (difference === 0) return;

      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = startOpacity + difference * progress;
        
        video.style.opacity = currentOpacity.toFixed(4);

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          rafIdRef.current = null;
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const handleLoadedData = () => {
      video.style.opacity = '0';
      fadingOutRef.current = false;
      video.play().catch((err) => {
        console.log('Video auto-play blocked or failed:', err);
      });
      fadeTo(1, 500);
    };

    const handleTimeUpdate = () => {
      const duration = video.duration;
      const currentTime = video.currentTime;
      if (isNaN(duration) || duration <= 0) return;

      const timeLeft = duration - currentTime;
      // If remaining time is less than or equal to 0.55s, trigger fade out
      if (!fadingOutRef.current && timeLeft <= 0.55 && timeLeft > 0) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      
      // Delay 100ms, then reset and replay
      setTimeout(() => {
        if (!videoRef.current) return;
        video.currentTime = 0;
        video.play()
          .then(() => {
            fadingOutRef.current = false;
            fadeTo(1, 500);
          })
          .catch((err) => {
            console.log('Video loop replay failed:', err);
          });
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Forces loading of the current video file
    video.load();

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ ...style }}
      muted
      playsInline
      autoPlay
      preload="auto"
    />
  );
};

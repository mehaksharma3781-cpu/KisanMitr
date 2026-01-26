import { useCallback, useRef } from 'react';

export const useClickSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playClickSound = useCallback(() => {
    try {
      // Create or reuse AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      // Create oscillator for a soft, pleasant tone
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Soft sine wave - gentle and non-intrusive
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.08);

      // Very low volume, quick fade
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(now);
      oscillator.stop(now + 0.1);
    } catch (e) {
      // Silently fail if audio not supported
      console.log('Audio not supported');
    }
  }, []);

  return { playClickSound };
};

// Standalone function for use without hook
let sharedAudioContext: AudioContext | null = null;

export const playClickSound = () => {
  try {
    if (!sharedAudioContext) {
      sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = sharedAudioContext;
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.08);

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  } catch (e) {
    // Silently fail
  }
};

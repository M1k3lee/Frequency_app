// Utility for managing background audio on mobile devices
// This is handled by Capacitor plugins in the native apps

export const requestWakeLock = async (): Promise<void> => {
  if ('wakeLock' in navigator) {
    try {
      await (navigator as any).wakeLock.request('screen');
      console.log('Wake lock acquired');
    } catch (err) {
      console.log('Wake lock not available:', err);
    }
  }
};

export const releaseWakeLock = async (): Promise<void> => {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = (navigator as any).wakeLock;
      if (wakeLock && wakeLock.active) {
        await wakeLock.release();
        console.log('Wake lock released');
      }
    } catch (err) {
      console.log('Error releasing wake lock:', err);
    }
  }
};


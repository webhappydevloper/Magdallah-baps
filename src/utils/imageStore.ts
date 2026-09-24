import { useState, useEffect } from 'react';

const STORAGE_KEY = 'swaminarayan_thakorji_custom_image_1335';
const DEFAULT_IMAGE = '/IMG_1335.jpeg';

// Event bus for instantaneous cross-component updates
const listeners = new Set<(img: string) => void>();

export function getThakorjiImage(): string {
  if (typeof window === 'undefined') return DEFAULT_IMAGE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.length > 50) {
      return saved;
    }
  } catch (err) {
    console.error('Failed to read image from localStorage', err);
  }
  return DEFAULT_IMAGE;
}

export function setThakorjiImage(imageDataUrl: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, imageDataUrl);
    listeners.forEach((listener) => listener(imageDataUrl));
  } catch (err) {
    console.error('Failed to save image to localStorage', err);
  }
}

export function resetThakorjiImage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    listeners.forEach((listener) => listener(DEFAULT_IMAGE));
  } catch (err) {
    console.error('Failed to reset image in localStorage', err);
  }
}

export function useThakorjiImage(): [string, (dataUrl: string) => void] {
  const [image, setImage] = useState<string>(getThakorjiImage);

  useEffect(() => {
    const handleUpdate = (newImage: string) => {
      setImage(newImage);
    };
    listeners.add(handleUpdate);

    // Also handle storage events from other tabs/windows
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setImage(e.newValue || DEFAULT_IMAGE);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      listeners.delete(handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return [image, setThakorjiImage];
}

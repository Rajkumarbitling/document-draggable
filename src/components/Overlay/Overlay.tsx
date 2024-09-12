import React, { useEffect, useCallback } from 'react';
import Image from '../Image/Image';
import './Overlay.css';
import { OverlayProps } from '../../types/App.types';

const Overlay: React.FC<OverlayProps> = React.memo(({ image, onClose, children }) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-image-container">
        {image && <Image src={image || ""} alt="Full view" className="overlay-image" />}
        {children}
      </div>
    </div>
  );
});

export default Overlay;
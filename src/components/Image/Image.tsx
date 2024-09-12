import React, { useState, memo } from 'react';
import './Image.css';
import { ImageProps } from '../../types/App.types';


const Image: React.FC<ImageProps> = memo(({ src, alt, onClick, className = '' }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`image-container ${className}`}>
      {loading && (
        <div className="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={loading ? 'hidden' : ''}
        onClick={onClick}
        onLoad={handleImageLoad}
      />
    </div>
  );
});

export default Image;

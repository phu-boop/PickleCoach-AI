import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc || 'https://via.placeholder.com/300x200/4F46E5/ffffff?text=Bài+Học+Pickleball');
    }
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', imgSrc);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageWithFallback;

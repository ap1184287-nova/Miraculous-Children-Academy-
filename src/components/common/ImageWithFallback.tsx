import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-royal-900 via-royal-800 to-royal-950 text-white p-6 text-center ${className}`}
      >
        <GraduationCap className="w-8 h-8 text-[#D4AF37] mb-2" aria-hidden="true" />
        <span className="font-display text-base font-semibold tracking-tight">
          {fallbackTitle || 'Miraculous Children Academy'}
        </span>
        <span className="text-xs text-slate-300 mt-1">CBSE Academic Campus</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

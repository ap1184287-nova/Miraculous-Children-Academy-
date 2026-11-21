import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import type { LanguageCode } from '../../types/school';

interface OfflineIndicatorProps {
  lang?: LanguageCode;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ lang = 'en' }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-royal-900 border border-[#D4AF37]/50 px-4 py-2.5 text-xs font-medium text-white shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
      <span>
        {lang === 'hi'
          ? 'ऑफ़लाइन मोड — सेव किया गया स्कूल पोर्टल सक्रिय है'
          : 'Offline Mode — Cached school portal view active'}
      </span>
    </div>
  );
};

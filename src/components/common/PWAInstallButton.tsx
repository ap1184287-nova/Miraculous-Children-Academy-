import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'light' | 'dark';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'light' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const buttonClasses =
    variant === 'dark'
      ? 'inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-white/25 text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer'
      : 'inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-royal-900/20 text-royal-900 bg-white hover:bg-royal-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer';

  if (isInstallable) {
    return (
      <button type="button" onClick={install} className={buttonClasses}>
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        Install Portal App
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={buttonClasses}
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Install on iOS
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          >
            <div className="w-full max-w-sm rounded-xl bg-white p-6 border border-slate-200 shadow-xl text-slate-900">
              <div className="flex items-start justify-between gap-4">
                <h3 id="ios-install-title" className="font-display text-lg font-semibold text-royal-900">
                  Install MCA Portal on iOS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close installation guide"
                  className="p-1 text-slate-500 hover:text-slate-900 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="mt-3 space-y-2 text-sm text-slate-600 list-decimal list-inside">
                <li>Tap the <strong>Share</strong> button in the Safari toolbar.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-royal-900 py-2.5 text-sm font-medium text-white hover:bg-royal-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

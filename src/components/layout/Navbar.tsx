import React, { useState } from 'react';
import { Globe, Lock, Menu, X } from 'lucide-react';
import { TRANSLATIONS } from '../../data/i18n';
import type { LanguageCode, PageId } from '../../types/school';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface NavbarProps {
  activePage: PageId;
  lang: LanguageCode;
  schoolName: string;
  onToggleLang: () => void;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  lang,
  schoolName,
  onToggleLang,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const NAV_LINKS: { id: PageId; label: string }[] = [
    { id: 'about', label: t.nav.about },
    { id: 'classes', label: t.nav.classes },
    { id: 'notices', label: t.nav.notices },
    { id: 'gallery', label: t.nav.gallery },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Strictly 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="text-left font-display text-lg sm:text-xl font-bold tracking-tight text-royal-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal-900 rounded"
          >
            {schoolName}
          </button>

          {/* Zone 2: 5 single-line navigation links */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNav(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal-900 rounded ${
                    isActive ? 'text-royal-900' : 'text-slate-600 hover:text-royal-900'
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#B88624] transition-transform duration-200 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary CTA + mobile drawer toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNav('portal')}
              className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wide rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-900 ${
                activePage === 'portal'
                  ? 'bg-[#B88624] text-white hover:bg-[#9E701B]'
                  : 'bg-royal-900 text-white hover:bg-royal-800'
              }`}
            >
              {t.nav.studentCorner}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-royal-900 hover:bg-royal-50 transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1 shadow-lg">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === 'home'
                  ? 'bg-royal-50 text-royal-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.nav.home}
            </button>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNav(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activePage === link.id
                    ? 'bg-royal-50 text-royal-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNav('portal')}
                className="w-full px-4 py-2.5 rounded-lg bg-royal-900 text-white text-sm font-semibold text-center hover:bg-royal-800"
              >
                {t.nav.studentCorner}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onToggleLang();
                    setMobileOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-300 text-royal-900 text-xs font-semibold hover:bg-slate-50"
                >
                  <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.utility.switchLang}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('admin')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#B88624]/40 text-royal-900 bg-[#FAF3E0] text-xs font-semibold hover:bg-[#FAF3E0]/80"
                >
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.nav.adminPanel}
                </button>
              </div>
              <div className="pt-1 flex justify-center">
                <PWAInstallButton />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Non-sticky Operational Utility Strip (Location, Bilingual Switcher, Admin Panel, PWA Install) */}
      <div className="bg-royal-950 text-slate-200 border-b border-[#D4AF37]/30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-300 font-medium">{t.utility.cbseLocation}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleLang}
              aria-label={lang === 'en' ? 'Switch language to Hindi' : 'Switch language to English'}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-white/25 text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
              {t.utility.switchLang}
            </button>
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold ${
                activePage === 'admin'
                  ? 'bg-[#B88624] border-[#D4AF37] text-white'
                  : 'border-[#D4AF37]/45 text-[#D4AF37] hover:bg-white/10'
              }`}
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              {t.utility.adminAccess}
            </button>
            <span className="hidden sm:inline-flex">
              <PWAInstallButton variant="dark" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

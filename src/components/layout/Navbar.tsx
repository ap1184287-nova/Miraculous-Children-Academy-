import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { PageId } from '../../types/school';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_LINKS: { id: PageId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'classes', label: 'Academics' },
  { id: 'notices', label: 'Notices' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="text-left font-display text-lg sm:text-xl font-bold tracking-tight text-[#0F2859] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2859] rounded"
        >
          Miraculous Children Academy
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNav(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F2859] rounded ${
                  isActive
                    ? 'text-[#0F2859]'
                    : 'text-slate-600 hover:text-[#0F2859]'
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

        {/* Zone 3: 1 primary action CTA on desktop + mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('portal')}
            className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wide rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2859] ${
              activePage === 'portal' || activePage === 'admin'
                ? 'bg-[#B88624] text-white hover:bg-[#9E701B]'
                : 'bg-[#0F2859] text-white hover:bg-[#17387A]'
            }`}
          >
            Student Portal
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-[#0F2859] hover:bg-[#F0F4FB] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1 shadow-lg">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              activePage === 'home'
                ? 'bg-[#F0F4FB] text-[#0F2859]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === link.id
                  ? 'bg-[#F0F4FB] text-[#0F2859]'
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
              className="w-full px-4 py-2.5 rounded-lg bg-[#0F2859] text-white text-sm font-semibold text-center hover:bg-[#17387A]"
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className="w-full px-4 py-2.5 rounded-lg border border-[#B88624]/40 text-[#0F2859] bg-[#FAF3E0] text-sm font-semibold text-center hover:bg-[#FAF3E0]/80"
            >
              Admin Dashboard (Demo)
            </button>
            <div className="pt-1 flex justify-center">
              <PWAInstallButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

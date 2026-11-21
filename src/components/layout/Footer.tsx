import React from 'react';
import { Clock, Mail } from 'lucide-react';
import type { PageId } from '../../types/school';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const go = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#09193A] text-slate-200 border-t border-[#D4AF37]/30 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* School Identity */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Miraculous Children Academy
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
              Co-educational CBSE institution committed to disciplined scholarship, character, and holistic development from Nursery to Class 10.
            </p>
            <div className="text-xs text-[#D4AF37] font-medium tracking-wide">
              CBSE Pattern · Nursery to Class 10 · Est. 2012
            </div>
            <div className="pt-1">
              <PWAInstallButton variant="dark" />
            </div>
          </div>

          {/* Institutional Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Institution</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button type="button" onClick={() => go('home')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('about')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  About School &amp; Principal&apos;s Desk
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('classes')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Classes Nursery to 10
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('notices')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  School Notices &amp; Circulars
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('gallery')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Campus Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Digital Portals */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Digital Portals</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button type="button" onClick={() => go('portal')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Student Portal (Auth-Gated Demo)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('portal')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Attendance &amp; Exam Results
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('admin')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Admin Dashboard (Demo)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('contact')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Admissions &amp; Contact Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Office */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Campus Office</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span>admissions@miraculousacademy.edu.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span className="tabular-nums">Mon–Sat · 08:30 AM – 03:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 Miraculous Children Academy · CBSE Pattern (Nursery – Class 10)
          </p>
          <p>
            Demo Portal Preview · Fictional Sample Student Records Only
          </p>
        </div>
      </div>
    </footer>
  );
};

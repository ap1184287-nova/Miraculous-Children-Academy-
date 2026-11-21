import React from 'react';
import { Clock, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { TRANSLATIONS } from '../../data/i18n';
import type { LanguageCode, PageId, SiteContentConfig } from '../../types/school';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface FooterProps {
  lang: LanguageCode;
  siteConfig: SiteContentConfig;
  onToggleLang: () => void;
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  siteConfig,
  onToggleLang,
  onNavigate,
}) => {
  const t = TRANSLATIONS[lang];
  const go = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-royal-950 text-slate-200 border-t border-[#D4AF37]/30 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* School Identity */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              {lang === 'hi' ? siteConfig.schoolNameHi : siteConfig.schoolName}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs">{t.footer.summary}</p>
            <div className="text-xs text-[#D4AF37] font-medium tracking-wide">
              {t.locationLine}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onToggleLang}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/25 text-xs font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                {t.utility.switchLang}
              </button>
              <PWAInstallButton variant="dark" />
            </div>
          </div>

          {/* School Sections */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {t.footer.institutionHeading}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => go('home')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('classes')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.nav.classes}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('notices')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.nav.notices}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('gallery')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.nav.gallery}
                </button>
              </li>
            </ul>
          </div>

          {/* Student & Admin Portals */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {t.footer.portalsHeading}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => go('portal')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.nav.studentCorner}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('admin')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.utility.adminAccess}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('contact')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Office */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {t.footer.officeHeading}
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{lang === 'hi' ? siteConfig.addressHi : siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span className="tabular-nums">{siteConfig.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span className="break-all">{siteConfig.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span className="tabular-nums">{siteConfig.officeHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.demoNote}</p>
        </div>
      </div>
    </footer>
  );
};

import React, { useEffect, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { TRANSLATIONS } from '../../data/i18n';
import type { GalleryCategory, GalleryItem, LanguageCode } from '../../types/school';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface GalleryPageProps {
  lang: LanguageCode;
  gallery: GalleryItem[];
}

const GALLERY_CATEGORIES: (GalleryCategory | 'All')[] = [
  'All',
  'School',
  'Events',
  'Sports & Cultural',
];

export const GalleryPage: React.FC<GalleryPageProps> = ({ lang, gallery }) => {
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useState<GalleryCategory | 'All'>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhoto(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const items =
    filter === 'All' ? gallery : gallery.filter((item) => item.category === filter);

  const getCategoryLabel = (cat: GalleryCategory | 'All') => {
    if (lang !== 'hi') return cat;
    if (cat === 'All') return 'सभी तस्वीरें';
    if (cat === 'School') return 'स्कूल परिसर';
    if (cat === 'Events') return 'कार्यक्रम';
    return 'खेलकूद एवं सांस्कृतिक';
  };

  return (
    <div className="bg-white text-slate-900">
      <section className="bg-royal-900 text-white py-14 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            {t.gallery.kicker}
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {t.gallery.title}
          </h1>
          <p className="mt-3 text-slate-200 text-base max-w-2xl leading-relaxed">
            {t.gallery.subtitle}
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div
          role="tablist"
          aria-label="Gallery category filter"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 border border-slate-200 w-fit"
        >
          {GALLERY_CATEGORIES.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'bg-royal-900 text-white shadow-sm' : 'text-slate-600 hover:text-royal-900'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <div className="p-10 rounded-xl border border-slate-200 bg-[#F8FAFC] text-center text-sm text-slate-600">
            {t.gallery.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePhoto(item)}
                className="group text-left rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-royal-900/45 transition-colors flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.title}
                    fallbackTitle={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <span className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-royal-900/85 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-medium text-[#9E701B]">
                      {item.category} · {item.aspectLabel}
                    </div>
                    <h2 className="mt-1 font-display text-lg font-bold text-royal-900">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
        >
          <div className="w-full max-w-4xl rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xl">
            <div className="aspect-[16/10] bg-slate-900 overflow-hidden">
              <ImageWithFallback
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                fallbackTitle={activePhoto.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#9E701B]">
                  {activePhoto.category} · {activePhoto.aspectLabel}
                </div>
                <h2 id="lightbox-title" className="mt-1 font-display text-xl font-bold text-royal-900">
                  {activePhoto.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{activePhoto.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                aria-label="Close photo preview"
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-royal-900 hover:bg-slate-50 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

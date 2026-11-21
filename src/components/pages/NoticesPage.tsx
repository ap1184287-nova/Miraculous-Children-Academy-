import React, { useState } from 'react';
import { CalendarDays, Pin, Search, X } from 'lucide-react';
import { TRANSLATIONS } from '../../data/i18n';
import type { LanguageCode, NoticeCategory, NoticeItem } from '../../types/school';
import { filterNotices } from '../../utils/schoolLogic';

interface NoticesPageProps {
  lang: LanguageCode;
  notices: NoticeItem[];
  selectedNotice: NoticeItem | null;
  onSelectNotice: (notice: NoticeItem | null) => void;
}

const CATEGORIES: (NoticeCategory | 'All')[] = [
  'All',
  'Holidays',
  'Examination',
  'Academic',
  'Circulars',
  'Events',
];

export const NoticesPage: React.FC<NoticesPageProps> = ({
  lang,
  notices,
  selectedNotice,
  onSelectNotice,
}) => {
  const t = TRANSLATIONS[lang];
  const [category, setCategory] = useState<NoticeCategory | 'All'>('All');
  const [searchText, setSearchText] = useState('');

  const visibleNotices = filterNotices(notices, category, searchText);

  return (
    <div className="bg-white text-slate-900">
      <section className="bg-royal-900 text-white py-14 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            {t.notices.kicker}
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {t.notices.title}
          </h1>
          <p className="mt-3 text-slate-200 text-base max-w-2xl leading-relaxed">
            {t.notices.subtitle}
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Notice category filter"
            className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 border border-slate-200"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'bg-royal-900 text-white shadow-sm' : 'text-slate-600 hover:text-royal-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-80">
            <label htmlFor="notice-search-input" className="sr-only">
              {t.notices.searchPlaceholder}
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              id="notice-search-input"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t.notices.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
            />
          </div>
        </div>

        {visibleNotices.length === 0 ? (
          <div className="p-10 rounded-xl border border-slate-200 bg-[#F8FAFC] text-center space-y-3">
            <CalendarDays className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-royal-900">
              {t.notices.noResults}
            </h2>
            <button
              type="button"
              onClick={() => {
                setCategory('All');
                setSearchText('');
              }}
              className="px-4 py-2 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
            >
              {t.notices.resetFilters}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
            {visibleNotices.map((notice) => (
              <div
                key={notice.id}
                className="p-6 hover:bg-[#F8FAFC] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {notice.isPinned && (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#9E701B]">
                        <Pin className="w-3 h-3" aria-hidden="true" />
                        Pinned
                      </span>
                    )}
                    {notice.isPinned && <span aria-hidden="true">·</span>}
                    <span className="font-semibold text-royal-900">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{notice.referenceNo}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{notice.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{notice.audience}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-royal-900">
                    {notice.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{notice.summary}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectNotice(notice)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-royal-900 hover:bg-royal-900 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start md:self-center"
                >
                  {t.notices.readCircular}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedNotice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
        >
          <div className="w-full max-w-xl rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-royal-900 text-white px-6 py-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[#D4AF37]">
                  {selectedNotice.referenceNo} · {selectedNotice.date}
                </div>
                <h2 id="notice-modal-title" className="mt-1 font-display text-xl font-bold">
                  {selectedNotice.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onSelectNotice(null)}
                aria-label="Close circular"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-500">
                Category: <strong className="text-royal-900">{selectedNotice.category}</strong> · Audience:{' '}
                <strong className="text-royal-900">{selectedNotice.audience}</strong>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {selectedNotice.body}
              </p>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Miraculous Children Academy · Nikhura, Buxar
                </span>
                <button
                  type="button"
                  onClick={() => onSelectNotice(null)}
                  className="px-4 py-2 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                >
                  {t.notices.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

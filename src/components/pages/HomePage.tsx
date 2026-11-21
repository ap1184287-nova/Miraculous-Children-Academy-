import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Compass,
  FileText,
  GraduationCap,
  Images,
  Lock,
  MapPin,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SCHOOL_FEATURES, SCHOOL_IMAGES } from '../../data/demoData';
import { TRANSLATIONS } from '../../data/i18n';
import type {
  GalleryItem,
  LanguageCode,
  NoticeItem,
  PageId,
  SiteContentConfig,
} from '../../types/school';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { SchoolCrest } from '../common/SchoolCrest';

interface HomePageProps {
  lang: LanguageCode;
  siteConfig: SiteContentConfig;
  notices: NoticeItem[];
  gallery: GalleryItem[];
  onNavigate: (page: PageId) => void;
  onSelectNotice: (notice: NoticeItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang,
  siteConfig,
  notices,
  gallery,
  onNavigate,
  onSelectNotice,
}) => {
  const t = TRANSLATIONS[lang];
  const featuredNotices = notices.slice(0, 4);
  const previewGallery = gallery.slice(0, 4);

  const IMPORTANT_LINKS: {
    id: PageId;
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'portal',
      titleEn: 'Student Corner & Study Material',
      titleHi: 'स्टूडेंट कॉर्नर व स्टडी मटेरियल',
      descEn: 'Notes, Worksheets, Sample Papers & Holiday Homework',
      descHi: 'कक्षा-वार नोट्स, सैंपल पेपर व हॉलिडे होमवर्क',
      icon: <FileText className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'classes',
      titleEn: 'Academics (Nursery – Class 10)',
      titleHi: 'कक्षाएं एवं विषय (नर्सरी – 10)',
      descEn: 'Class-wise CBSE syllabus, teachers & assessments',
      descHi: 'सभी कक्षाओं का पाठ्यक्रम और विषय जानकारी',
      icon: <GraduationCap className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'notices',
      titleEn: 'School Notice Board',
      titleHi: 'स्कूल सूचना पट्ट',
      descEn: 'Holidays, Exam timetable & official circulars',
      descHi: 'छुट्टियां, परीक्षा सूचना व जरूरी घोषणाएं',
      icon: <CalendarDays className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'gallery',
      titleEn: 'Campus & Event Gallery',
      titleHi: 'स्कूल एवं कार्यक्रम गैलरी',
      descEn: 'Photos of campus, sports & cultural functions',
      descHi: 'खेलकूद, विज्ञान प्रदर्शनी व स्कूल तस्वीरें',
      icon: <Images className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'contact',
      titleEn: 'Admissions & Nikhura Location',
      titleHi: 'प्रवेश एवं निखुरा (बक्सर) पता',
      descEn: 'Campus address, helpline & online contact form',
      descHi: 'स्कूल का पता, लोकेशन व ऑनलाइन संपर्क फॉर्म',
      icon: <MapPin className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'admin',
      titleEn: 'Admin Management Console',
      titleHi: 'सुरक्षित एडमिन डैशबोर्ड (डेमो)',
      descEn: 'Publish notices, homework, notes & photos',
      descHi: 'नोटिस, फोटो, होमवर्क और शिक्षकों का प्रबंधन',
      icon: <Lock className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  return (
    <div className="bg-white text-slate-900">
      {/* Hero Banner with Crest & Nikhura Buxar Campus */}
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center space-y-5"
            >
              <div className="flex items-center gap-3.5">
                <SchoolCrest className="w-12 h-12 shrink-0" />
                <div>
                  <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
                    {t.home.heroKicker}
                  </div>
                  <div className="text-sm font-semibold text-royal-900 mt-0.5">
                    {lang === 'hi' ? siteConfig.admissionsBannerHi : siteConfig.admissionsBanner}
                  </div>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-royal-900 leading-[1.15] text-balance">
                {lang === 'hi' ? siteConfig.heroTitleHi : siteConfig.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {lang === 'hi' ? siteConfig.heroSubtitleHi : siteConfig.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-royal-900 text-white text-sm font-semibold hover:bg-royal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                >
                  {t.home.ctaPrimary}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('classes')}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-slate-300 text-royal-900 text-sm font-semibold hover:bg-royal-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.home.ctaSecondary}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex"
            >
              <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm aspect-[16/10] lg:aspect-auto">
                <ImageWithFallback
                  src={SCHOOL_IMAGES.heroCampus}
                  alt="Miraculous Children Academy Nikhura Buxar Campus Building"
                  fallbackTitle="Miraculous Children Academy"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* 4-column Institutional Metrics Strip */}
          <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {lang === 'hi' ? 'शैक्षणिक बोर्ड' : 'Academic Framework'}
              </div>
              <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-royal-900">
                CBSE · NCERT
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {lang === 'hi' ? 'कक्षाएं' : 'Grade Span'}
              </div>
              <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-royal-900 tabular-nums">
                {lang === 'hi' ? 'नर्सरी – कक्षा 10' : 'Nursery – Class 10'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {lang === 'hi' ? 'स्थान' : 'Campus Location'}
              </div>
              <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-royal-900">
                {lang === 'hi' ? 'निखुरा, बक्सर, बिहार' : 'Nikhura, Buxar, Bihar'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {lang === 'hi' ? 'शिक्षण माध्यम' : 'Instruction Medium'}
              </div>
              <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-royal-900">
                {lang === 'hi' ? 'अंग्रेजी एवं हिंदी' : 'English & Hindi'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message & Latest News & Notices */}
      <section className="py-16 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Welcome Message */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
                {t.home.welcomeKicker}
              </div>
              <h2 className="font-display text-3xl font-bold text-royal-900 tracking-tight text-balance">
                {lang === 'hi' ? siteConfig.welcomeTitleHi : siteConfig.welcomeTitle}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {lang === 'hi' ? siteConfig.welcomeMessageHi : siteConfig.welcomeMessage}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-royal-900">
                <Compass className="w-4 h-4 text-[#9E701B]" aria-hidden="true" />
                <span>
                  {lang === 'hi'
                    ? 'अभिभावक एवं विद्यार्थी सुविधा'
                    : 'Zero-Budget Digital Portal & PWA'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'अध्ययन सामग्री, सैंपल पेपर और दैनिक होमवर्क देखने के लिए स्टूडेंट कॉर्नर का उपयोग करें।'
                  : 'Access daily homework, holiday assignments, printable notes, and CBSE exam updates right from your phone or computer.'}
              </p>
              <button
                type="button"
                onClick={() => onNavigate('portal')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal-900 hover:text-[#9E701B] cursor-pointer"
              >
                {t.home.ctaPrimary}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Latest News & Notices */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="w-5 h-5 text-[#9E701B]" aria-hidden="true" />
                  <h2 className="font-display text-2xl font-bold text-royal-900">
                    {t.home.noticesTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('notices')}
                  className="text-xs font-semibold text-royal-900 hover:text-[#9E701B] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.home.allNotices} ({notices.length})
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {featuredNotices.map((notice) => (
                  <div key={notice.id} className="py-4 first:pt-5 last:pb-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#9E701B]">{notice.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{notice.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{notice.audience}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectNotice(notice);
                        onNavigate('notices');
                      }}
                      className="mt-1.5 text-left text-base font-semibold text-royal-900 hover:text-royal-700 transition-colors cursor-pointer"
                    >
                      {notice.title}
                    </button>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{notice.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {lang === 'hi'
                  ? 'एडमिन पैनल द्वारा तुरंत अपडेट होने वाला नोटिस बोर्ड'
                  : 'Live synced with Admin Panel'}
              </span>
              <button
                type="button"
                onClick={() => onNavigate('notices')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal-900 hover:text-[#9E701B] cursor-pointer"
              >
                {t.home.openNoticeBoard}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* School Features / Highlights */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
              {t.home.featuresKicker}
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-royal-900 tracking-tight text-balance">
              {t.home.featuresTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('classes')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-900 hover:text-[#9E701B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.home.viewAllClasses}
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCHOOL_FEATURES.map((feat) => (
            <div
              key={feat.index}
              className="p-6 rounded-xl border border-slate-200 bg-white hover:border-royal-900/35 transition-colors"
            >
              <div className="text-xs font-mono font-semibold text-[#9E701B]">{feat.index}</div>
              <h3 className="mt-2.5 font-display text-xl font-bold text-royal-900">
                {lang === 'hi' ? feat.titleHi : feat.titleEn}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {lang === 'hi' ? feat.descriptionHi : feat.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Principal's Message & Campus Gallery Preview */}
      <section className="py-16 bg-[#F8FAFC] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
              {t.home.principalKicker}
            </div>
            <h2 className="font-display text-3xl font-bold text-royal-900 tracking-tight">
              {lang === 'hi'
                ? 'विद्यार्थियों के समग्र विकास का संकल्प'
                : 'A calm, purposeful learning community.'}
            </h2>
            <blockquote className="text-slate-700 leading-relaxed py-3 border-y border-slate-200 italic font-display text-lg">
              &ldquo;{lang === 'hi' ? siteConfig.principalMessageHi : siteConfig.principalMessage}&rdquo;
            </blockquote>
            <div className="text-sm">
              <div className="font-semibold text-royal-900">{siteConfig.principalName}</div>
              <div className="text-slate-500 text-xs">{siteConfig.principalQualification}</div>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-royal-900 hover:bg-royal-50 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                {t.home.aboutSchoolBtn}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B88624] text-white text-sm font-semibold hover:bg-[#9E701B] transition-colors cursor-pointer"
              >
                {t.home.admissionsBtn}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previewGallery.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate('gallery')}
                className="group text-left rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-royal-900/40 transition-colors cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.title}
                    fallbackTitle={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5">
                  <div className="text-xs text-[#9E701B] font-medium">{item.category}</div>
                  <div className="mt-0.5 text-sm font-semibold text-royal-900 truncate">
                    {item.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Important Quick Links Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-royal-900">
            {t.home.quickLinksTitle}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">{t.home.quickLinksSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {IMPORTANT_LINKS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-royal-900 hover:bg-[#F8FAFC] text-left transition-colors flex items-start gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-royal-900 text-[#D4AF37] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-royal-900">
                  {lang === 'hi' ? item.titleHi : item.titleEn}
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {lang === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

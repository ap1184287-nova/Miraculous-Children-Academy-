import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { NoticeItem, PageId } from '../../types/school';
import { GALLERY_ITEMS, SCHOOL_IMAGES } from '../../data/demoData';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface HomePageProps {
  notices: NoticeItem[];
  onNavigate: (page: PageId) => void;
  onSelectNotice: (notice: NoticeItem) => void;
}

const STAGES_PREVIEW = [
  {
    index: '01',
    title: 'Foundational Stage',
    classes: 'Nursery, LKG & UKG',
    summary:
      'Play-led Montessori literacy, bilingual phonics, sensory numeracy, and joyful social habits.',
  },
  {
    index: '02',
    title: 'Preparatory Stage',
    classes: 'Classes 1 to 5',
    summary:
      'Structured CBSE English, Hindi, Mathematics, EVS, and guided laboratory discovery.',
  },
  {
    index: '03',
    title: 'Middle Stage',
    classes: 'Classes 6 to 8',
    summary:
      'NCERT experiential Physics, Chemistry, Biology, Sanskrit, and Python computational foundations.',
  },
  {
    index: '04',
    title: 'Secondary Stage',
    classes: 'Classes 9 & 10',
    summary:
      'Focused CBSE AISSE board preparation with mentored mock clinics and practical portfolios.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  notices,
  onNavigate,
  onSelectNotice,
}) => {
  const featuredNotices = notices.slice(0, 3);

  return (
    <div className="bg-white text-slate-900">
      {/* Hero Section */}
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center space-y-6"
            >
              <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
                CBSE Affiliated Pattern · Nursery to Class 10
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#0F2859] leading-[1.12] text-balance">
                Disciplined scholarship and character for every growing mind.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Miraculous Children Academy blends CBSE academic rigour with calm, mentored classrooms from Nursery through Class 10—backed by a unified digital portal for families and faculty.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0F2859] text-white text-sm font-semibold hover:bg-[#17387A] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                >
                  Open Student Portal
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('classes')}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-slate-300 text-[#0F2859] text-sm font-semibold hover:bg-[#F0F4FB] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Explore Classes Nursery–10
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex"
            >
              <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm aspect-[16/10] lg:aspect-auto">
                <ImageWithFallback
                  src={SCHOOL_IMAGES.heroCampus}
                  alt="Miraculous Children Academy main sandstone and royal blue campus building"
                  fallbackTitle="Miraculous Children Academy Campus"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Full-width 4-column Institutional Metrics Strip */}
          <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-slate-500 font-medium">Academic Framework</div>
              <div className="mt-1 font-display text-2xl font-bold text-[#0F2859]">CBSE · NEP 2020</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Grade Span</div>
              <div className="mt-1 font-display text-2xl font-bold text-[#0F2859] tabular-nums">
                Nursery – Class 10
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Faculty Mentorship</div>
              <div className="mt-1 font-display text-2xl font-bold text-[#0F2859] tabular-nums">
                18 : 1 Ratio
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Class 10 Board Track</div>
              <div className="mt-1 font-display text-2xl font-bold text-[#0F2859] tabular-nums">
                100% Distinction Focus
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Stages Grid */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
              Academic Architecture
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#0F2859] tracking-tight text-balance">
              Four progressive stages from Nursery to Class 10
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('classes')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F2859] hover:text-[#9E701B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View full class curriculum
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES_PREVIEW.map((stage) => (
            <div
              key={stage.index}
              className="p-6 rounded-xl border border-slate-200 bg-white hover:border-[#0F2859]/35 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#9E701B] font-semibold">
                  <span>{stage.index}</span>
                  <span className="text-slate-500 font-sans">{stage.classes}</span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold text-[#0F2859]">
                  {stage.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {stage.summary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('classes')}
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0F2859] hover:text-[#9E701B] transition-colors cursor-pointer"
              >
                Explore subjects
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Digital Campus Portals & Notices Split */}
      <section className="py-16 bg-[#F8FAFC] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Digital Management Portals */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
                Digital School Management
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#0F2859] tracking-tight">
                Unified Student &amp; Faculty Portals
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Student academic profiles, attendance logs, and CBSE mark sheets are protected behind role-based access rather than exposed as a public directory.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0F2859] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#0F2859]">
                    Student &amp; Parent Portal
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Authenticated demo view with Roll Number, Class &amp; Section lookup, monthly attendance, and CBSE Term results.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('portal')}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2859] hover:text-[#9E701B] cursor-pointer"
                  >
                    Launch Student Portal
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FAF3E0] border border-[#D4AF37]/40 text-[#9E701B] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#0F2859]">
                    Admin Dashboard (Demo Preview)
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Interactive management console for demo attendance marking, student roster creation, and notice publishing.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('admin')}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E701B] hover:text-[#0F2859] cursor-pointer"
                  >
                    Open Admin Demo Console
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Latest School Notices */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="w-5 h-5 text-[#9E701B]" aria-hidden="true" />
                  <h2 className="font-display text-2xl font-bold text-[#0F2859]">
                    Official School Notices
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('notices')}
                  className="text-xs font-semibold text-[#0F2859] hover:text-[#9E701B] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  All notices ({notices.length})
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {featuredNotices.map((notice) => (
                  <div key={notice.id} className="py-4 first:pt-5 last:pb-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
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
                      className="mt-1.5 text-left text-base font-semibold text-[#0F2859] hover:text-[#1E4899] transition-colors cursor-pointer"
                    >
                      {notice.title}
                    </button>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                      {notice.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Circulars sync live with Admin Dashboard Demo
              </span>
              <button
                type="button"
                onClick={() => onNavigate('notices')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2859] hover:text-[#9E701B] cursor-pointer"
              >
                Open Notice Board
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Note & Campus Gallery Preview */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
              From the Principal&apos;s Desk
            </div>
            <h2 className="font-display text-3xl font-bold text-[#0F2859] tracking-tight">
              A calm, purposeful learning community.
            </h2>
            <blockquote className="text-base text-slate-600 leading-relaxed py-3 border-y border-slate-200 italic font-display text-lg">
              &ldquo;True education pairs intellectual curiosity with moral steadiness. From a child&apos;s first phonics circle in Nursery to their Class 10 CBSE board examination, every milestone is guided with personal care.&rdquo;
            </blockquote>
            <div className="text-sm">
              <div className="font-semibold text-[#0F2859]">Dr. Vasundhara Menon</div>
              <div className="text-slate-500 text-xs">Principal, Miraculous Children Academy</div>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-[#0F2859] hover:bg-[#F0F4FB] transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                About the School
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B88624] text-white text-sm font-semibold hover:bg-[#9E701B] transition-colors cursor-pointer"
              >
                Admissions Enquiry
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GALLERY_ITEMS.slice(1, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate('gallery')}
                className="group text-left rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-[#0F2859]/40 transition-colors cursor-pointer"
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
                  <div className="mt-0.5 text-sm font-semibold text-[#0F2859] truncate">
                    {item.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

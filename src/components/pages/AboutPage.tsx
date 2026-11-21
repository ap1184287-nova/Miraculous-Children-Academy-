import React from 'react';
import { Award, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import type { PageId } from '../../types/school';
import { SCHOOL_IMAGES } from '../../data/demoData';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-slate-900">
      <section className="bg-[#0F2859] text-white py-14 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            About Miraculous Children Academy
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl text-balance">
            Rooted in CBSE academic integrity, built for contemporary learners.
          </h1>
          <p className="mt-4 text-slate-200 text-base max-w-2xl leading-relaxed">
            Founded in 2012, Miraculous Children Academy serves families across Nursery to Class 10 with structured NCERT pedagogy, modern laboratories, and an ethos of quiet confidence.
          </p>
        </div>
      </section>

      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl border border-slate-200 bg-[#F8FAFC]">
            <Compass className="w-6 h-6 text-[#9E701B]" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-[#0F2859]">Our Vision</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              To cultivate curious, articulate, and ethically grounded young citizens equipped with strong foundational literacy, scientific reasoning, and civic empathy.
            </p>
          </div>
          <div className="p-8 rounded-xl border border-slate-200 bg-[#F8FAFC]">
            <Award className="w-6 h-6 text-[#9E701B]" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-[#0F2859]">Our Mission</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              To deliver the CBSE curriculum from Nursery to Class 10 in small, attentive sections (18:1 faculty ratio) combining laboratory experimentation, library inquiry, and athletics.
            </p>
          </div>
        </div>

        {/* Principal's Message & Campus Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] lg:aspect-auto">
            <ImageWithFallback
              src={SCHOOL_IMAGES.library}
              alt="Miraculous Children Academy Reference Library"
              fallbackTitle="Senior Reference Library"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <div className="text-xs font-semibold tracking-wide text-[#9E701B]">
              Academic Leadership
            </div>
            <h2 className="font-display text-3xl font-bold text-[#0F2859]">
              Principal&apos;s Desk
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At Miraculous Children Academy, every child is known by name, learning pace, and curiosity. Our faculty collaborates closely with families through transparent term portfolios, regular Parent–Teacher Conferences, and our digital parent-student portal.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              In alignment with NEP 2020 and CBSE competency frameworks, we balance conceptual depth in Mathematics, Languages, and Sciences with arts, debating, and inter-house athletics.
            </p>
            <div className="pt-2 border-t border-slate-200">
              <div className="font-semibold text-[#0F2859]">Dr. Vasundhara Menon</div>
              <div className="text-xs text-slate-500">M.Sc., Ph.D. (Education) · Principal</div>
            </div>
          </div>
        </div>

        {/* Institutional Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <BookOpen className="w-5 h-5 text-[#0F2859]" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg font-bold text-[#0F2859]">
              NCERT &amp; Competency Alignment
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Structured syllabus mapping across Foundational, Preparatory, Middle, and Secondary wings with periodic formative evaluations.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <ShieldCheck className="w-5 h-5 text-[#0F2859]" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg font-bold text-[#0F2859]">
              Protected Student Privacy
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Our digital management portal isolates personal attendance and examination records behind authenticated parent and faculty workflows.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <Award className="w-5 h-5 text-[#0F2859]" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg font-bold text-[#0F2859]">
              Co-Curricular Houses
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Students belong to Sapphire, Goldcrest, Emerald, or Crimson House for inter-house debates, science fairs, and athletics.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-xl bg-[#0F2859] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold">Interested in admissions for 2026–27?</h3>
            <p className="mt-1 text-sm text-slate-200">
              Explore class-wise curriculum from Nursery to Class 10 or schedule a campus visit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('classes')}
              className="px-5 py-2.5 rounded-lg bg-white text-[#0F2859] text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              View Classes
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-lg bg-[#B88624] text-white text-sm font-semibold hover:bg-[#9E701B] transition-colors cursor-pointer"
            >
              Contact Admissions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

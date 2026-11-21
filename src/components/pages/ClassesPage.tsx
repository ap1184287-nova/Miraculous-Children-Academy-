import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Users } from 'lucide-react';
import { CLASS_CURRICULUM_LIST } from '../../data/demoData';
import type { AcademicStageId, ClassLevel, PageId } from '../../types/school';

interface ClassesPageProps {
  onNavigate: (page: PageId) => void;
}

const STAGE_FILTERS: { id: AcademicStageId | 'all'; label: string }[] = [
  { id: 'all', label: 'All Classes (Nursery–10)' },
  { id: 'foundational', label: 'Foundational (Nursery–UKG)' },
  { id: 'preparatory', label: 'Preparatory (1–5)' },
  { id: 'middle', label: 'Middle (6–8)' },
  { id: 'secondary', label: 'Secondary (9–10)' },
];

export const ClassesPage: React.FC<ClassesPageProps> = ({ onNavigate }) => {
  const [stageFilter, setStageFilter] = useState<AcademicStageId | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('Class 10');

  const filteredClasses =
    stageFilter === 'all'
      ? CLASS_CURRICULUM_LIST
      : CLASS_CURRICULUM_LIST.filter((c) => c.stageId === stageFilter);

  const activeDetail =
    filteredClasses.find((c) => c.classLevel === selectedClass) ?? filteredClasses[0];

  return (
    <div className="bg-white text-slate-900">
      <section className="bg-[#0F2859] text-white py-14 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            CBSE Curriculum Directory
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Classes Nursery to Class 10
          </h1>
          <p className="mt-3 text-slate-200 text-base max-w-2xl leading-relaxed">
            Inspect subject syllabi, co-curricular tracks, and CBSE assessment schemes across every grade level from Nursery through Class 10.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Stage Filter Tabs */}
        <div
          role="tablist"
          aria-label="Academic stage filter"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 border border-slate-200 w-fit"
        >
          {STAGE_FILTERS.map((tab) => {
            const active = stageFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setStageFilter(tab.id);
                  const nextList =
                    tab.id === 'all'
                      ? CLASS_CURRICULUM_LIST
                      : CLASS_CURRICULUM_LIST.filter((c) => c.stageId === tab.id);
                  if (nextList.length > 0 && !nextList.some((c) => c.classLevel === selectedClass)) {
                    setSelectedClass(nextList[0].classLevel);
                  }
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#0F2859] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0F2859]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Two-column Grade Selector & Detail Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Class Selector Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
            {filteredClasses.map((item) => {
              const isSelected = activeDetail.classLevel === item.classLevel;
              return (
                <button
                  key={item.classLevel}
                  type="button"
                  onClick={() => setSelectedClass(item.classLevel)}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F2859] text-white border-[#0F2859]'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-[#0F2859]/40 hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="font-display text-lg font-bold">{item.classLevel}</div>
                  <div
                    className={`mt-1 text-xs ${
                      isSelected ? 'text-[#D4AF37]' : 'text-slate-500'
                    }`}
                  >
                    Age {item.ageGroup} · Sec {item.sections.join('/')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Class Detail */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <div className="text-xs font-semibold text-[#9E701B]">
                  {activeDetail.stageName}
                </div>
                <h2 className="mt-1 font-display text-3xl font-bold text-[#0F2859]">
                  {activeDetail.classLevel}
                </h2>
              </div>
              <div className="text-xs text-slate-600 space-y-1 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5 font-medium text-[#0F2859]">
                  <Users className="w-3.5 h-3.5 text-[#9E701B]" aria-hidden="true" />
                  <span>Sections: {activeDetail.sections.join(', ')}</span>
                </div>
                <div>Recommended Age: {activeDetail.ageGroup}</div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {activeDetail.focusSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-[#0F2859] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#9E701B]" aria-hidden="true" />
                  Core CBSE Subjects
                </h3>
                <ul className="mt-3 space-y-2">
                  {activeDetail.coreSubjects.map((subj) => (
                    <li
                      key={subj}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-[#0F2859] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{subj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0F2859]">
                  Co-Curricular &amp; Activity Tracks
                </h3>
                <ul className="mt-3 space-y-2">
                  {activeDetail.coCurriculars.map((act) => (
                    <li
                      key={act}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full bg-[#B88624] shrink-0 mt-2"
                      />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-500">Assessment Pattern</div>
                <div className="text-sm font-medium text-[#0F2859] mt-0.5">
                  {activeDetail.assessmentPattern}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-lg bg-[#0F2859] text-white text-xs font-semibold hover:bg-[#17387A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Enquire for {activeDetail.classLevel}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

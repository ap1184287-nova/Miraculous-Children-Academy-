import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ClipboardList, FileText, Users } from 'lucide-react';
import { TRANSLATIONS } from '../../data/i18n';
import type {
  AcademicStageId,
  ClassCurriculum,
  ClassLevel,
  HomeworkItem,
  LanguageCode,
  PageId,
  StudyMaterialItem,
} from '../../types/school';

interface ClassesPageProps {
  lang: LanguageCode;
  classes: ClassCurriculum[];
  homework: HomeworkItem[];
  materials: StudyMaterialItem[];
  onNavigate: (page: PageId) => void;
}

export const ClassesPage: React.FC<ClassesPageProps> = ({
  lang,
  classes,
  homework,
  materials,
  onNavigate,
}) => {
  const t = TRANSLATIONS[lang];
  const [stageFilter, setStageFilter] = useState<AcademicStageId | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('Class 10');

  const STAGE_FILTERS: { id: AcademicStageId | 'all'; label: string }[] =
    lang === 'hi'
      ? [
          { id: 'all', label: 'सभी कक्षाएं (नर्सरी–10)' },
          { id: 'foundational', label: 'फाउंडेशनल (नर्सरी–UKG)' },
          { id: 'preparatory', label: 'प्राइमरी (कक्षा 1–5)' },
          { id: 'middle', label: 'मिडिल (कक्षा 6–8)' },
          { id: 'secondary', label: 'सेकेंडरी (कक्षा 9–10)' },
        ]
      : [
          { id: 'all', label: 'All Classes (Nursery–10)' },
          { id: 'foundational', label: 'Foundational (Nursery–UKG)' },
          { id: 'preparatory', label: 'Preparatory (1–5)' },
          { id: 'middle', label: 'Middle (6–8)' },
          { id: 'secondary', label: 'Secondary (9–10)' },
        ];

  const filteredClasses =
    stageFilter === 'all' ? classes : classes.filter((c) => c.stageId === stageFilter);

  const activeDetail =
    filteredClasses.find((c) => c.classLevel === selectedClass) ?? filteredClasses[0];

  const classHomework = homework.filter((h) => h.classLevel === activeDetail.classLevel);
  const classMaterials = materials.filter((m) => m.classLevel === activeDetail.classLevel);

  return (
    <div className="bg-white text-slate-900">
      <section className="bg-royal-900 text-white py-14 border-b border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            {t.classes.kicker}
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {t.classes.title}
          </h1>
          <p className="mt-3 text-slate-200 text-base max-w-2xl leading-relaxed">
            {t.classes.subtitle}
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
                    tab.id === 'all' ? classes : classes.filter((c) => c.stageId === tab.id);
                  if (nextList.length > 0 && !nextList.some((c) => c.classLevel === selectedClass)) {
                    setSelectedClass(nextList[0].classLevel);
                  }
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'bg-royal-900 text-white shadow-sm' : 'text-slate-600 hover:text-royal-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

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
                      ? 'bg-royal-900 text-white border-royal-900'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-royal-900/40 hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="font-display text-lg font-bold">{item.classLevel}</div>
                  <div className={`mt-1 text-xs ${isSelected ? 'text-[#D4AF37]' : 'text-slate-500'}`}>
                    {item.ageGroup} · Sec {item.sections.join('/')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Class Detail */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="text-xs font-semibold text-[#9E701B]">
                    {activeDetail.stageName}
                  </div>
                  <h2 className="mt-1 font-display text-3xl font-bold text-royal-900">
                    {activeDetail.classLevel}
                  </h2>
                </div>
                <div className="text-xs text-slate-600 space-y-1 sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1.5 font-medium text-royal-900">
                    <Users className="w-3.5 h-3.5 text-[#9E701B]" aria-hidden="true" />
                    <span>Sections: {activeDetail.sections.join(', ')}</span>
                  </div>
                  <div>
                    {t.classes.classTeacher}: <strong>{activeDetail.classTeacher}</strong>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {activeDetail.focusSummary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-royal-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#9E701B]" aria-hidden="true" />
                    {t.classes.coreSubjects}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {activeDetail.coreSubjects.map((subj) => (
                      <li key={subj} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2
                          className="w-4 h-4 text-royal-900 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{subj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-royal-900">
                    {t.classes.coCurriculars}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {activeDetail.coCurriculars.map((act) => (
                      <li key={act} className="flex items-start gap-2 text-sm text-slate-700">
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
                  <div className="text-xs font-semibold text-slate-500">
                    {t.classes.assessmentPattern}
                  </div>
                  <div className="text-sm font-medium text-royal-900 mt-0.5">
                    {activeDetail.assessmentPattern}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('portal')}
                    className="px-4 py-2.5 rounded-lg border border-royal-900 text-royal-900 text-xs font-semibold hover:bg-royal-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.classes.openStudentCorner}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="px-4 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.classes.enquireFor}
                  </button>
                </div>
              </div>
            </div>

            {/* Linked Class Homework & Study Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-royal-900 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-[#9E701B]" aria-hidden="true" />
                    {t.classes.linkedHomework}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    {classHomework.length}
                  </span>
                </div>
                {classHomework.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    {lang === 'hi'
                      ? 'इस कक्षा के लिए नया होमवर्क जल्द जोड़ा जाएगा।'
                      : 'No active homework posted for this class yet.'}
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100 text-xs">
                    {classHomework.map((hw) => (
                      <li key={hw.id} className="py-2.5 first:pt-0 last:pb-0">
                        <div className="font-semibold text-royal-900">
                          {hw.subject} · {hw.title}
                        </div>
                        <p className="text-slate-600 mt-0.5">{hw.description}</p>
                        <div className="text-[11px] text-[#9E701B] mt-1 tabular-nums">
                          Due {hw.dueDate}
                          {hw.isHolidayHomework ? ' · Holiday Work' : ''}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-royal-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#9E701B]" aria-hidden="true" />
                    {t.classes.linkedMaterials}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    {classMaterials.length}
                  </span>
                </div>
                {classMaterials.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    {lang === 'hi'
                      ? 'सभी कक्षाओं की सामग्री स्टूडेंट कॉर्नर में उपलब्ध है।'
                      : 'Browse all study resources inside Student Corner.'}
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100 text-xs">
                    {classMaterials.map((mat) => (
                      <li key={mat.id} className="py-2.5 first:pt-0 last:pb-0">
                        <div className="font-semibold text-royal-900">
                          {lang === 'hi' ? mat.titleHi || mat.title : mat.title}
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          {mat.subject} · {mat.updatedDate}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

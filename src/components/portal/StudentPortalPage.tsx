import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  KeyRound,
  Lock,
  LogOut,
  Printer,
  Search,
  ShieldAlert,
  UserCheck,
  X,
} from 'lucide-react';
import {
  ALL_CLASS_LEVELS,
  ALL_SECTIONS,
  CBSE_GRADING_SCALE,
  EXAM_CALENDAR_ROWS,
} from '../../data/demoData';
import { TRANSLATIONS } from '../../data/i18n';
import type {
  ClassLevel,
  HomeworkItem,
  LanguageCode,
  PageId,
  Section,
  StudentRecord,
  StudyMaterialItem,
  StudyMaterialKind,
} from '../../types/school';
import {
  buildPrintableTextDownload,
  computeAttendanceSummary,
  computeExamSummary,
  filterHomework,
  filterStudyMaterials,
  findDemoStudent,
  validateStudentSearchQuery,
} from '../../utils/schoolLogic';

interface StudentPortalPageProps {
  lang: LanguageCode;
  students: StudentRecord[];
  materials: StudyMaterialItem[];
  homework: HomeworkItem[];
  onNavigate: (page: PageId) => void;
}

type CornerSection = 'materials' | 'homework' | 'papers' | 'exams' | 'lookup';
type PortalSubTab = 'profile' | 'attendance' | 'results';

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({
  lang,
  students,
  materials,
  homework,
  onNavigate,
}) => {
  const t = TRANSLATIONS[lang];
  const [cornerTab, setCornerTab] = useState<CornerSection>('materials');

  // Materials / Papers state
  const [classFilter, setClassFilter] = useState<ClassLevel | 'All'>('All');
  const [materialKindFilter, setMaterialKindFilter] = useState<StudyMaterialKind | 'All'>('All');
  const [materialSearch, setMaterialSearch] = useState('');
  const [readingMaterial, setReadingMaterial] = useState<StudyMaterialItem | null>(null);

  // Homework state
  const [hwClassFilter, setHwClassFilter] = useState<ClassLevel | 'All'>('All');
  const [hwMode, setHwMode] = useState<'all' | 'daily' | 'holiday'>('all');

  // Auth-gated Demo Student Lookup state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [rollNumber, setRollNumber] = useState('101');
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('Class 10');
  const [section, setSection] = useState<Section | ''>('A');
  const [searchErrors, setSearchErrors] = useState<{
    rollNumber?: string;
    classLevel?: string;
    section?: string;
  }>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(students[0] ?? null);
  const [activeTab, setActiveTab] = useState<PortalSubTab>('profile');
  const [selectedTermIndex, setSelectedTermIndex] = useState(0);

  const handleDownloadMaterial = (item: StudyMaterialItem) => {
    const text = buildPrintableTextDownload(item);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.classLevel.replace(/\s+/g, '_')}_${item.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredMaterials = filterStudyMaterials(
    materials.filter((m) => m.kind !== 'sample-paper'),
    classFilter,
    materialKindFilter === 'sample-paper' ? 'All' : materialKindFilter,
    materialSearch
  );

  const filteredPapers = filterStudyMaterials(
    materials,
    classFilter,
    'sample-paper',
    materialSearch
  );

  const visibleHomework = filterHomework(homework, hwClassFilter, hwMode);

  const handleUnlockDemo = () => {
    setIsUnlocked(true);
    if (!activeStudent && students.length > 0) {
      setActiveStudent(students[0]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateStudentSearchQuery({ rollNumber, classLevel, section });
    if (!validation.valid) {
      setSearchErrors(validation.errors);
      return;
    }
    setSearchErrors({});
    setHasSearched(true);
    const matched = findDemoStudent(students, { rollNumber, classLevel, section });
    setActiveStudent(matched);
    setSelectedTermIndex(0);
  };

  const handleQuickFill = (student: StudentRecord) => {
    setRollNumber(student.rollNumber);
    setClassLevel(student.classLevel);
    setSection(student.section);
    setSearchErrors({});
    setHasSearched(true);
    setActiveStudent(student);
    setSelectedTermIndex(0);
  };

  const attendanceSummary = activeStudent ? computeAttendanceSummary(activeStudent.attendance) : null;
  const activeExam =
    activeStudent && activeStudent.exams.length > 0
      ? activeStudent.exams[selectedTermIndex] ?? activeStudent.exams[0]
      : null;
  const examSummary = activeExam ? computeExamSummary(activeExam.subjects) : null;

  const CORNER_TABS: { id: CornerSection; label: string; icon: React.ReactNode }[] = [
    { id: 'materials', label: t.studentCorner.tabs.materials, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'homework', label: t.studentCorner.tabs.homework, icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'papers', label: t.studentCorner.tabs.papers, icon: <FileText className="w-4 h-4" /> },
    { id: 'exams', label: t.studentCorner.tabs.exams, icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'lookup', label: t.studentCorner.tabs.studentLookup, icon: <UserCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-14rem)] pb-16">
      {/* Header Banner */}
      <section className="bg-royal-900 text-white py-12 border-b border-[#D4AF37]/40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
            {t.studentCorner.kicker}
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {t.studentCorner.title}
          </h1>
          <p className="mt-3 text-slate-200 text-base max-w-2xl leading-relaxed">
            {t.studentCorner.subtitle}
          </p>

          {/* Primary Student Corner Navigation Tabs */}
          <div
            role="tablist"
            aria-label="Student Corner sections"
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            {CORNER_TABS.map((tab) => {
              const active = cornerTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCornerTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#B88624] text-white shadow-sm'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* TAB 1: STUDY MATERIALS & WORKSHEETS */}
        {cornerTab === 'materials' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label htmlFor="mat-class-filter" className="sr-only">
                    {t.studentCorner.filterClass}
                  </label>
                  <select
                    id="mat-class-filter"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value as ClassLevel | 'All')}
                    className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="All">{t.studentCorner.allClasses}</option>
                    {ALL_CLASS_LEVELS.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
                  {(
                    [
                      { id: 'All', labelEn: 'All Notes & Sheets', labelHi: 'सभी सामग्री' },
                      { id: 'material', labelEn: 'Study Notes', labelHi: 'नोट्स' },
                      { id: 'worksheet', labelEn: 'Worksheets', labelHi: 'वर्कशीट' },
                    ] as const
                  ).map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setMaterialKindFilter(k.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        materialKindFilter === k.id
                          ? 'bg-royal-900 text-white'
                          : 'text-slate-600 hover:text-royal-900'
                      }`}
                    >
                      {lang === 'hi' ? k.labelHi : k.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full lg:w-72">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  placeholder={t.studentCorner.searchPlaceholder}
                  aria-label={t.studentCorner.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            {filteredMaterials.length === 0 ? (
              <div className="p-10 rounded-xl bg-white border border-slate-200 text-center text-sm text-slate-600">
                {lang === 'hi'
                  ? 'इस फ़िल्टर के लिए कोई स्टडी मटेरियल नहीं मिला।'
                  : 'No study materials match your selected class or search.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-[#9E701B]">{item.classLevel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.kind === 'worksheet' ? 'Worksheet' : 'Notes'}</span>
                      </div>
                      <h2 className="mt-2 font-display text-lg font-bold text-royal-900">
                        {lang === 'hi' ? item.titleHi || item.title : item.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.summary}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setReadingMaterial(item)}
                        className="px-3.5 py-2 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                      >
                        {t.studentCorner.readOnline}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadMaterial(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-royal-900 hover:bg-royal-50 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        {t.studentCorner.downloadNote}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HOMEWORK & HOLIDAY HOMEWORK */}
        {cornerTab === 'homework' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  aria-label={t.studentCorner.filterClass}
                  value={hwClassFilter}
                  onChange={(e) => setHwClassFilter(e.target.value as ClassLevel | 'All')}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="All">{t.studentCorner.allClasses}</option>
                  {ALL_CLASS_LEVELS.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
                  {(
                    [
                      { id: 'all', label: t.studentCorner.allHomework },
                      { id: 'daily', label: t.studentCorner.dailyHomework },
                      { id: 'holiday', label: t.studentCorner.holidayHomework },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setHwMode(m.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        hwMode === m.id
                          ? 'bg-royal-900 text-white'
                          : 'text-slate-600 hover:text-royal-900'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {visibleHomework.length} {lang === 'hi' ? 'असाइनमेंट' : 'assignments'}
              </span>
            </div>

            {visibleHomework.length === 0 ? (
              <div className="p-10 rounded-xl bg-white border border-slate-200 text-center text-sm text-slate-600">
                {lang === 'hi'
                  ? 'चयनित कक्षा के लिए कोई होमवर्क नहीं मिला।'
                  : 'No homework entries match this filter.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {visibleHomework.map((hw) => (
                  <div
                    key={hw.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-royal-900">{hw.classLevel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{hw.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#9E701B]">
                          {hw.isHolidayHomework
                            ? t.studentCorner.holidayHomework
                            : t.studentCorner.dailyHomework}
                        </span>
                      </div>
                      <h2 className="font-display text-lg font-bold text-royal-900">{hw.title}</h2>
                      <p className="text-sm text-slate-600">{hw.description}</p>
                    </div>
                    <div className="text-xs text-slate-600 md:text-right shrink-0 tabular-nums space-y-1">
                      <div>Assigned: {hw.assignedDate}</div>
                      <div className="font-semibold text-royal-900">Due: {hw.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAMPLE QUESTION PAPERS */}
        {cornerTab === 'papers' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <select
                aria-label={t.studentCorner.filterClass}
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value as ClassLevel | 'All')}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="All">{t.studentCorner.allClasses}</option>
                {ALL_CLASS_LEVELS.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500">
                {lang === 'hi'
                  ? 'सीबीएसई पैटर्न मॉडल प्रश्न-पत्र व अभ्यास सेट'
                  : 'CBSE pattern practice & pre-board sample papers'}
              </span>
            </div>

            {filteredPapers.length === 0 ? (
              <div className="p-10 rounded-xl bg-white border border-slate-200 text-center text-sm text-slate-600">
                {lang === 'hi'
                  ? 'इस कक्षा के लिए सैंपल पेपर जल्द जोड़े जाएंगे।'
                  : 'No sample papers found for the selected class.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-semibold text-[#9E701B]">{paper.classLevel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{paper.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{paper.updatedDate}</span>
                      </div>
                      <h2 className="mt-2 font-display text-xl font-bold text-royal-900">
                        {lang === 'hi' ? paper.titleHi || paper.title : paper.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">{paper.summary}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setReadingMaterial(paper)}
                        className="px-4 py-2 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                      >
                        {t.studentCorner.readOnline}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadMaterial(paper)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-royal-900 hover:bg-royal-50 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        {t.studentCorner.downloadNote}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: EXAM INFORMATION & CBSE GRADING */}
        {cornerTab === 'exams' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-6 rounded-xl bg-white border border-slate-200 space-y-4">
              <h2 className="font-display text-2xl font-bold text-royal-900">
                {t.studentCorner.examInfoTitle}
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Examination</th>
                      <th className="py-3 px-4">Classes</th>
                      <th className="py-3 px-4">Schedule Window</th>
                      <th className="py-3 px-4">Pattern</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {EXAM_CALENDAR_ROWS.map((row) => (
                      <tr key={row.exam} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-royal-900">{row.exam}</td>
                        <td className="py-3 px-4 text-slate-700">{row.classes}</td>
                        <td className="py-3 px-4 font-mono text-xs tabular-nums text-slate-700">
                          {row.window}
                        </td>
                        <td className="py-3 px-4 text-xs text-[#9E701B] font-medium">
                          {row.weightage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-xl bg-white border border-slate-200 space-y-4">
              <h2 className="font-display text-2xl font-bold text-royal-900">
                {t.studentCorner.examGradingTitle}
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-2.5 px-4">Marks %</th>
                      <th className="py-2.5 px-4">Grade</th>
                      <th className="py-2.5 px-4">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {CBSE_GRADING_SCALE.map((g) => (
                      <tr key={g.grade}>
                        <td className="py-2.5 px-4 font-mono tabular-nums text-slate-700">
                          {g.range}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-royal-900">{g.grade}</td>
                        <td className="py-2.5 px-4 text-xs text-slate-600">{g.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUTH-GATED DEMO STUDENT LOOKUP */}
        {cornerTab === 'lookup' && !isUnlocked && (
          <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-royal-900 text-white px-6 sm:px-8 py-6 border-b border-[#D4AF37]/40">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#D4AF37]">
                <Lock className="w-4 h-4" aria-hidden="true" />
                Protected Student Records (Demo)
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold">
                {lang === 'hi'
                  ? 'छात्र प्रोफ़ाइल, उपस्थिति एवं परिणाम पोर्टल'
                  : 'Student Profile, Attendance & Exam Results'}
              </h2>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-xl bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#9E701B] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-slate-800 leading-relaxed">
                  <strong>{lang === 'hi' ? 'गोपनीयता सुरक्षा:' : 'Privacy Notice:'}</strong>{' '}
                  {lang === 'hi'
                    ? 'वास्तविक विद्यार्थियों का निजी डेटा सार्वजनिक नहीं किया गया है। नीचे केवल काल्पनिक डेमो छात्र रिकॉर्ड दिए गए हैं।'
                    : 'No real student PII is exposed publicly. This demo uses strictly fictional sample records.'}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleUnlockDemo}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-royal-900 text-white text-sm font-semibold hover:bg-royal-800 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                  {lang === 'hi' ? 'डेमो छात्र पोर्टल खोलें' : 'Enter Demo Student Portal'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-300 text-royal-900 text-sm font-semibold hover:bg-royal-50 transition-colors cursor-pointer"
                >
                  {t.utility.adminAccess}
                </button>
              </div>
            </div>
          </div>
        )}

        {cornerTab === 'lookup' && isUnlocked && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-royal-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
              <div>
                <div className="text-xs text-[#D4AF37] font-semibold">
                  Fictional Demo Records Only · Session 2026–2027
                </div>
                <div className="font-display text-xl font-bold">
                  Student Lookup, Attendance &amp; Mark Sheets
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B88624] text-white text-xs font-semibold hover:bg-[#9E701B] cursor-pointer self-start sm:self-center"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                Lock Demo View
              </button>
            </div>

            {/* Search Form */}
            <section
              aria-label="Student record lookup"
              className="p-6 rounded-xl bg-white border border-slate-200 print:hidden"
            >
              <form
                onSubmit={handleSearch}
                noValidate
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start"
              >
                <div>
                  <label htmlFor="search-class" className="block text-xs font-semibold text-royal-900 mb-1.5">
                    Class
                  </label>
                  <select
                    id="search-class"
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as ClassLevel | '')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="">Select Class</option>
                    {ALL_CLASS_LEVELS.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  {searchErrors.classLevel && (
                    <p className="mt-1 text-xs text-red-700">{searchErrors.classLevel}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="search-section" className="block text-xs font-semibold text-royal-900 mb-1.5">
                    Section
                  </label>
                  <select
                    id="search-section"
                    value={section}
                    onChange={(e) => setSection(e.target.value as Section | '')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="">Select Section</option>
                    {ALL_SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                  {searchErrors.section && (
                    <p className="mt-1 text-xs text-red-700">{searchErrors.section}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="search-roll" className="block text-xs font-semibold text-royal-900 mb-1.5">
                    Roll Number
                  </label>
                  <input
                    id="search-roll"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                  {searchErrors.rollNumber && (
                    <p className="mt-1 text-xs text-red-700">{searchErrors.rollNumber}</p>
                  )}
                </div>

                <div className="sm:pt-[22px]">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-royal-900 text-white text-sm font-semibold hover:bg-royal-800 cursor-pointer"
                  >
                    <Search className="w-4 h-4" aria-hidden="true" />
                    Find Demo Record
                  </button>
                </div>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500 mr-1">Demo Presets:</span>
                {students.map((student) => (
                  <button
                    key={student.studentId}
                    type="button"
                    onClick={() => handleQuickFill(student)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                      activeStudent?.studentId === student.studentId
                        ? 'bg-royal-900 text-white border-royal-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-royal-900/40'
                    }`}
                  >
                    {student.classLevel} ({student.section}) · #{student.rollNumber} {student.fullName}
                  </button>
                ))}
              </div>
            </section>

            {!activeStudent && hasSearched && (
              <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-2">
                <AlertCircle className="w-7 h-7 text-[#9E701B] mx-auto" aria-hidden="true" />
                <h3 className="font-display text-xl font-bold text-royal-900">
                  No Matching Demo Student Found
                </h3>
                <p className="text-sm text-slate-600">
                  Try one of the preset demo buttons above.
                </p>
              </div>
            )}

            {activeStudent && attendanceSummary && (
              <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
                <div className="bg-royal-900 text-white px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-royal-800 border border-[#D4AF37]/50 flex items-center justify-center font-display text-xl font-bold text-[#D4AF37] shrink-0">
                      {activeStudent.fullName
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <div className="text-xs text-[#D4AF37] font-mono">
                        {activeStudent.studentId} · DEMO PROFILE
                      </div>
                      <h3 className="font-display text-2xl font-bold">{activeStudent.fullName}</h3>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {activeStudent.classLevel} · Section {activeStudent.section} · Roll{' '}
                        <span className="font-mono">{activeStudent.rollNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <div className="text-slate-400">Attendance</div>
                      <div className="font-mono text-lg font-bold tabular-nums">
                        {attendanceSummary.percentage}%
                      </div>
                    </div>
                    {examSummary && (
                      <div>
                        <div className="text-slate-400">Latest Term</div>
                        <div className="font-mono text-lg font-bold text-[#D4AF37] tabular-nums">
                          {examSummary.percentage}% ({examSummary.overallGrade})
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  role="tablist"
                  className="px-6 py-3 bg-[#F8FAFC] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden"
                >
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'profile'}
                      onClick={() => setActiveTab('profile')}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeTab === 'profile'
                          ? 'bg-royal-900 text-white'
                          : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      Profile &amp; ID
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'attendance'}
                      onClick={() => setActiveTab('attendance')}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeTab === 'attendance'
                          ? 'bg-royal-900 text-white'
                          : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      Attendance
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'results'}
                      onClick={() => setActiveTab('results')}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeTab === 'results'
                          ? 'bg-royal-900 text-white'
                          : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
                      Exam Results
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-royal-900 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                    Print
                  </button>
                </div>

                {activeTab === 'profile' && (
                  <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <dl className="lg:col-span-7 divide-y divide-slate-100 border-y border-slate-200 text-sm">
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500">Student ID</dt>
                        <dd className="col-span-2 font-mono font-semibold text-royal-900">
                          {activeStudent.studentId}
                        </dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500">Class &amp; Section</dt>
                        <dd className="col-span-2">
                          {activeStudent.classLevel} — Section {activeStudent.section}
                        </dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500">Class Teacher</dt>
                        <dd className="col-span-2">{activeStudent.classTeacher}</dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500">Guardian (Demo)</dt>
                        <dd className="col-span-2">{activeStudent.guardianName}</dd>
                      </div>
                    </dl>
                    <div className="lg:col-span-5 rounded-xl border border-royal-900/20 bg-[#F8FAFC] overflow-hidden">
                      <div className="bg-royal-900 px-5 py-4 text-white flex items-center justify-between">
                        <div>
                          <div className="font-display text-base font-bold">
                            Miraculous Children Academy
                          </div>
                          <div className="text-[11px] text-[#D4AF37]">
                            Nikhura, Buxar · Student ID (Demo)
                          </div>
                        </div>
                        <Award className="w-5 h-5 text-[#D4AF37]" aria-hidden="true" />
                      </div>
                      <div className="p-5 space-y-2 text-xs">
                        <div className="font-display text-lg font-bold text-royal-900">
                          {activeStudent.fullName}
                        </div>
                        <div className="font-mono text-slate-700">ID: {activeStudent.studentId}</div>
                        <div className="text-slate-600">
                          {activeStudent.classLevel} ({activeStudent.section}) · Roll #{activeStudent.rollNumber} ·{' '}
                          {activeStudent.house} House
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'attendance' && (
                  <div className="p-6 sm:p-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                          <th className="py-3 px-4">Month</th>
                          <th className="py-3 px-4 text-right">Working Days</th>
                          <th className="py-3 px-4 text-right">Present</th>
                          <th className="py-3 px-4 text-right">Absent</th>
                          <th className="py-3 px-4 text-right">%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeStudent.attendance.map((row) => {
                          const pct =
                            row.workingDays > 0
                              ? Math.round((row.presentDays / row.workingDays) * 1000) / 10
                              : 0;
                          return (
                            <tr key={row.month}>
                              <td className="py-3 px-4 font-medium text-royal-900">{row.month}</td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums">
                                {row.workingDays}
                              </td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
                                {row.presentDays}
                              </td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums">
                                {row.absentDays}
                              </td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold">
                                {pct.toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'results' && activeExam && examSummary && (
                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-display text-lg font-bold text-royal-900">
                          {activeExam.termName}
                        </h4>
                        <div className="text-xs text-slate-500">
                          Published {activeExam.publishedDate}
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {activeStudent.exams.map((term, idx) => (
                          <button
                            key={term.termId}
                            type="button"
                            onClick={() => setSelectedTermIndex(idx)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                              idx === selectedTermIndex
                                ? 'bg-royal-900 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {term.termName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                            <th className="py-3 px-4">Subject</th>
                            <th className="py-3 px-4 text-right">Theory</th>
                            <th className="py-3 px-4 text-right">Internal</th>
                            <th className="py-3 px-4 text-right">Total</th>
                            <th className="py-3 px-4 text-right">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {examSummary.rows.map((row) => (
                            <tr key={row.code}>
                              <td className="py-3 px-4 font-medium text-royal-900">{row.subject}</td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums">
                                {row.theoryMarks} / {row.theoryMax}
                              </td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums">
                                {row.internalMarks} / {row.internalMax}
                              </td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold">
                                {row.totalMarks} / {row.totalMax}
                              </td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-[#9E701B]">
                                {row.grade}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-royal-50 border-t border-slate-200 font-semibold text-royal-900">
                            <td colSpan={3} className="py-3 px-4">
                              Aggregate Result ({examSummary.passedAll ? 'PASS' : 'REVIEW'})
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums">
                              {examSummary.totalObtained} / {examSummary.totalMax}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-[#9E701B]">
                              {examSummary.percentage.toFixed(1)}% ({examSummary.overallGrade})
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Study Material Reader Modal */}
      {readingMaterial && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="material-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4"
        >
          <div className="w-full max-w-2xl rounded-xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-royal-900 text-white px-6 py-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[#D4AF37]">
                  {readingMaterial.classLevel} · {readingMaterial.subject} · {readingMaterial.updatedDate}
                </div>
                <h2 id="material-modal-title" className="mt-1 font-display text-xl font-bold">
                  {lang === 'hi'
                    ? readingMaterial.titleHi || readingMaterial.title
                    : readingMaterial.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setReadingMaterial(null)}
                aria-label="Close material reader"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">{readingMaterial.summary}</p>
              <pre className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-80 overflow-y-auto">
                {readingMaterial.content}
              </pre>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">Faculty: {readingMaterial.author}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadMaterial(readingMaterial)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-royal-900 text-xs font-semibold text-royal-900 hover:bg-royal-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    {t.studentCorner.downloadNote}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadingMaterial(null)}
                    className="px-4 py-2 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                  >
                    {t.notices.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  CalendarCheck,
  FileSpreadsheet,
  KeyRound,
  Lock,
  LogOut,
  Printer,
  Search,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { ALL_CLASS_LEVELS, ALL_SECTIONS } from '../../data/demoData';
import type { ClassLevel, PageId, Section, StudentRecord } from '../../types/school';
import {
  computeAttendanceSummary,
  computeExamSummary,
  findDemoStudent,
  validateStudentSearchQuery,
} from '../../utils/schoolLogic';

interface StudentPortalPageProps {
  students: StudentRecord[];
  onNavigate: (page: PageId) => void;
}

type PortalSubTab = 'profile' | 'attendance' | 'results';

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({
  students,
  onNavigate,
}) => {
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
  const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(
    students[0] ?? null
  );
  const [activeTab, setActiveTab] = useState<PortalSubTab>('profile');
  const [selectedTermIndex, setSelectedTermIndex] = useState(0);

  const handleUnlockDemo = () => {
    setIsUnlocked(true);
    if (!activeStudent && students.length > 0) {
      setActiveStudent(students[0]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateStudentSearchQuery({
      rollNumber,
      classLevel,
      section,
    });
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

  if (!isUnlocked) {
    return (
      <div className="bg-[#F8FAFC] min-h-[calc(100vh-14rem)] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="bg-[#0F2859] text-white px-6 sm:px-8 py-6 border-b border-[#D4AF37]/40">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#D4AF37]">
              <Lock className="w-4 h-4" aria-hidden="true" />
              Protected Student Portal
            </div>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold">
              Parent &amp; Student Academic Access
            </h1>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-4 rounded-xl bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#9E701B] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm text-slate-800 leading-relaxed">
                <strong>Privacy &amp; Security Notice:</strong> Student records are not exposed as a public database. In production, this portal enforces authenticated sign-in via Firebase Authentication and guardian-scoped Firestore security rules.
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                To inspect the student search, profile ID card, monthly attendance register, and CBSE term mark sheets, start a <strong>Demo Portal Session</strong> using fictional sample records only.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleUnlockDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0F2859] text-white text-sm font-semibold hover:bg-[#17387A] transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                Enter Demo Student Portal
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-300 text-[#0F2859] text-sm font-semibold hover:bg-[#F0F4FB] transition-colors cursor-pointer"
              >
                Open Admin Dashboard (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const attendanceSummary = activeStudent
    ? computeAttendanceSummary(activeStudent.attendance)
    : null;
  const activeExam =
    activeStudent && activeStudent.exams.length > 0
      ? activeStudent.exams[selectedTermIndex] ?? activeStudent.exams[0]
      : null;
  const examSummary = activeExam ? computeExamSummary(activeExam.subjects) : null;

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-14rem)] pb-16">
      {/* Portal Session Strip */}
      <div className="bg-[#0F2859] text-white border-b border-[#D4AF37]/40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
              Authenticated Demo Session · Fictional Sample Data Only
            </div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold">
              Student Academic Portal
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 rounded-lg border border-white/25 text-xs font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Admin Dashboard (Demo)
            </button>
            <button
              type="button"
              onClick={() => setIsUnlocked(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B88624] text-white text-xs font-semibold hover:bg-[#9E701B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              Lock Demo Session
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Student Search Card */}
        <section
          aria-label="Student record lookup"
          className="p-6 rounded-xl bg-white border border-slate-200 print:hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0F2859]">
                Search Student by Roll Number, Class &amp; Section
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Look up fictional demo student profiles, attendance logs, and CBSE examination mark sheets.
              </p>
            </div>
            <span className="text-xs font-mono text-[#9E701B]">
              Session 2026–2027
            </span>
          </div>

          <form onSubmit={handleSearch} noValidate className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            <div>
              <label htmlFor="search-class" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                Class
              </label>
              <select
                id="search-class"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value as ClassLevel | '')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
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
              <label htmlFor="search-section" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                Section
              </label>
              <select
                id="search-section"
                value={section}
                onChange={(e) => setSection(e.target.value as Section | '')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
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
              <label htmlFor="search-roll" className="block text-xs font-semibold text-[#0F2859] mb-1.5">
                Roll Number
              </label>
              <input
                id="search-roll"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 101"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F2859]/25 focus:border-[#0F2859]"
              />
              {searchErrors.rollNumber && (
                <p className="mt-1 text-xs text-red-700">{searchErrors.rollNumber}</p>
              )}
            </div>

            <div className="sm:pt-[22px]">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F2859] text-white text-sm font-semibold hover:bg-[#17387A] transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                Find Student Record
              </button>
            </div>
          </form>

          {/* Quick-Select Demo Student Presets */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">
              Quick Demo Records:
            </span>
            {students.map((student) => {
              const selected = activeStudent?.studentId === student.studentId;
              return (
                <button
                  key={student.studentId}
                  type="button"
                  onClick={() => handleQuickFill(student)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#0F2859] text-white border-[#0F2859]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0F2859]/40'
                  }`}
                >
                  {student.classLevel} · {student.section} · Roll {student.rollNumber} ({student.fullName})
                </button>
              );
            })}
          </div>
        </section>

        {/* Empty / Not Found State */}
        {!activeStudent && hasSearched && (
          <div className="p-10 rounded-xl bg-white border border-slate-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#9E701B] mx-auto" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-[#0F2859]">
              No Matching Demo Student Found
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              No fictional record matched <strong>{classLevel || '—'}</strong> · Section{' '}
              <strong>{section || '—'}</strong> · Roll <strong>{rollNumber || '—'}</strong>. Try one of the quick demo records above or add a new demo student in the Admin Dashboard.
            </p>
          </div>
        )}

        {/* Active Demo Student Profile & Sub-Tabs */}
        {activeStudent && attendanceSummary && (
          <div className="space-y-6">
            {/* Student ID Banner Card */}
            <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
              <div className="bg-[#0F2859] text-white px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#17387A] border border-[#D4AF37]/50 flex items-center justify-center font-display text-xl font-bold text-[#D4AF37] shrink-0">
                    {activeStudent.fullName
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className="text-xs text-[#D4AF37] font-mono">
                      STUDENT ID: {activeStudent.studentId} · FICTIONAL DEMO PROFILE
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white mt-0.5">
                      {activeStudent.fullName}
                    </h2>
                    <div className="text-xs text-slate-300 mt-1">
                      {activeStudent.classLevel} · Section {activeStudent.section} · Roll No.{' '}
                      <span className="font-mono tabular-nums">{activeStudent.rollNumber}</span> ·{' '}
                      {activeStudent.house} House
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-200">
                  <div>
                    <div className="text-slate-400">Attendance</div>
                    <div className="font-mono text-lg font-bold text-white tabular-nums">
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

              {/* Sub-Navigation Tabs */}
              <div
                role="tablist"
                aria-label="Student portal sections"
                className="px-6 py-3 bg-[#F8FAFC] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-[#0F2859] text-white'
                        : 'text-slate-600 hover:text-[#0F2859] hover:bg-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    Student Profile &amp; ID
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'attendance'}
                    onClick={() => setActiveTab('attendance')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'attendance'
                        ? 'bg-[#0F2859] text-white'
                        : 'text-slate-600 hover:text-[#0F2859] hover:bg-white'
                    }`}
                  >
                    <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    Attendance Register
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'results'}
                    onClick={() => setActiveTab('results')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'results'
                        ? 'bg-[#0F2859] text-white'
                        : 'text-slate-600 hover:text-[#0F2859] hover:bg-white'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
                    Examination &amp; Results
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-[#0F2859] hover:bg-slate-50 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  Print Summary
                </button>
              </div>

              {/* Tab 1: Profile & Student ID */}
              {activeTab === 'profile' && (
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#0F2859]">
                        Academic &amp; Identity Record
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Demo student record formatted for CBSE school administration.
                      </p>
                    </div>

                    <dl className="divide-y divide-slate-100 border-y border-slate-200 text-sm">
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500 font-medium">Student ID</dt>
                        <dd className="col-span-2 font-mono font-semibold text-[#0F2859]">
                          {activeStudent.studentId}
                        </dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500 font-medium">Class &amp; Section</dt>
                        <dd className="col-span-2 font-medium text-slate-900">
                          {activeStudent.classLevel} — Section {activeStudent.section}
                        </dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500 font-medium">Roll Number</dt>
                        <dd className="col-span-2 font-mono tabular-nums text-slate-900">
                          {activeStudent.rollNumber}
                        </dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500 font-medium">Academic Session</dt>
                        <dd className="col-span-2 tabular-nums text-slate-900">
                          {activeStudent.academicSession} (CBSE)
                        </dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500 font-medium">Class Teacher</dt>
                        <dd className="col-span-2 text-slate-900">{activeStudent.classTeacher}</dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500 font-medium">Guardian (Demo)</dt>
                        <dd className="col-span-2 text-slate-900">
                          {activeStudent.guardianName} ·{' '}
                          <span className="font-mono text-xs text-slate-500">
                            {activeStudent.guardianContactMasked}
                          </span>
                        </dd>
                      </div>
                      <div className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-slate-500 font-medium">Date of Birth</dt>
                        <dd className="col-span-2 tabular-nums text-slate-900">
                          {activeStudent.dateOfBirthMasked}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Digital Student ID Card Preview */}
                  <div className="lg:col-span-5">
                    <div className="rounded-xl border border-[#0F2859]/20 bg-[#F8FAFC] overflow-hidden">
                      <div className="bg-[#0F2859] px-5 py-4 text-white flex items-center justify-between">
                        <div>
                          <div className="font-display text-base font-bold">
                            Miraculous Children Academy
                          </div>
                          <div className="text-[11px] text-[#D4AF37]">
                            CBSE Student Identity Card (Demo)
                          </div>
                        </div>
                        <Award className="w-5 h-5 text-[#D4AF37]" aria-hidden="true" />
                      </div>
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="text-xs text-slate-500">Student Name</div>
                          <div className="font-display text-xl font-bold text-[#0F2859]">
                            {activeStudent.fullName}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-slate-500">Student ID</div>
                            <div className="font-mono font-semibold text-slate-900 mt-0.5">
                              {activeStudent.studentId}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500">Class / Roll</div>
                            <div className="font-semibold text-slate-900 mt-0.5 tabular-nums">
                              {activeStudent.classLevel} ({activeStudent.section}) · #{activeStudent.rollNumber}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500">School House</div>
                            <div className="font-semibold text-[#9E701B] mt-0.5">
                              {activeStudent.house} House
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500">Valid Session</div>
                            <div className="font-semibold text-slate-900 mt-0.5 tabular-nums">
                              {activeStudent.academicSession}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Attendance Section */}
              {activeTab === 'attendance' && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#0F2859]">
                        Academic Attendance Register
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        CBSE requires minimum 75% attendance for annual examination eligibility.
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-[#0F2859]">
                      Eligibility Status:{' '}
                      <span
                        className={
                          attendanceSummary.percentage >= 75
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }
                      >
                        {attendanceSummary.percentage >= 75
                          ? 'Eligible (Above 75%)'
                          : 'Below Threshold'}
                      </span>
                    </div>
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC]">
                      <div className="text-xs text-slate-500">Overall Attendance</div>
                      <div className="mt-1 font-mono text-2xl font-bold text-[#0F2859] tabular-nums">
                        {attendanceSummary.percentage}%
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC]">
                      <div className="text-xs text-slate-500">Days Present</div>
                      <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 tabular-nums">
                        {attendanceSummary.totalPresent} / {attendanceSummary.totalWorkingDays}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC]">
                      <div className="text-xs text-slate-500">Unexcused Absent</div>
                      <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
                        {attendanceSummary.totalAbsent} Days
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC]">
                      <div className="text-xs text-slate-500">Approved Leave</div>
                      <div className="mt-1 font-mono text-2xl font-bold text-[#9E701B] tabular-nums">
                        {attendanceSummary.totalLeave} Days
                      </div>
                    </div>
                  </div>

                  {/* Monthly Table */}
                  {activeStudent.attendance.length === 0 ? (
                    <div className="p-8 rounded-xl border border-slate-200 bg-[#F8FAFC] text-center text-sm text-slate-600">
                      No monthly attendance logs recorded yet for this newly created demo student.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                            <th className="py-3 px-4">Month</th>
                            <th className="py-3 px-4 text-right">Working Days</th>
                            <th className="py-3 px-4 text-right">Present</th>
                            <th className="py-3 px-4 text-right">Absent</th>
                            <th className="py-3 px-4 text-right">Leave</th>
                            <th className="py-3 px-4 text-right">Attendance %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeStudent.attendance.map((row) => {
                            const pct =
                              row.workingDays > 0
                                ? Math.round((row.presentDays / row.workingDays) * 1000) / 10
                                : 0;
                            return (
                              <tr key={row.month} className="hover:bg-slate-50">
                                <td className="py-3 px-4 font-medium text-[#0F2859]">
                                  {row.month}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                                  {row.workingDays}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700 font-medium">
                                  {row.presentDays}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                                  {row.absentDays}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                                  {row.leaveDays}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#0F2859]">
                                  <div className="inline-flex items-center gap-2.5 justify-end">
                                    <span className="hidden sm:inline-block w-20 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                      <span
                                        className="block h-full bg-[#0F2859] rounded-full"
                                        style={{ width: `${Math.min(100, pct)}%` }}
                                      />
                                    </span>
                                    <span>{pct.toFixed(1)}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Examination & Results Section */}
              {activeTab === 'results' && (
                <div className="p-6 sm:p-8 space-y-6">
                  {activeStudent.exams.length === 0 || !activeExam || !examSummary ? (
                    <div className="p-8 rounded-xl border border-slate-200 bg-[#F8FAFC] text-center text-sm text-slate-600">
                      No examination records published yet for this demo student.
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl font-bold text-[#0F2859]">
                            {activeExam.termName}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Published {activeExam.publishedDate} · CBSE 8-Point Grading Scale (A1–E)
                          </p>
                        </div>

                        {/* Term Selector */}
                        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200">
                          {activeStudent.exams.map((term, idx) => (
                            <button
                              key={term.termId}
                              type="button"
                              onClick={() => setSelectedTermIndex(idx)}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                idx === selectedTermIndex
                                  ? 'bg-[#0F2859] text-white'
                                  : 'text-slate-600 hover:text-[#0F2859]'
                              }`}
                            >
                              {term.termName}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Marks Table */}
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                              <th className="py-3 px-4">Code</th>
                              <th className="py-3 px-4">Subject</th>
                              <th className="py-3 px-4 text-right">Theory</th>
                              <th className="py-3 px-4 text-right">Internal / Practical</th>
                              <th className="py-3 px-4 text-right">Total</th>
                              <th className="py-3 px-4 text-right">%</th>
                              <th className="py-3 px-4 text-right">CBSE Grade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {examSummary.rows.map((row) => (
                              <tr key={row.code} className="hover:bg-slate-50">
                                <td className="py-3 px-4 font-mono text-xs text-slate-500">
                                  {row.code}
                                </td>
                                <td className="py-3 px-4 font-medium text-[#0F2859]">
                                  {row.subject}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                                  {row.theoryMarks} / {row.theoryMax}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                                  {row.internalMarks} / {row.internalMax}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                                  {row.totalMarks} / {row.totalMax}
                                </td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                                  {row.percentage.toFixed(1)}%
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-[#9E701B]">
                                  {row.grade}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-[#F0F4FB] border-t border-slate-200 font-semibold text-[#0F2859]">
                              <td colSpan={4} className="py-3.5 px-4">
                                Aggregate Score &amp; Result Status:{' '}
                                <span className="text-emerald-700">
                                  {examSummary.passedAll ? 'PASS / PROMOTED' : 'COMPARTMENT REVIEW'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                {examSummary.totalObtained} / {examSummary.totalMax}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                {examSummary.percentage.toFixed(1)}%
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono text-[#9E701B]">
                                {examSummary.overallGrade}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-slate-700">
                        <span className="font-semibold text-[#0F2859]">Class Teacher Remarks: </span>
                        {activeExam.teacherRemarks}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

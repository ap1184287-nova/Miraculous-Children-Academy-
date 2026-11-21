import React, { useState } from 'react';
import {
  BellPlus,
  CalendarCheck,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  LayoutDashboard,
  ShieldAlert,
  UserPlus,
  Users,
} from 'lucide-react';
import { ALL_CLASS_LEVELS, ALL_SECTIONS } from '../../data/demoData';
import { FIREBASE_READINESS_PLAN } from '../../services/repository';
import type {
  ClassLevel,
  DailyAttendanceStatus,
  NoticeCategory,
  NoticeItem,
  PageId,
  Section,
  StudentRecord,
} from '../../types/school';
import { computeAttendanceSummary, computeExamSummary } from '../../utils/schoolLogic';

interface AdminDashboardPageProps {
  students: StudentRecord[];
  notices: NoticeItem[];
  onAddStudent: (student: StudentRecord) => void;
  onAddNotice: (notice: NoticeItem) => void;
  onUpdateStudentMark: (
    studentId: string,
    termId: string,
    subjectCode: string,
    newTheoryMarks: number
  ) => void;
  onNavigate: (page: PageId) => void;
}

type AdminSection =
  | 'overview'
  | 'students'
  | 'attendance'
  | 'notices'
  | 'results'
  | 'firebase';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  students,
  notices,
  onAddStudent,
  onAddNotice,
  onUpdateStudentMark,
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  // Add Demo Student Form State
  const [newName, setNewName] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newClass, setNewClass] = useState<ClassLevel>('Class 6');
  const [newSection, setNewSection] = useState<Section>('A');
  const [newHouse, setNewHouse] = useState<StudentRecord['house']>('Sapphire');
  const [studentMessage, setStudentMessage] = useState<string | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);

  // Daily Attendance Marker State (demo session)
  const [dailyStatuses, setDailyStatuses] = useState<Record<string, DailyAttendanceStatus>>(() =>
    Object.fromEntries(students.map((s) => [s.studentId, 'Present']))
  );

  // Notice Publisher Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>('Academic');
  const [noticeAudience, setNoticeAudience] = useState('Nursery to Class 10');
  const [noticeSummary, setNoticeSummary] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeStatus, setNoticeStatus] = useState<string | null>(null);
  const [noticeError, setNoticeError] = useState<string | null>(null);

  // Result Editor State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId ?? '');

  const avgAttendance =
    students.length > 0
      ? Math.round(
          (students.reduce(
            (sum, s) => sum + computeAttendanceSummary(s.attendance).percentage,
            0
          ) /
            students.length) *
            10
        ) / 10
      : 0;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedRoll = newRoll.trim();
    if (trimmedName.length < 2 || !trimmedRoll) {
      setStudentError('Enter both a fictional student name and a roll number.');
      setStudentMessage(null);
      return;
    }
    const duplicate = students.some(
      (s) =>
        s.rollNumber.toLowerCase() === trimmedRoll.toLowerCase() &&
        s.classLevel === newClass &&
        s.section === newSection
    );
    if (duplicate) {
      setStudentError(
        `Roll ${trimmedRoll} already exists in ${newClass} Section ${newSection}.`
      );
      setStudentMessage(null);
      return;
    }

    const codePrefix = newClass.replace('Class ', '').replace(/\s+/g, '').slice(0, 3).toUpperCase();
    const generatedId = `MCA-2026-${codePrefix}${newSection}-${trimmedRoll.padStart(4, '0')}`;

    const newRecord: StudentRecord = {
      studentId: generatedId,
      rollNumber: trimmedRoll,
      classLevel: newClass,
      section: newSection,
      fullName: trimmedName,
      academicSession: '2026–2027',
      house: newHouse,
      classTeacher: 'Demo Faculty Coordinator',
      guardianName: `${trimmedName.split(' ')[0]} Guardian (Demo)`,
      guardianContactMasked: 'Verified Guardian Account (Demo)',
      dateOfBirthMasked: '10 May 2014',
      isDemoRecord: true,
      attendance: [
        { month: 'November', workingDays: 16, presentDays: 15, absentDays: 1, leaveDays: 0 },
      ],
      exams: [
        {
          termId: 'half-yearly',
          termName: 'Half-Yearly Examination (Term 1)',
          publishedDate: '18 Oct 2026',
          teacherRemarks: 'Newly added fictional demo student profile.',
          subjects: [
            { code: 'ENG', subject: 'English', theoryMarks: 68, theoryMax: 80, internalMarks: 18, internalMax: 20 },
            { code: 'MAT', subject: 'Mathematics', theoryMarks: 72, theoryMax: 80, internalMarks: 19, internalMax: 20 },
            { code: 'SCI', subject: 'Science', theoryMarks: 70, theoryMax: 80, internalMarks: 18, internalMax: 20 },
          ],
        },
      ],
    };

    onAddStudent(newRecord);
    setDailyStatuses((prev) => ({ ...prev, [newRecord.studentId]: 'Present' }));
    setStudentError(null);
    setStudentMessage(
      `Added ${newRecord.fullName} (${newRecord.studentId}). Now searchable in Student Portal.`
    );
    setNewName('');
    setNewRoll('');
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (noticeTitle.trim().length < 5 || noticeSummary.trim().length < 10) {
      setNoticeError('Provide a clear circular title (min 5 chars) and summary (min 10 chars).');
      setNoticeStatus(null);
      return;
    }

    const created: NoticeItem = {
      id: `notice-${Date.now()}`,
      referenceNo: `MCA/CIR/2026-${Math.floor(115 + Math.random() * 80)}`,
      title: noticeTitle.trim(),
      category: noticeCategory,
      date: '20 Nov 2026',
      audience: noticeAudience.trim() || 'All Students',
      summary: noticeSummary.trim(),
      body: noticeBody.trim() || noticeSummary.trim(),
      isPinned: true,
    };

    onAddNotice(created);
    setNoticeError(null);
    setNoticeStatus(`Published "${created.title}" to the live School Notices page.`);
    setNoticeTitle('');
    setNoticeSummary('');
    setNoticeBody('');
  };

  const presentCount = Object.values(dailyStatuses).filter((v) => v === 'Present').length;
  const absentCount = Object.values(dailyStatuses).filter((v) => v === 'Absent').length;
  const leaveCount = Object.values(dailyStatuses).filter((v) => v === 'Leave').length;

  const editedStudent =
    students.find((s) => s.studentId === selectedStudentId) ?? students[0] ?? null;
  const editedExam = editedStudent?.exams[0] ?? null;
  const editedExamSummary = editedExam ? computeExamSummary(editedExam.subjects) : null;

  const SIDEBAR_ITEMS: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Student Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance Register', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'notices', label: 'Notice Publisher', icon: <BellPlus className="w-4 h-4" /> },
    { id: 'results', label: 'Results & Grades', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'firebase', label: 'Firebase Readiness', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-14rem)]">
      {/* Mandatory DEMO Banner */}
      <div className="bg-[#FAF3E0] border-b border-[#D4AF37]/50 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-900">
          <div className="flex items-start sm:items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#9E701B] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            <span>
              <strong className="text-[#0F2859]">DEMO ADMIN DASHBOARD:</strong> Sample fictional records only. Configure Firebase Authentication &amp; role-based Security Rules before production deployment.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('portal')}
            className="text-[#0F2859] font-semibold underline hover:text-[#9E701B] whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
          >
            Switch to Student Portal
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside aria-label="Admin dashboard navigation" className="lg:col-span-3 space-y-2">
          <div className="p-4 rounded-xl bg-[#0F2859] text-white mb-4">
            <div className="text-xs font-semibold tracking-wide text-[#D4AF37]">
              Admin Console · Demo
            </div>
            <div className="font-display text-lg font-bold mt-0.5">
              Miraculous Children Academy
            </div>
          </div>

          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#0F2859] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-[#F0F4FB] hover:text-[#0F2859]'
                  }`}
                >
                  <span className={active ? 'text-[#D4AF37]' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Viewport */}
        <div className="lg:col-span-9 space-y-6">
          {activeSection === 'overview' && (
            <>
              <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">Admin Console (Demo) / Overview</div>
                  <h1 className="mt-1 font-display text-2xl font-bold text-[#0F2859]">
                    Academic Operations Summary
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('notices')}
                  className="px-4 py-2 rounded-lg bg-[#0F2859] text-white text-xs font-semibold hover:bg-[#17387A] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Publish New Circular
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">Demo Student Records</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-[#0F2859] tabular-nums">
                    {students.length}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">CBSE Grade Span</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-[#0F2859] tabular-nums">
                    Nursery–10
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">Active Circulars</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-[#0F2859] tabular-nums">
                    {notices.length}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">Mean Attendance</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 tabular-nums">
                    {avgAttendance}%
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F2859]">
                  Quick Management Workflows (Live Demo State)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection('students')}
                    className="p-4 rounded-xl border border-slate-200 text-left hover:border-[#0F2859]/40 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5 text-[#9E701B]" aria-hidden="true" />
                    <div className="mt-2 font-semibold text-sm text-[#0F2859]">
                      Add Fictional Student
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Create a new demo profile searchable in Student Portal.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('attendance')}
                    className="p-4 rounded-xl border border-slate-200 text-left hover:border-[#0F2859]/40 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <CalendarCheck className="w-5 h-5 text-[#9E701B]" aria-hidden="true" />
                    <div className="mt-2 font-semibold text-sm text-[#0F2859]">
                      Mark Daily Attendance
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Toggle Present, Absent, or Leave statuses across demo roster.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('notices')}
                    className="p-4 rounded-xl border border-slate-200 text-left hover:border-[#0F2859]/40 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <BellPlus className="w-5 h-5 text-[#9E701B]" aria-hidden="true" />
                    <div className="mt-2 font-semibold text-sm text-[#0F2859]">
                      Publish Circular
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Post an announcement directly to the School Notices board.
                    </p>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSection === 'students' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200">
                <h2 className="font-display text-xl font-bold text-[#0F2859]">
                  Add Fictional Demo Student
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Created records are added to session state and can be searched immediately in the Student Portal.
                </p>

                {studentError && (
                  <p className="mt-4 text-xs text-red-700 font-medium">{studentError}</p>
                )}
                {studentMessage && (
                  <div className="mt-4 p-3 rounded-lg bg-[#F0F4FB] border border-[#0F2859]/20 text-xs text-[#0F2859] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{studentMessage}</span>
                  </div>
                )}

                <form onSubmit={handleCreateStudent} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <div className="lg:col-span-2">
                    <label htmlFor="admin-student-name" className="block text-xs font-semibold text-[#0F2859] mb-1">
                      Fictional Student Name
                    </label>
                    <input
                      id="admin-student-name"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Kabir Mehta"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-student-class" className="block text-xs font-semibold text-[#0F2859] mb-1">
                      Class
                    </label>
                    <select
                      id="admin-student-class"
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value as ClassLevel)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      {ALL_CLASS_LEVELS.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="admin-student-section" className="block text-xs font-semibold text-[#0F2859] mb-1">
                      Section
                    </label>
                    <select
                      id="admin-student-section"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value as Section)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      {ALL_SECTIONS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="admin-student-roll" className="block text-xs font-semibold text-[#0F2859] mb-1">
                      Roll No.
                    </label>
                    <input
                      id="admin-student-roll"
                      type="text"
                      value={newRoll}
                      onChange={(e) => setNewRoll(e.target.value)}
                      placeholder="e.g. 305"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-student-house" className="block text-xs font-semibold text-[#0F2859] mb-1">
                      House
                    </label>
                    <select
                      id="admin-student-house"
                      value={newHouse}
                      onChange={(e) => setNewHouse(e.target.value as StudentRecord['house'])}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="Sapphire">Sapphire</option>
                      <option value="Goldcrest">Goldcrest</option>
                      <option value="Emerald">Emerald</option>
                      <option value="Crimson">Crimson</option>
                    </select>
                  </div>
                  <div className="lg:col-span-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#0F2859] text-white text-xs font-semibold hover:bg-[#17387A] cursor-pointer"
                    >
                      Add Demo Student Record
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Student ID</th>
                      <th className="py-3 px-4">Name (Demo)</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Section</th>
                      <th className="py-3 px-4 text-right">Roll No</th>
                      <th className="py-3 px-4 text-right">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => {
                      const att = computeAttendanceSummary(s.attendance);
                      return (
                        <tr key={s.studentId} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono text-xs text-slate-600">
                            {s.studentId}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#0F2859]">{s.fullName}</td>
                          <td className="py-3 px-4 text-slate-700">{s.classLevel}</td>
                          <td className="py-3 px-4 text-slate-700">{s.section}</td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums">
                            {s.rollNumber}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#0F2859]">
                            {att.percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'attendance' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0F2859]">
                    Daily Attendance Register (Demo)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Date: 20 Nov 2026 · Click status buttons to update roll-call totals.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                  <span className="text-emerald-700 font-semibold">Present: {presentCount}</span>
                  <span className="text-red-700 font-semibold">Absent: {absentCount}</span>
                  <span className="text-[#9E701B] font-semibold">Leave: {leaveCount}</span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Roll / Class</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4 text-right">Mark Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => {
                      const current = dailyStatuses[s.studentId] ?? 'Present';
                      return (
                        <tr key={s.studentId}>
                          <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums">
                            #{s.rollNumber} · {s.classLevel} ({s.section})
                          </td>
                          <td className="py-3 px-4 font-medium text-[#0F2859]">{s.fullName}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100">
                              {(['Present', 'Absent', 'Leave'] as DailyAttendanceStatus[]).map(
                                (status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() =>
                                      setDailyStatuses((prev) => ({
                                        ...prev,
                                        [s.studentId]: status,
                                      }))
                                    }
                                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                                      current === status
                                        ? status === 'Present'
                                          ? 'bg-emerald-700 text-white'
                                          : status === 'Absent'
                                          ? 'bg-red-700 text-white'
                                          : 'bg-[#B88624] text-white'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'notices' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-5">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0F2859]">
                  Publish School Circular (Demo)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  New notices appear immediately on the Home page and School Notices board.
                </p>
              </div>

              {noticeError && <p className="text-xs text-red-700 font-medium">{noticeError}</p>}
              {noticeStatus && (
                <div className="p-3 rounded-lg bg-[#F0F4FB] border border-[#0F2859]/20 text-xs text-[#0F2859] flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {noticeStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('notices')}
                    className="font-semibold underline cursor-pointer shrink-0"
                  >
                    View Notices Board
                  </button>
                </div>
              )}

              <form onSubmit={handlePublishNotice} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="admin-notice-title" className="block text-xs font-semibold text-[#0F2859] mb-1">
                      Circular Title
                    </label>
                    <input
                      id="admin-notice-title"
                      type="text"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      placeholder="e.g. Science Exhibition Registration Open"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-notice-category" className="block text-xs font-semibold text-[#0F2859] mb-1">
                      Category
                    </label>
                    <select
                      id="admin-notice-category"
                      value={noticeCategory}
                      onChange={(e) => setNoticeCategory(e.target.value as NoticeCategory)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Examination">Examination</option>
                      <option value="Circulars">Circulars</option>
                      <option value="Events">Events</option>
                      <option value="Holidays">Holidays</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="admin-notice-audience" className="block text-xs font-semibold text-[#0F2859] mb-1">
                    Target Audience
                  </label>
                  <input
                    id="admin-notice-audience"
                    type="text"
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="admin-notice-summary" className="block text-xs font-semibold text-[#0F2859] mb-1">
                    Summary
                  </label>
                  <input
                    id="admin-notice-summary"
                    type="text"
                    value={noticeSummary}
                    onChange={(e) => setNoticeSummary(e.target.value)}
                    placeholder="Concise one-line announcement for the notice board..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="admin-notice-body" className="block text-xs font-semibold text-[#0F2859] mb-1">
                    Full Circular Details (Optional)
                  </label>
                  <textarea
                    id="admin-notice-body"
                    rows={3}
                    value={noticeBody}
                    onChange={(e) => setNoticeBody(e.target.value)}
                    placeholder="Complete instructions, dates, and coordinator contacts..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0F2859] text-white text-xs font-semibold hover:bg-[#17387A] cursor-pointer"
                >
                  Publish Notice
                </button>
              </form>
            </div>
          )}

          {activeSection === 'results' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0F2859]">
                    Demo Examination Marks Editor
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adjust theory marks below to preview live CBSE grade &amp; aggregate recalculation.
                  </p>
                </div>

                <select
                  aria-label="Select demo student for marks review"
                  value={editedStudent?.studentId ?? ''}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.fullName} ({s.classLevel} · {s.section})
                    </option>
                  ))}
                </select>
              </div>

              {editedStudent && editedExam && editedExamSummary && (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4 text-right">Theory Score</th>
                        <th className="py-3 px-4 text-right">Internal</th>
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4 text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editedExamSummary.rows.map((row) => (
                        <tr key={row.code}>
                          <td className="py-3 px-4 font-medium text-[#0F2859]">{row.subject}</td>
                          <td className="py-3 px-4 text-right">
                            <input
                              type="number"
                              min={0}
                              max={row.theoryMax}
                              aria-label={`${row.subject} theory marks`}
                              value={row.theoryMarks}
                              onChange={(e) => {
                                const parsed = Math.max(
                                  0,
                                  Math.min(row.theoryMax, Number(e.target.value) || 0)
                                );
                                onUpdateStudentMark(
                                  editedStudent.studentId,
                                  editedExam.termId,
                                  row.code,
                                  parsed
                                );
                              }}
                              className="w-20 px-2 py-1 rounded border border-slate-300 text-right font-mono tabular-nums"
                            />
                            <span className="ml-1 text-xs text-slate-500 font-mono">
                              / {row.theoryMax}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
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
                      <tr className="bg-[#F0F4FB] border-t border-slate-200 font-semibold text-[#0F2859]">
                        <td colSpan={3} className="py-3 px-4">
                          Aggregate Percentage &amp; CBSE Overall Grade
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          {editedExamSummary.totalObtained} / {editedExamSummary.totalMax}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[#9E701B]">
                          {editedExamSummary.percentage.toFixed(1)}% ({editedExamSummary.overallGrade})
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeSection === 'firebase' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-5">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0F2859]">
                  Firebase Integration Readiness
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The application separates UI components from data repositories (<code className="font-mono text-[#0F2859]">src/services/repository.ts</code>) so Firebase Authentication and Cloud Firestore can be connected cleanly without exposing API secrets or modifying view components.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Layer</th>
                      <th className="py-3 px-4">Target Service / Collection</th>
                      <th className="py-3 px-4">Readiness</th>
                      <th className="py-3 px-4">Security Architecture</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {FIREBASE_READINESS_PLAN.map((item) => (
                      <tr key={item.layer}>
                        <td className="py-3 px-4 font-semibold text-[#0F2859]">{item.layer}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-700">
                          {item.collectionOrService}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-[#9E701B]">
                          {item.status}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

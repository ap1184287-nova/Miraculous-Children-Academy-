import React, { useState } from 'react';
import {
  BellPlus,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Database,
  FileSpreadsheet,
  Globe,
  GraduationCap,
  ImagePlus,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Users,
} from 'lucide-react';
import { ALL_CLASS_LEVELS, ALL_SECTIONS, DEFAULT_SITE_CONFIG } from '../../data/demoData';
import { BrandColorPickerCard } from './BrandColorPickerCard';
import { FIREBASE_READINESS_PLAN } from '../../services/repository';
import type {
  ClassCurriculum,
  ClassLevel,
  ContactMessageRecord,
  DailyAttendanceStatus,
  GalleryCategory,
  GalleryItem,
  HomeworkItem,
  LanguageCode,
  NoticeCategory,
  NoticeItem,
  PageId,
  Section,
  SiteContentConfig,
  StudentRecord,
  StudyMaterialItem,
  StudyMaterialKind,
  TeacherProfile,
} from '../../types/school';
import {
  computeAttendanceSummary,
  computeExamSummary,
  DEFAULT_PRIMARY_COLOR,
  DEMO_ADMIN_PASSCODE,
  verifyAdminPasscode,
} from '../../utils/schoolLogic';

interface AdminDashboardPageProps {
  lang: LanguageCode;
  students: StudentRecord[];
  notices: NoticeItem[];
  gallery: GalleryItem[];
  materials: StudyMaterialItem[];
  homework: HomeworkItem[];
  teachers: TeacherProfile[];
  classes: ClassCurriculum[];
  siteConfig: SiteContentConfig;
  inquiries: ContactMessageRecord[];
  onAddStudent: (student: StudentRecord) => void;
  onAddNotice: (notice: NoticeItem) => void;
  onDeleteNotice: (id: string) => void;
  onAddGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
  onAddMaterial: (item: StudyMaterialItem) => void;
  onDeleteMaterial: (id: string) => void;
  onAddHomework: (item: HomeworkItem) => void;
  onDeleteHomework: (id: string) => void;
  onAddTeacher: (teacher: TeacherProfile) => void;
  onDeleteTeacher: (id: string) => void;
  onUpdateClassTeacher: (classLevel: ClassLevel, classTeacher: string) => void;
  onUpdateSiteConfig: (next: SiteContentConfig) => void;
  onUpdateStudentMark: (
    studentId: string,
    termId: string,
    subjectCode: string,
    newTheoryMarks: number
  ) => void;
  onResetAllDemoData: () => void;
  onNavigate: (page: PageId) => void;
}

type AdminSection =
  | 'overview'
  | 'notices'
  | 'gallery'
  | 'materials'
  | 'homework'
  | 'faculty'
  | 'students'
  | 'attendance'
  | 'results'
  | 'content'
  | 'firebase';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  lang,
  students,
  notices,
  gallery,
  materials,
  homework,
  teachers,
  classes,
  siteConfig,
  inquiries,
  onAddStudent,
  onAddNotice,
  onDeleteNotice,
  onAddGalleryItem,
  onDeleteGalleryItem,
  onAddMaterial,
  onDeleteMaterial,
  onAddHomework,
  onDeleteHomework,
  onAddTeacher,
  onDeleteTeacher,
  onUpdateClassTeacher,
  onUpdateSiteConfig,
  onUpdateStudentMark,
  onResetAllDemoData,
  onNavigate,
}) => {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  // Notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>('Academic');
  const [noticeAudience, setNoticeAudience] = useState('Nursery to Class 10');
  const [noticeSummary, setNoticeSummary] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeStatus, setNoticeStatus] = useState<string | null>(null);
  const [noticeError, setNoticeError] = useState<string | null>(null);

  // Gallery upload state
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryCategory>('School');
  const [galCaption, setGalCaption] = useState('');
  const [galImageData, setGalImageData] = useState('');
  const [galStatus, setGalStatus] = useState<string | null>(null);
  const [galError, setGalError] = useState<string | null>(null);

  // Study material state
  const [matTitle, setMatTitle] = useState('');
  const [matTitleHi, setMatTitleHi] = useState('');
  const [matClass, setMatClass] = useState<ClassLevel>('Class 10');
  const [matSubject, setMatSubject] = useState('Mathematics');
  const [matKind, setMatKind] = useState<StudyMaterialKind>('material');
  const [matSummary, setMatSummary] = useState('');
  const [matContent, setMatContent] = useState('');
  const [matStatus, setMatStatus] = useState<string | null>(null);

  // Homework state
  const [hwClass, setHwClass] = useState<ClassLevel>('Class 10');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDue, setHwDue] = useState('25 Nov 2026');
  const [hwHoliday, setHwHoliday] = useState(false);
  const [hwStatus, setHwStatus] = useState<string | null>(null);

  // Teachers state
  const [tchName, setTchName] = useState('');
  const [tchNameHi, setTchNameHi] = useState('');
  const [tchRole, setTchRole] = useState('');
  const [tchQual, setTchQual] = useState('');
  const [tchSubjects, setTchSubjects] = useState('');
  const [tchClasses, setTchClasses] = useState('Class 6 to Class 10');
  const [tchExp, setTchExp] = useState(5);
  const [tchStatus, setTchStatus] = useState<string | null>(null);

  // Student Roster state
  const [newName, setNewName] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newClass, setNewClass] = useState<ClassLevel>('Class 6');
  const [newSection, setNewSection] = useState<Section>('A');
  const [newHouse, setNewHouse] = useState<StudentRecord['house']>('Sapphire');
  const [studentMessage, setStudentMessage] = useState<string | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);

  // Daily Attendance state
  const [dailyStatuses, setDailyStatuses] = useState<Record<string, DailyAttendanceStatus>>(() =>
    Object.fromEntries(students.map((s) => [s.studentId, 'Present']))
  );

  // Results Editor state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId ?? '');

  // Website CMS Form state
  const [cmsDraft, setCmsDraft] = useState<SiteContentConfig>(siteConfig);
  const [cmsSavedMsg, setCmsSavedMsg] = useState<string | null>(null);

  const handleChangePrimaryColor = (nextHex: string) => {
    const updated = { ...siteConfig, primaryColor: nextHex };
    onUpdateSiteConfig(updated);
    setCmsDraft((prev) => ({ ...prev, primaryColor: nextHex }));
  };

  const handleResetPrimaryColor = () => {
    handleChangePrimaryColor(DEFAULT_PRIMARY_COLOR);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAdminPasscode(passcodeInput)) {
      setAuthError(
        lang === 'hi'
          ? 'गलत पासकोड। कृपया डेमो पासकोड दर्ज करें।'
          : 'Invalid admin passcode. Use the demo passcode shown below.'
      );
      return;
    }
    setAuthError(null);
    setPasscodeInput('');
    setIsAdminUnlocked(true);
  };

  if (!isAdminUnlocked) {
    return (
      <div className="bg-[#F8FAFC] min-h-[calc(100vh-14rem)] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="bg-royal-900 text-white px-6 py-6 border-b border-[#D4AF37]/40">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
              <Lock className="w-4 h-4" aria-hidden="true" />
              {lang === 'hi' ? 'सुरक्षित एडमिन लॉगिन (डेमो)' : 'Authorized Admin Access (Demo)'}
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold">
              {lang === 'hi' ? 'एडमिन कंट्रोल पैनल' : 'Admin Management Console'}
            </h1>
          </div>

          <form onSubmit={handleUnlock} className="p-6 sm:p-8 space-y-5">
            <div className="p-4 rounded-xl bg-[#FAF3E0] border border-[#D4AF37]/40 text-xs text-slate-800 space-y-1">
              <div className="font-semibold text-royal-900">
                {lang === 'hi' ? 'डेमो एडमिन पासकोड:' : 'Demo Admin Passcode:'}{' '}
                <code className="font-mono font-bold text-[#9E701B]">{DEMO_ADMIN_PASSCODE}</code>
              </div>
              <p>
                {lang === 'hi'
                  ? 'यह सुरक्षित डेमो प्रमाणीकरण है। लाइव वेबसाइट पर इसे Firebase Auth से जोड़ा जा सकता है।'
                  : 'Only authorized school admins can add/delete notices, photos, study materials, homework, and website content.'}
              </p>
            </div>

            <div>
              <label
                htmlFor="admin-passcode-input"
                className="block text-xs font-semibold text-royal-900 mb-1.5"
              >
                {lang === 'hi' ? 'एडमिन पासकोड दर्ज करें' : 'Enter Admin Passcode'}
              </label>
              <input
                id="admin-passcode-input"
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder={DEMO_ADMIN_PASSCODE}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-royal-900/25 focus:border-royal-900"
              />
              {authError && <p className="mt-1.5 text-xs text-red-700 font-medium">{authError}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-royal-900 text-white text-sm font-semibold hover:bg-royal-800 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                {lang === 'hi' ? 'एडमिन पैनल खोलें' : 'Unlock Admin Panel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasscodeInput(DEMO_ADMIN_PASSCODE);
                  setAuthError(null);
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-royal-900 hover:bg-slate-50 cursor-pointer"
              >
                {lang === 'hi' ? 'डेमो पासकोड भरें' : 'Fill Demo Passcode'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Photo upload compression handler for localStorage safety
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 900;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setGalImageData(canvas.toDataURL('image/jpeg', 0.78));
        } else if (typeof reader.result === 'string') {
          setGalImageData(reader.result);
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (noticeTitle.trim().length < 4 || noticeSummary.trim().length < 6) {
      setNoticeError('Provide a clear notice title and summary.');
      setNoticeStatus(null);
      return;
    }
    const created: NoticeItem = {
      id: `notice-${Date.now()}`,
      referenceNo: `MCA/CIR/2026-${Math.floor(115 + Math.random() * 80)}`,
      title: noticeTitle.trim(),
      category: noticeCategory,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      audience: noticeAudience.trim() || 'All Students',
      summary: noticeSummary.trim(),
      body: noticeBody.trim() || noticeSummary.trim(),
      isPinned: true,
    };
    onAddNotice(created);
    setNoticeError(null);
    setNoticeStatus(`Notice "${created.title}" published to Notice Board.`);
    setNoticeTitle('');
    setNoticeSummary('');
    setNoticeBody('');
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (galTitle.trim().length < 3 || !galImageData.trim()) {
      setGalError('Enter a photo title and upload an image file (or paste an image path).');
      setGalStatus(null);
      return;
    }
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: galTitle.trim(),
      category: galCategory,
      caption: galCaption.trim() || 'Miraculous Children Academy, Nikhura, Buxar',
      imageUrl: galImageData.trim(),
      aspectLabel: galCategory,
    };
    onAddGalleryItem(item);
    setGalError(null);
    setGalStatus(`Added "${item.title}" to Gallery.`);
    setGalTitle('');
    setGalCaption('');
    setGalImageData('');
  };

  const handleAddStudyMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (matTitle.trim().length < 3 || matContent.trim().length < 5) return;
    const created: StudyMaterialItem = {
      id: `mat-${Date.now()}`,
      title: matTitle.trim(),
      titleHi: matTitleHi.trim() || matTitle.trim(),
      classLevel: matClass,
      subject: matSubject.trim() || 'General',
      kind: matKind,
      summary: matSummary.trim() || matTitle.trim(),
      content: matContent.trim(),
      updatedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      author: 'Admin / Faculty',
    };
    onAddMaterial(created);
    setMatStatus(`Saved "${created.title}" to Student Corner.`);
    setMatTitle('');
    setMatTitleHi('');
    setMatSummary('');
    setMatContent('');
  };

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (hwTitle.trim().length < 3 || hwDesc.trim().length < 5) return;
    const item: HomeworkItem = {
      id: `hw-${Date.now()}`,
      classLevel: hwClass,
      subject: hwSubject.trim() || 'All Subjects',
      title: hwTitle.trim(),
      description: hwDesc.trim(),
      assignedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      dueDate: hwDue.trim() || 'Next Class',
      isHolidayHomework: hwHoliday,
    };
    onAddHomework(item);
    setHwStatus(`Updated homework for ${item.classLevel}: "${item.title}".`);
    setHwTitle('');
    setHwDesc('');
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (tchName.trim().length < 3 || tchRole.trim().length < 2) return;
    onAddTeacher({
      id: `tch-${Date.now()}`,
      name: tchName.trim(),
      nameHi: tchNameHi.trim() || tchName.trim(),
      role: tchRole.trim(),
      roleHi: tchRole.trim(),
      qualification: tchQual.trim() || 'B.Ed.',
      subjects: tchSubjects.trim() || 'General Studies',
      classesHandled: tchClasses.trim() || 'Primary & Middle',
      experienceYears: Number(tchExp) || 1,
    });
    setTchStatus(`Added faculty member "${tchName.trim()}".`);
    setTchName('');
    setTchNameHi('');
    setTchRole('');
    setTchQual('');
    setTchSubjects('');
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedRoll = newRoll.trim();
    if (trimmedName.length < 2 || !trimmedRoll) {
      setStudentError('Enter both a fictional student name and roll number.');
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
      setStudentError(`Roll ${trimmedRoll} already exists in ${newClass} Section ${newSection}.`);
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
      classTeacher: 'Demo Coordinator',
      guardianName: `${trimmedName.split(' ')[0]} Guardian (Demo)`,
      guardianContactMasked: 'Verified Demo Guardian',
      dateOfBirthMasked: '10 May 2014',
      isDemoRecord: true,
      attendance: [{ month: 'November', workingDays: 16, presentDays: 15, absentDays: 1, leaveDays: 0 }],
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
    setStudentMessage(`Added ${newRecord.fullName} (${newRecord.studentId}).`);
    setNewName('');
    setNewRoll('');
  };

  const avgAttendance =
    students.length > 0
      ? Math.round(
          (students.reduce((sum, s) => sum + computeAttendanceSummary(s.attendance).percentage, 0) /
            students.length) *
            10
        ) / 10
      : 0;

  const editedStudent = students.find((s) => s.studentId === selectedStudentId) ?? students[0] ?? null;
  const editedExam = editedStudent?.exams[0] ?? null;
  const editedExamSummary = editedExam ? computeExamSummary(editedExam.subjects) : null;

  const SIDEBAR_ITEMS: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: lang === 'hi' ? 'डैशबोर्ड सारांश' : 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'notices', label: lang === 'hi' ? 'नोटिस जोड़ें / हटाएं' : 'Notices (Add/Delete)', icon: <BellPlus className="w-4 h-4" /> },
    { id: 'gallery', label: lang === 'hi' ? 'फोटो अपलोड / गैलरी' : 'Gallery Upload', icon: <ImagePlus className="w-4 h-4" /> },
    { id: 'materials', label: lang === 'hi' ? 'स्टडी मटेरियल अपलोड' : 'Study Materials', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'homework', label: lang === 'hi' ? 'होमवर्क अपडेट' : 'Homework Manager', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'faculty', label: lang === 'hi' ? 'शिक्षक एवं कक्षाएं' : 'Teachers & Classes', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'students', label: lang === 'hi' ? 'डेमो छात्र सूची' : 'Demo Students', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: lang === 'hi' ? 'दैनिक उपस्थिति' : 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'results', label: lang === 'hi' ? 'परीक्षा अंक' : 'Exam Marks', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'content', label: lang === 'hi' ? 'वेबसाइट सामग्री (CMS)' : 'Website Content', icon: <Globe className="w-4 h-4" /> },
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
              <strong className="text-royal-900">DEMO ADMIN PANEL:</strong> Changes persist locally in your browser via <code className="font-mono">localStorage</code>.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('portal')}
              className="text-royal-900 font-semibold underline hover:text-[#9E701B] cursor-pointer"
            >
              Student Corner
            </button>
            <button
              type="button"
              onClick={() => setIsAdminUnlocked(false)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-royal-900 text-white font-semibold cursor-pointer"
            >
              <LogOut className="w-3 h-3" aria-hidden="true" />
              Lock
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside aria-label="Admin dashboard navigation" className="lg:col-span-3 space-y-2">
          <div className="p-4 rounded-xl bg-royal-900 text-white mb-3">
            <div className="text-xs font-semibold text-[#D4AF37]">Admin Panel · Demo</div>
            <div className="font-display text-lg font-bold mt-0.5">Miraculous Children Academy</div>
          </div>

          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                    active
                      ? 'bg-royal-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-royal-50 hover:text-royal-900'
                  }`}
                >
                  <span className={active ? 'text-[#D4AF37]' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="lg:col-span-9 space-y-6">
          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <>
              <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-royal-900">
                    {lang === 'hi' ? 'एडमिन नियंत्रण केंद्र (डेमो)' : 'School Control Overview (Demo)'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nikhura, Buxar, Bihar · Zero-Budget Local Persistence Active
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetAllDemoData();
                    setCmsDraft(DEFAULT_SITE_CONFIG);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Reset Demo Data
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">Active Notices</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-royal-900 tabular-nums">
                    {notices.length}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">Study Materials</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-royal-900 tabular-nums">
                    {materials.length}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">Homework Entries</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-royal-900 tabular-nums">
                    {homework.length}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">Gallery &amp; Faculty</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-[#9E701B] tabular-nums">
                    {gallery.length} / {teachers.length}
                  </div>
                </div>
              </div>

              <BrandColorPickerCard
                lang={lang}
                currentColor={siteConfig.primaryColor}
                onChangeColor={handleChangePrimaryColor}
                onResetDefault={handleResetPrimaryColor}
              />

              {/* Contact Inquiries Inbox */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
                <h2 className="font-display text-lg font-bold text-royal-900">
                  Contact Form Submissions ({inquiries.length})
                </h2>
                {inquiries.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Submissions from the Contact Us page will appear here.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 text-xs">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-semibold text-royal-900">
                            {inq.fullName} · {inq.classApplying} · {inq.subject}
                          </div>
                          <div className="text-slate-600 mt-0.5">{inq.message}</div>
                        </div>
                        <div className="font-mono text-slate-500 shrink-0">
                          {inq.referenceNo} · {inq.submittedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* NOTICES ADD & DELETE */}
          {activeSection === 'notices' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Publish School Notice
                </h2>
                {noticeError && <p className="text-xs text-red-700">{noticeError}</p>}
                {noticeStatus && (
                  <div className="p-3 rounded-lg bg-royal-50 border border-royal-900/20 text-xs text-royal-900 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {noticeStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('notices')}
                      className="font-semibold underline cursor-pointer shrink-0"
                    >
                      Open Notice Board
                    </button>
                  </div>
                )}

                <form onSubmit={handlePublishNotice} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="admin-notice-title" className="block text-xs font-semibold text-royal-900 mb-1">
                        Notice Title
                      </label>
                      <input
                        id="admin-notice-title"
                        type="text"
                        value={noticeTitle}
                        onChange={(e) => setNoticeTitle(e.target.value)}
                        placeholder="e.g. Winter Vacation Holiday Notice"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="admin-notice-category" className="block text-xs font-semibold text-royal-900 mb-1">
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
                        <option value="Holidays">Holidays</option>
                        <option value="Circulars">Circulars</option>
                        <option value="Events">Events</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="admin-notice-audience" className="block text-xs font-semibold text-royal-900 mb-1">
                        Audience
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
                      <label htmlFor="admin-notice-summary" className="block text-xs font-semibold text-royal-900 mb-1">
                        Short Summary
                      </label>
                      <input
                        id="admin-notice-summary"
                        type="text"
                        value={noticeSummary}
                        onChange={(e) => setNoticeSummary(e.target.value)}
                        placeholder="One-line summary..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="admin-notice-body" className="block text-xs font-semibold text-royal-900 mb-1">
                      Full Details
                    </label>
                    <textarea
                      id="admin-notice-body"
                      rows={3}
                      value={noticeBody}
                      onChange={(e) => setNoticeBody(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                  >
                    Publish Notice
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
                <h3 className="font-display text-lg font-bold text-royal-900">
                  Manage Existing Notices ({notices.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {notices.map((n) => (
                    <div key={n.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-royal-900 truncate">
                          {n.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {n.category} · {n.date} · {n.referenceNo}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteNotice(n.id)}
                        aria-label={`Delete notice ${n.title}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY UPLOAD & DELETE */}
          {activeSection === 'gallery' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Upload Photo to School Gallery
                </h2>
                {galError && <p className="text-xs text-red-700">{galError}</p>}
                {galStatus && (
                  <div className="p-3 rounded-lg bg-royal-50 text-xs text-royal-900 flex items-center justify-between">
                    <span>{galStatus}</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('gallery')}
                      className="underline font-semibold cursor-pointer"
                    >
                      View Gallery
                    </button>
                  </div>
                )}

                <form onSubmit={handleAddPhoto} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gal-title" className="block text-xs font-semibold text-royal-900 mb-1">
                        Photo Title
                      </label>
                      <input
                        id="gal-title"
                        type="text"
                        value={galTitle}
                        onChange={(e) => setGalTitle(e.target.value)}
                        placeholder="e.g. Independence Day Flag Hoisting"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="gal-cat" className="block text-xs font-semibold text-royal-900 mb-1">
                        Category
                      </label>
                      <select
                        id="gal-cat"
                        value={galCategory}
                        onChange={(e) => setGalCategory(e.target.value as GalleryCategory)}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      >
                        <option value="School">School</option>
                        <option value="Events">Events</option>
                        <option value="Sports & Cultural">Sports &amp; Cultural</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gal-file" className="block text-xs font-semibold text-royal-900 mb-1">
                      Choose Photo File (Device Upload)
                    </label>
                    <input
                      id="gal-file"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-royal-50 file:text-royal-900 hover:file:bg-royal-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="gal-caption" className="block text-xs font-semibold text-royal-900 mb-1">
                      Caption / Description
                    </label>
                    <input
                      id="gal-caption"
                      type="text"
                      value={galCaption}
                      onChange={(e) => setGalCaption(e.target.value)}
                      placeholder="Short caption describing the campus event..."
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                  >
                    Upload Photo to Gallery
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
                <h3 className="font-display text-lg font-bold text-royal-900">
                  Gallery Photos ({gallery.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {gallery.map((g) => (
                    <div key={g.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={g.imageUrl}
                          alt={g.title}
                          className="w-14 h-10 object-cover rounded border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-royal-900 truncate">{g.title}</div>
                          <div className="text-xs text-slate-500">{g.category}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteGalleryItem(g.id)}
                        aria-label={`Delete photo ${g.title}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STUDY MATERIALS & SAMPLE PAPERS UPLOAD */}
          {activeSection === 'materials' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Add Study Material / Worksheet / Sample Paper
                </h2>
                {matStatus && (
                  <div className="p-3 rounded-lg bg-royal-50 text-xs text-royal-900 flex items-center justify-between">
                    <span>{matStatus}</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('portal')}
                      className="underline font-semibold cursor-pointer"
                    >
                      Open Student Corner
                    </button>
                  </div>
                )}

                <form onSubmit={handleAddStudyMaterial} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="mat-cls" className="block text-xs font-semibold text-royal-900 mb-1">
                        Class
                      </label>
                      <select
                        id="mat-cls"
                        value={matClass}
                        onChange={(e) => setMatClass(e.target.value as ClassLevel)}
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
                      <label htmlFor="mat-kind" className="block text-xs font-semibold text-royal-900 mb-1">
                        Type
                      </label>
                      <select
                        id="mat-kind"
                        value={matKind}
                        onChange={(e) => setMatKind(e.target.value as StudyMaterialKind)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      >
                        <option value="material">Study Notes</option>
                        <option value="worksheet">Worksheet</option>
                        <option value="sample-paper">Sample Paper</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="mat-sub" className="block text-xs font-semibold text-royal-900 mb-1">
                        Subject
                      </label>
                      <input
                        id="mat-sub"
                        type="text"
                        value={matSubject}
                        onChange={(e) => setMatSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mat-title-en" className="block text-xs font-semibold text-royal-900 mb-1">
                        Title (English)
                      </label>
                      <input
                        id="mat-title-en"
                        type="text"
                        value={matTitle}
                        onChange={(e) => setMatTitle(e.target.value)}
                        placeholder="e.g. Triangles Theorem Summary"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="mat-title-hi" className="block text-xs font-semibold text-royal-900 mb-1">
                        Title (Hindi - Optional)
                      </label>
                      <input
                        id="mat-title-hi"
                        type="text"
                        value={matTitleHi}
                        onChange={(e) => setMatTitleHi(e.target.value)}
                        placeholder="उदा. त्रिभुज प्रमेय नोट्स"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mat-summary" className="block text-xs font-semibold text-royal-900 mb-1">
                      Short Description
                    </label>
                    <input
                      id="mat-summary"
                      type="text"
                      value={matSummary}
                      onChange={(e) => setMatSummary(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="mat-content" className="block text-xs font-semibold text-royal-900 mb-1">
                      Full Study Notes / Questions Content
                    </label>
                    <textarea
                      id="mat-content"
                      rows={4}
                      value={matContent}
                      onChange={(e) => setMatContent(e.target.value)}
                      placeholder="Write chapter points, formulas, or practice questions..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                  >
                    Publish Study Material
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
                <h3 className="font-display text-lg font-bold text-royal-900">
                  Published Study Materials ({materials.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {materials.map((m) => (
                    <div key={m.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-royal-900">{m.title}</div>
                        <div className="text-xs text-slate-500">
                          {m.classLevel} · {m.subject} · {m.kind}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteMaterial(m.id)}
                        aria-label={`Delete study material ${m.title}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HOMEWORK MANAGER */}
          {activeSection === 'homework' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Post / Update Homework &amp; Holiday Homework
                </h2>
                {hwStatus && <div className="p-3 rounded-lg bg-royal-50 text-xs text-royal-900">{hwStatus}</div>}

                <form onSubmit={handleCreateHomework} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="hw-cls" className="block text-xs font-semibold text-royal-900 mb-1">
                        Class
                      </label>
                      <select
                        id="hw-cls"
                        value={hwClass}
                        onChange={(e) => setHwClass(e.target.value as ClassLevel)}
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
                      <label htmlFor="hw-sub" className="block text-xs font-semibold text-royal-900 mb-1">
                        Subject
                      </label>
                      <input
                        id="hw-sub"
                        type="text"
                        value={hwSubject}
                        onChange={(e) => setHwSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="hw-due" className="block text-xs font-semibold text-royal-900 mb-1">
                        Submission Due Date
                      </label>
                      <input
                        id="hw-due"
                        type="text"
                        value={hwDue}
                        onChange={(e) => setHwDue(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hw-title" className="block text-xs font-semibold text-royal-900 mb-1">
                      Homework Title
                    </label>
                    <input
                      id="hw-title"
                      type="text"
                      value={hwTitle}
                      onChange={(e) => setHwTitle(e.target.value)}
                      placeholder="e.g. Chapter 5 Linear Equations Worksheet"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="hw-desc" className="block text-xs font-semibold text-royal-900 mb-1">
                      Instructions
                    </label>
                    <textarea
                      id="hw-desc"
                      rows={2}
                      value={hwDesc}
                      onChange={(e) => setHwDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hwHoliday}
                      onChange={(e) => setHwHoliday(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    Mark as Holiday Homework (अवकाश गृहकार्य)
                  </label>

                  <div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                    >
                      Save Homework
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
                <h3 className="font-display text-lg font-bold text-royal-900">
                  Current Homework List ({homework.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {homework.map((h) => (
                    <div key={h.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-royal-900">
                          {h.classLevel} · {h.subject} — {h.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          Due {h.dueDate} {h.isHolidayHomework ? '· Holiday Homework' : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteHomework(h.id)}
                        aria-label={`Delete homework ${h.title}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEACHERS & CLASSES MANAGER */}
          {activeSection === 'faculty' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Add Teacher Profile
                </h2>
                {tchStatus && <div className="p-3 rounded-lg bg-royal-50 text-xs text-royal-900">{tchStatus}</div>}

                <form onSubmit={handleCreateTeacher} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="tch-name" className="block text-xs font-semibold text-royal-900 mb-1">
                      Teacher Name (EN)
                    </label>
                    <input
                      id="tch-name"
                      type="text"
                      value={tchName}
                      onChange={(e) => setTchName(e.target.value)}
                      placeholder="e.g. Mr. Amitabh Mishra"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="tch-name-hi" className="block text-xs font-semibold text-royal-900 mb-1">
                      Teacher Name (HI)
                    </label>
                    <input
                      id="tch-name-hi"
                      type="text"
                      value={tchNameHi}
                      onChange={(e) => setTchNameHi(e.target.value)}
                      placeholder="श्री अमिताभ मिश्रा"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="tch-role" className="block text-xs font-semibold text-royal-900 mb-1">
                      Designation / Role
                    </label>
                    <input
                      id="tch-role"
                      type="text"
                      value={tchRole}
                      onChange={(e) => setTchRole(e.target.value)}
                      placeholder="English & Social Studies Teacher"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="tch-qual" className="block text-xs font-semibold text-royal-900 mb-1">
                      Qualification
                    </label>
                    <input
                      id="tch-qual"
                      type="text"
                      value={tchQual}
                      onChange={(e) => setTchQual(e.target.value)}
                      placeholder="M.A., B.Ed."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="tch-sub" className="block text-xs font-semibold text-royal-900 mb-1">
                      Subjects
                    </label>
                    <input
                      id="tch-sub"
                      type="text"
                      value={tchSubjects}
                      onChange={(e) => setTchSubjects(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="tch-exp" className="block text-xs font-semibold text-royal-900 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      id="tch-exp"
                      type="number"
                      min={1}
                      max={45}
                      value={tchExp}
                      onChange={(e) => setTchExp(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                    >
                      Add Teacher
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
                <h3 className="font-display text-lg font-bold text-royal-900">
                  Faculty Directory ({teachers.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {teachers.map((t) => (
                    <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-royal-900">{t.name}</div>
                        <div className="text-xs text-slate-500">
                          {t.role} · {t.qualification} · {t.subjects}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteTeacher(t.id)}
                        aria-label={`Delete teacher ${t.name}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3">
                <h3 className="font-display text-lg font-bold text-royal-900">
                  Update Class Teacher Assignments (Nursery–10)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {classes.map((c) => (
                    <div
                      key={c.classLevel}
                      className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <span className="text-xs font-bold text-royal-900 w-24 shrink-0">
                        {c.classLevel}
                      </span>
                      <input
                        type="text"
                        aria-label={`Class teacher for ${c.classLevel}`}
                        value={c.classTeacher}
                        onChange={(e) => onUpdateClassTeacher(c.classLevel, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS DIRECTORY */}
          {activeSection === 'students' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200">
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Add Fictional Demo Student (Mean Att: {avgAttendance}%)
                </h2>
                {studentError && <p className="mt-3 text-xs text-red-700">{studentError}</p>}
                {studentMessage && (
                  <p className="mt-3 text-xs text-royal-900 font-medium">{studentMessage}</p>
                )}

                <form
                  onSubmit={handleCreateStudent}
                  className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
                >
                  <div className="lg:col-span-2">
                    <label htmlFor="admin-student-name" className="block text-xs font-semibold text-royal-900 mb-1">
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
                    <label htmlFor="admin-student-class" className="block text-xs font-semibold text-royal-900 mb-1">
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
                    <label htmlFor="admin-student-section" className="block text-xs font-semibold text-royal-900 mb-1">
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
                    <label htmlFor="admin-student-roll" className="block text-xs font-semibold text-royal-900 mb-1">
                      Roll No.
                    </label>
                    <input
                      id="admin-student-roll"
                      type="text"
                      value={newRoll}
                      onChange={(e) => setNewRoll(e.target.value)}
                      placeholder="305"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-student-house" className="block text-xs font-semibold text-royal-900 mb-1">
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
                      className="px-5 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                    >
                      Add Demo Student Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {activeSection === 'attendance' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4">
              <h2 className="font-display text-xl font-bold text-royal-900">
                Daily Attendance Register (Demo)
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Roll / Class</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4 text-right">Status</th>
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
                          <td className="py-3 px-4 font-medium text-royal-900">{s.fullName}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex gap-1 p-1 rounded-lg bg-slate-100">
                              {(['Present', 'Absent', 'Leave'] as DailyAttendanceStatus[]).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() =>
                                    setDailyStatuses((prev) => ({ ...prev, [s.studentId]: st }))
                                  }
                                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                                    current === st
                                      ? st === 'Present'
                                        ? 'bg-emerald-700 text-white'
                                        : st === 'Absent'
                                        ? 'bg-red-700 text-white'
                                        : 'bg-[#B88624] text-white'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
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

          {/* RESULTS EDITOR */}
          {activeSection === 'results' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Demo Examination Marks Editor
                </h2>
                <select
                  aria-label="Select demo student"
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
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4 text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editedExamSummary.rows.map((row) => (
                        <tr key={row.code}>
                          <td className="py-3 px-4 font-medium text-royal-900">{row.subject}</td>
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
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums">
                            {row.totalMarks} / {row.totalMax}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#9E701B]">
                            {row.grade}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* WEBSITE CONTENT CMS */}
          {activeSection === 'content' && (
            <div className="space-y-6">
              <BrandColorPickerCard
                lang={lang}
                currentColor={siteConfig.primaryColor}
                onChangeColor={handleChangePrimaryColor}
                onResetDefault={handleResetPrimaryColor}
              />
              <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-5">
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Website Content &amp; Contact Control (CMS)
                </h2>
              {cmsSavedMsg && (
                <div className="p-3 rounded-lg bg-royal-50 text-xs text-royal-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {cmsSavedMsg}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateSiteConfig(cmsDraft);
                  setCmsSavedMsg('Website content updated across Home, About, Contact & Footer.');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cms-welcome-title-en" className="block text-xs font-semibold text-royal-900 mb-1">
                      Welcome Heading (English)
                    </label>
                    <input
                      id="cms-welcome-title-en"
                      type="text"
                      value={cmsDraft.welcomeTitle}
                      onChange={(e) => setCmsDraft({ ...cmsDraft, welcomeTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="cms-welcome-title-hi" className="block text-xs font-semibold text-royal-900 mb-1">
                      Welcome Heading (Hindi)
                    </label>
                    <input
                      id="cms-welcome-title-hi"
                      type="text"
                      value={cmsDraft.welcomeTitleHi}
                      onChange={(e) => setCmsDraft({ ...cmsDraft, welcomeTitleHi: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cms-welcome-msg" className="block text-xs font-semibold text-royal-900 mb-1">
                    Welcome Message (English)
                  </label>
                  <textarea
                    id="cms-welcome-msg"
                    rows={2}
                    value={cmsDraft.welcomeMessage}
                    onChange={(e) => setCmsDraft({ ...cmsDraft, welcomeMessage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="cms-principal-msg" className="block text-xs font-semibold text-royal-900 mb-1">
                    Principal&apos;s Message (English)
                  </label>
                  <textarea
                    id="cms-principal-msg"
                    rows={2}
                    value={cmsDraft.principalMessage}
                    onChange={(e) => setCmsDraft({ ...cmsDraft, principalMessage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="cms-phone" className="block text-xs font-semibold text-royal-900 mb-1">
                      Helpline Phone (Demo)
                    </label>
                    <input
                      id="cms-phone"
                      type="text"
                      value={cmsDraft.phone}
                      onChange={(e) => setCmsDraft({ ...cmsDraft, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="cms-email" className="block text-xs font-semibold text-royal-900 mb-1">
                      Official Email
                    </label>
                    <input
                      id="cms-email"
                      type="email"
                      value={cmsDraft.email}
                      onChange={(e) => setCmsDraft({ ...cmsDraft, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="cms-hours" className="block text-xs font-semibold text-royal-900 mb-1">
                      Office Hours
                    </label>
                    <input
                      id="cms-hours"
                      type="text"
                      value={cmsDraft.officeHours}
                      onChange={(e) => setCmsDraft({ ...cmsDraft, officeHours: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cms-address" className="block text-xs font-semibold text-royal-900 mb-1">
                    School Address (English)
                  </label>
                  <input
                    id="cms-address"
                    type="text"
                    value={cmsDraft.address}
                    onChange={(e) => setCmsDraft({ ...cmsDraft, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-royal-900 text-white text-xs font-semibold hover:bg-royal-800 cursor-pointer"
                >
                  Save Website Content
                </button>
              </form>
              </div>
            </div>
          )}

          {/* FIREBASE READINESS */}
          {activeSection === 'firebase' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-5">
              <div>
                <h2 className="font-display text-xl font-bold text-royal-900">
                  Firebase &amp; Cloud Upgrade Readiness
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Zero-budget static persistence is active right now via <code className="font-mono">localStorage</code>. Connect Firebase Auth &amp; Firestore later via <code className="font-mono">src/services/repository.ts</code>.
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
                        <td className="py-3 px-4 font-semibold text-royal-900">{item.layer}</td>
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

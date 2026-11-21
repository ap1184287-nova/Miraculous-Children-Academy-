import type {
  AttendanceMonth,
  ClassLevel,
  ContactInquiry,
  HomeworkItem,
  NoticeCategory,
  NoticeItem,
  StudentRecord,
  StudentSearchQuery,
  StudyMaterialItem,
  StudyMaterialKind,
  SubjectMark,
} from '../types/school';

export const DEMO_ADMIN_PASSCODE = 'MCA-ADMIN-2026';

export interface SearchValidationResult {
  valid: boolean;
  errors: {
    rollNumber?: string;
    classLevel?: string;
    section?: string;
  };
}

export interface ComputedSubjectRow extends SubjectMark {
  totalMarks: number;
  totalMax: number;
  percentage: number;
  grade: string;
}

export interface ExamSummary {
  rows: ComputedSubjectRow[];
  totalObtained: number;
  totalMax: number;
  percentage: number;
  overallGrade: string;
  passedAll: boolean;
}

export interface AttendanceSummary {
  totalWorkingDays: number;
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  percentage: number;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactInquiry, string>>;
}

export function computeCbseGrade(percentage: number): string {
  if (percentage >= 91) return 'A1';
  if (percentage >= 81) return 'A2';
  if (percentage >= 71) return 'B1';
  if (percentage >= 61) return 'B2';
  if (percentage >= 51) return 'C1';
  if (percentage >= 41) return 'C2';
  if (percentage >= 33) return 'D';
  return 'E';
}

export function computeExamSummary(subjects: SubjectMark[]): ExamSummary {
  const rows: ComputedSubjectRow[] = subjects.map((item) => {
    const totalMarks = item.theoryMarks + item.internalMarks;
    const totalMax = item.theoryMax + item.internalMax;
    const percentage = totalMax > 0 ? Math.round((totalMarks / totalMax) * 1000) / 10 : 0;
    return {
      ...item,
      totalMarks,
      totalMax,
      percentage,
      grade: computeCbseGrade(percentage),
    };
  });

  const totalObtained = rows.reduce((sum, row) => sum + row.totalMarks, 0);
  const totalMax = rows.reduce((sum, row) => sum + row.totalMax, 0);
  const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;
  const passedAll = rows.length > 0 && rows.every((row) => row.percentage >= 33);

  return {
    rows,
    totalObtained,
    totalMax,
    percentage,
    overallGrade: computeCbseGrade(percentage),
    passedAll,
  };
}

export function computeAttendanceSummary(months: AttendanceMonth[]): AttendanceSummary {
  const totalWorkingDays = months.reduce((sum, m) => sum + m.workingDays, 0);
  const totalPresent = months.reduce((sum, m) => sum + m.presentDays, 0);
  const totalAbsent = months.reduce((sum, m) => sum + m.absentDays, 0);
  const totalLeave = months.reduce((sum, m) => sum + m.leaveDays, 0);
  const percentage =
    totalWorkingDays > 0 ? Math.round((totalPresent / totalWorkingDays) * 1000) / 10 : 0;

  return {
    totalWorkingDays,
    totalPresent,
    totalAbsent,
    totalLeave,
    percentage,
  };
}

export function validateStudentSearchQuery(query: StudentSearchQuery): SearchValidationResult {
  const errors: SearchValidationResult['errors'] = {};
  const trimmedRoll = query.rollNumber.trim();

  if (!trimmedRoll) {
    errors.rollNumber = 'Enter a roll number (e.g. 101).';
  } else if (!/^[A-Za-z0-9-]{1,12}$/.test(trimmedRoll)) {
    errors.rollNumber = 'Roll number must contain only letters or digits.';
  }

  if (!query.classLevel) {
    errors.classLevel = 'Select a class.';
  }

  if (!query.section) {
    errors.section = 'Select a section.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function findDemoStudent(
  students: StudentRecord[],
  query: StudentSearchQuery
): StudentRecord | null {
  const normalizedRoll = query.rollNumber.trim().toLowerCase();
  if (!normalizedRoll || !query.classLevel || !query.section) {
    return null;
  }

  return (
    students.find(
      (student) =>
        student.rollNumber.toLowerCase() === normalizedRoll &&
        student.classLevel === query.classLevel &&
        student.section === query.section
    ) ?? null
  );
}

export function filterNotices(
  notices: NoticeItem[],
  category: NoticeCategory | 'All',
  searchText: string
): NoticeItem[] {
  const normalizedSearch = searchText.trim().toLowerCase();
  return notices.filter((notice) => {
    const matchesCategory = category === 'All' || notice.category === category;
    if (!matchesCategory) return false;
    if (!normalizedSearch) return true;
    return (
      notice.title.toLowerCase().includes(normalizedSearch) ||
      notice.summary.toLowerCase().includes(normalizedSearch) ||
      notice.referenceNo.toLowerCase().includes(normalizedSearch)
    );
  });
}

export function filterStudyMaterials(
  items: StudyMaterialItem[],
  classFilter: ClassLevel | 'All',
  kindFilter: StudyMaterialKind | 'All',
  searchText: string
): StudyMaterialItem[] {
  const q = searchText.trim().toLowerCase();
  return items.filter((item) => {
    if (classFilter !== 'All' && item.classLevel !== classFilter) return false;
    if (kindFilter !== 'All' && item.kind !== kindFilter) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.titleHi.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    );
  });
}

export function filterHomework(
  items: HomeworkItem[],
  classFilter: ClassLevel | 'All',
  mode: 'all' | 'daily' | 'holiday'
): HomeworkItem[] {
  return items.filter((item) => {
    if (classFilter !== 'All' && item.classLevel !== classFilter) return false;
    if (mode === 'daily' && item.isHolidayHomework) return false;
    if (mode === 'holiday' && !item.isHolidayHomework) return false;
    return true;
  });
}

export function verifyAdminPasscode(input: string): boolean {
  return input.trim().toUpperCase() === DEMO_ADMIN_PASSCODE;
}

export function buildPrintableTextDownload(item: StudyMaterialItem): string {
  return [
    '============================================================',
    'MIRACULOUS CHILDREN ACADEMY · NIKHURA, BUXAR, BIHAR, INDIA',
    'CBSE Pattern Digital Learning Material',
    '============================================================',
    `Title (EN): ${item.title}`,
    `Title (HI): ${item.titleHi}`,
    `Class     : ${item.classLevel}`,
    `Subject   : ${item.subject}`,
    `Type      : ${item.kind}`,
    `Updated   : ${item.updatedDate}`,
    `Faculty   : ${item.author}`,
    '------------------------------------------------------------',
    item.summary,
    '',
    item.content,
    '============================================================',
  ].join('\n');
}

export function validateContactInquiry(form: ContactInquiry): ContactValidationResult {
  const errors: ContactValidationResult['errors'] = {};

  if (form.fullName.trim().length < 2) {
    errors.fullName = 'Please enter the parent or guardian full name.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const digits = form.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    errors.phone = 'Enter a valid 10-digit contact phone number.';
  }

  if (form.subject.trim().length < 3) {
    errors.subject = 'Please provide an inquiry subject.';
  }

  if (form.message.trim().length < 10) {
    errors.message = 'Please write at least 10 characters in your message.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export const DEFAULT_PRIMARY_COLOR = '#0F2859';

export interface BrandColorPreset {
  hex: string;
  labelEn: string;
  labelHi: string;
}

export const BRAND_COLOR_PRESETS: BrandColorPreset[] = [
  { hex: '#0F2859', labelEn: 'Royal Blue', labelHi: 'रॉयल ब्लू' },
  { hex: '#0F4C3A', labelEn: 'Emerald Green', labelHi: 'एमरल्ड ग्रीन' },
  { hex: '#6B1D2F', labelEn: 'Crimson Maroon', labelHi: 'क्रिमसन मैरून' },
  { hex: '#2E1A6B', labelEn: 'Imperial Indigo', labelHi: 'इम्पीरियल इंडिगो' },
  { hex: '#0E4D64', labelEn: 'Oxford Teal', labelHi: 'ऑक्सफोर्ड टील' },
  { hex: '#1E293B', labelEn: 'Heritage Slate', labelHi: 'हेरिटेज स्लेट' },
];

export interface DerivedBrandPalette {
  c950: string;
  c900: string;
  c800: string;
  c700: string;
  c100: string;
  c50: string;
}

export function normalizeHexColor(
  input: string,
  fallback: string = DEFAULT_PRIMARY_COLOR
): string {
  const cleaned = input.trim();
  const shortMatch = /^#?([0-9A-Fa-f]{3})$/.exec(cleaned);
  if (shortMatch) {
    const [r, g, b] = shortMatch[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  const fullMatch = /^#?([0-9A-Fa-f]{6})$/.exec(cleaned);
  if (fullMatch) {
    return `#${fullMatch[1].toUpperCase()}`;
  }
  return fallback.toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHexColor(hex);
  const int = parseInt(normalized.slice(1), 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function mixHex(hexA: string, hexB: string, weightB: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const w = Math.max(0, Math.min(1, weightB));
  return rgbToHex(
    a.r * (1 - w) + b.r * w,
    a.g * (1 - w) + b.g * w,
    a.b * (1 - w) + b.b * w
  );
}

export function deriveBrandPalette(primaryHex: string): DerivedBrandPalette {
  const normalized = normalizeHexColor(primaryHex, DEFAULT_PRIMARY_COLOR);
  if (normalized === DEFAULT_PRIMARY_COLOR) {
    return {
      c950: '#09193A',
      c900: '#0F2859',
      c800: '#17387A',
      c700: '#1E4899',
      c100: '#E2EAF7',
      c50: '#F0F4FB',
    };
  }
  return {
    c950: mixHex(normalized, '#000000', 0.36),
    c900: normalized,
    c800: mixHex(normalized, '#FFFFFF', 0.14),
    c700: mixHex(normalized, '#FFFFFF', 0.28),
    c100: mixHex(normalized, '#FFFFFF', 0.86),
    c50: mixHex(normalized, '#FFFFFF', 0.94),
  };
}

export function computeContrastWithWhite(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return Math.round((1.05 / (lum + 0.05)) * 100) / 100;
}


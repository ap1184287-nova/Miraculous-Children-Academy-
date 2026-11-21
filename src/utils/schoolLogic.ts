import type {
  AttendanceMonth,
  ContactInquiry,
  NoticeCategory,
  NoticeItem,
  StudentRecord,
  StudentSearchQuery,
  SubjectMark,
} from '../types/school';

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

export type PageId =
  | 'home'
  | 'about'
  | 'classes'
  | 'portal'
  | 'notices'
  | 'gallery'
  | 'contact'
  | 'admin';

export type ClassLevel =
  | 'Nursery'
  | 'LKG'
  | 'UKG'
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10';

export type Section = 'A' | 'B' | 'C';

export type AcademicStageId = 'foundational' | 'preparatory' | 'middle' | 'secondary';

export interface ClassCurriculum {
  classLevel: ClassLevel;
  stageId: AcademicStageId;
  stageName: string;
  ageGroup: string;
  sections: Section[];
  coreSubjects: string[];
  coCurriculars: string[];
  assessmentPattern: string;
  focusSummary: string;
}

export interface AttendanceMonth {
  month: string;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
}

export interface SubjectMark {
  code: string;
  subject: string;
  theoryMarks: number;
  theoryMax: number;
  internalMarks: number;
  internalMax: number;
}

export interface ExamTermRecord {
  termId: string;
  termName: string;
  publishedDate: string;
  teacherRemarks: string;
  subjects: SubjectMark[];
}

export interface StudentRecord {
  studentId: string;
  rollNumber: string;
  classLevel: ClassLevel;
  section: Section;
  fullName: string;
  academicSession: string;
  house: 'Sapphire' | 'Goldcrest' | 'Emerald' | 'Crimson';
  classTeacher: string;
  guardianName: string;
  guardianContactMasked: string;
  dateOfBirthMasked: string;
  isDemoRecord: true;
  attendance: AttendanceMonth[];
  exams: ExamTermRecord[];
}

export type NoticeCategory =
  | 'Academic'
  | 'Examination'
  | 'Holidays'
  | 'Circulars'
  | 'Events';

export interface NoticeItem {
  id: string;
  referenceNo: string;
  title: string;
  category: NoticeCategory;
  date: string;
  audience: string;
  summary: string;
  body: string;
  isPinned?: boolean;
}

export type GalleryCategory = 'Campus' | 'Academics' | 'Laboratories' | 'Sports & Arts';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  imageUrl: string;
  aspectLabel: string;
}

export interface ContactInquiry {
  fullName: string;
  email: string;
  phone: string;
  classApplying: ClassLevel;
  subject: string;
  message: string;
}

export type DailyAttendanceStatus = 'Present' | 'Absent' | 'Leave';

export interface StudentSearchQuery {
  rollNumber: string;
  classLevel: ClassLevel | '';
  section: Section | '';
}

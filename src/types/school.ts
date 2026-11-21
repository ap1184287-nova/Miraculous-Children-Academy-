export type LanguageCode = 'en' | 'hi';

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
  classTeacher: string;
  coreSubjects: string[];
  coCurriculars: string[];
  assessmentPattern: string;
  focusSummary: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  nameHi: string;
  role: string;
  roleHi: string;
  qualification: string;
  subjects: string;
  classesHandled: string;
  experienceYears: number;
}

export type StudyMaterialKind = 'material' | 'worksheet' | 'sample-paper';

export interface StudyMaterialItem {
  id: string;
  title: string;
  titleHi: string;
  classLevel: ClassLevel;
  subject: string;
  kind: StudyMaterialKind;
  summary: string;
  content: string;
  updatedDate: string;
  author: string;
}

export interface HomeworkItem {
  id: string;
  classLevel: ClassLevel;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  isHolidayHomework: boolean;
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

export type GalleryCategory = 'School' | 'Events' | 'Sports & Cultural';

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

export interface ContactMessageRecord extends ContactInquiry {
  id: string;
  referenceNo: string;
  submittedAt: string;
}

export interface SiteContentConfig {
  schoolName: string;
  schoolNameHi: string;
  heroTitle: string;
  heroTitleHi: string;
  heroSubtitle: string;
  heroSubtitleHi: string;
  welcomeTitle: string;
  welcomeTitleHi: string;
  welcomeMessage: string;
  welcomeMessageHi: string;
  principalName: string;
  principalQualification: string;
  principalMessage: string;
  principalMessageHi: string;
  address: string;
  addressHi: string;
  phone: string;
  email: string;
  officeHours: string;
  admissionsBanner: string;
  admissionsBannerHi: string;
  primaryColor: string;
}

export type DailyAttendanceStatus = 'Present' | 'Absent' | 'Leave';

export interface StudentSearchQuery {
  rollNumber: string;
  classLevel: ClassLevel | '';
  section: Section | '';
}

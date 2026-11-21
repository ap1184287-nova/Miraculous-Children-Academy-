import type { NoticeItem, StudentRecord } from '../types/school';
import { DEMO_STUDENTS, INITIAL_NOTICES } from '../data/demoData';

/**
 * Firebase-Ready Repository Architecture
 * --------------------------------------
 * When migrating from Demo Mode to production Firebase:
 * 1. Configure Firebase Auth & Firestore via secure environment config (never hardcode secrets).
 * 2. Replace `LocalDemoSchoolRepository` with `FirestoreSchoolRepository` implementing this interface.
 * 3. Enforce Firestore Security Rules so `students/{studentId}` is only readable by the authenticated
 *    parent/student UID or verified `admin` custom-claim role.
 */
export interface SchoolDataRepository {
  readonly mode: 'demo-local' | 'firebase-live';
  getStudents(): Promise<StudentRecord[]>;
  getNotices(): Promise<NoticeItem[]>;
}

export interface FirebaseReadinessItem {
  layer: string;
  collectionOrService: string;
  status: 'Prepared Interface' | 'Requires Auth Setup';
  notes: string;
}

export const FIREBASE_READINESS_PLAN: FirebaseReadinessItem[] = [
  {
    layer: 'Authentication',
    collectionOrService: 'Firebase Auth (Email / Phone OTP)',
    status: 'Requires Auth Setup',
    notes: 'Guards Student Portal & Admin Console; prevents public enumeration of student records.',
  },
  {
    layer: 'Student Profiles',
    collectionOrService: 'firestore:/students/{studentId}',
    status: 'Prepared Interface',
    notes: 'Indexed by classLevel, section, and rollNumber with guardianUid ownership claim.',
  },
  {
    layer: 'Attendance Logs',
    collectionOrService: 'firestore:/attendance/{session}/{docId}',
    status: 'Prepared Interface',
    notes: 'Read-only for verified guardianUid; write-restricted to teacher/admin role.',
  },
  {
    layer: 'Exam Results',
    collectionOrService: 'firestore:/results/{studentId}/terms/{termId}',
    status: 'Prepared Interface',
    notes: 'Stores CBSE subject-wise theory and internal assessment marks.',
  },
  {
    layer: 'School Notices',
    collectionOrService: 'firestore:/notices/{noticeId}',
    status: 'Prepared Interface',
    notes: 'Public read access for published circulars; admin-only write access.',
  },
];

export class LocalDemoSchoolRepository implements SchoolDataRepository {
  readonly mode = 'demo-local' as const;

  async getStudents(): Promise<StudentRecord[]> {
    return DEMO_STUDENTS;
  }

  async getNotices(): Promise<NoticeItem[]> {
    return INITIAL_NOTICES;
  }
}

export const schoolRepository: SchoolDataRepository = new LocalDemoSchoolRepository();

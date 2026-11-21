import type { NoticeItem, StudentRecord } from '../types/school';
import { DEMO_STUDENTS, INITIAL_NOTICES } from '../data/demoData';

export const STORAGE_KEYS = {
  lang: 'mca_buxar_lang_v1',
  notices: 'mca_buxar_notices_v1',
  gallery: 'mca_buxar_gallery_v1',
  materials: 'mca_buxar_materials_v1',
  homework: 'mca_buxar_homework_v1',
  teachers: 'mca_buxar_teachers_v1',
  classes: 'mca_buxar_classes_v1',
  students: 'mca_buxar_students_v1',
  siteConfig: 'mca_buxar_site_config_v1',
  inquiries: 'mca_buxar_inquiries_v1',
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function clearAllPortalStorage(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.lang) {
        window.localStorage.removeItem(k);
      }
    });
  } catch {
    // Ignore storage access errors in restricted sandboxes
  }
}

/**
 * Firebase-Ready Repository Architecture
 * --------------------------------------
 * Zero-budget static mode persists Admin updates in browser localStorage.
 * When migrating to production Firebase:
 * 1. Configure Firebase Auth & Firestore via environment config (never hardcode secrets).
 * 2. Replace `LocalDemoSchoolRepository` with `FirestoreSchoolRepository`.
 * 3. Enforce Firestore Security Rules so `students/{studentId}` is only readable by
 *    the authenticated parent/student UID or verified `admin` role.
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
    notes: 'Guards Student Lookup & Admin Panel; prevents public enumeration of student records.',
  },
  {
    layer: 'Student Profiles',
    collectionOrService: 'firestore:/students/{studentId}',
    status: 'Prepared Interface',
    notes: 'Indexed by classLevel, section, and rollNumber with guardianUid ownership claim.',
  },
  {
    layer: 'Notices & Circulars',
    collectionOrService: 'firestore:/notices/{noticeId}',
    status: 'Prepared Interface',
    notes: 'Public read access for published notices; admin-only create/delete access.',
  },
  {
    layer: 'Study Materials & Homework',
    collectionOrService: 'firestore:/academics/{classLevel}/items/{itemId}',
    status: 'Prepared Interface',
    notes: 'Class-wise notes, sample papers, and daily/holiday homework managed by faculty/admin.',
  },
  {
    layer: 'Gallery & Site Content',
    collectionOrService: 'firestore:/cms/siteConfig + Firebase Storage',
    status: 'Prepared Interface',
    notes: 'Stores school banner messages, principal desk text, helpline, and compressed event photos.',
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

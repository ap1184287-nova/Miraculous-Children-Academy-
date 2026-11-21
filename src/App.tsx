import { useEffect, useState } from 'react';
import {
  CLASS_CURRICULUM_LIST,
  DEFAULT_SITE_CONFIG,
  DEMO_STUDENTS,
  INITIAL_GALLERY_ITEMS,
  INITIAL_HOMEWORK,
  INITIAL_NOTICES,
  INITIAL_STUDY_MATERIALS,
  INITIAL_TEACHERS,
} from './data/demoData';
import {
  clearAllPortalStorage,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from './services/repository';
import type {
  ClassCurriculum,
  ClassLevel,
  ContactMessageRecord,
  GalleryItem,
  HomeworkItem,
  LanguageCode,
  NoticeItem,
  PageId,
  SiteContentConfig,
  StudentRecord,
  StudyMaterialItem,
  TeacherProfile,
} from './types/school';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ClassesPage } from './components/pages/ClassesPage';
import { NoticesPage } from './components/pages/NoticesPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ContactPage } from './components/pages/ContactPage';
import { StudentPortalPage } from './components/portal/StudentPortalPage';
import { AdminDashboardPage } from './components/portal/AdminDashboardPage';
import { DEFAULT_PRIMARY_COLOR, deriveBrandPalette } from './utils/schoolLogic';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [lang, setLang] = useState<LanguageCode>(() =>
    loadFromStorage<LanguageCode>(STORAGE_KEYS.lang, 'en')
  );

  const [siteConfig, setSiteConfig] = useState<SiteContentConfig>(() => ({
    ...DEFAULT_SITE_CONFIG,
    ...loadFromStorage<Partial<SiteContentConfig>>(STORAGE_KEYS.siteConfig, DEFAULT_SITE_CONFIG),
  }));
  const [students, setStudents] = useState<StudentRecord[]>(() =>
    loadFromStorage<StudentRecord[]>(STORAGE_KEYS.students, DEMO_STUDENTS)
  );
  const [notices, setNotices] = useState<NoticeItem[]>(() =>
    loadFromStorage<NoticeItem[]>(STORAGE_KEYS.notices, INITIAL_NOTICES)
  );
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    loadFromStorage<GalleryItem[]>(STORAGE_KEYS.gallery, INITIAL_GALLERY_ITEMS)
  );
  const [materials, setMaterials] = useState<StudyMaterialItem[]>(() =>
    loadFromStorage<StudyMaterialItem[]>(STORAGE_KEYS.materials, INITIAL_STUDY_MATERIALS)
  );
  const [homework, setHomework] = useState<HomeworkItem[]>(() =>
    loadFromStorage<HomeworkItem[]>(STORAGE_KEYS.homework, INITIAL_HOMEWORK)
  );
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() =>
    loadFromStorage<TeacherProfile[]>(STORAGE_KEYS.teachers, INITIAL_TEACHERS)
  );
  const [classes, setClasses] = useState<ClassCurriculum[]>(() =>
    loadFromStorage<ClassCurriculum[]>(STORAGE_KEYS.classes, CLASS_CURRICULUM_LIST)
  );
  const [inquiries, setInquiries] = useState<ContactMessageRecord[]>(() =>
    loadFromStorage<ContactMessageRecord[]>(STORAGE_KEYS.inquiries, [])
  );

  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.lang, lang);
  }, [lang]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.siteConfig, siteConfig);
  }, [siteConfig]);

  useEffect(() => {
    const palette = deriveBrandPalette(siteConfig.primaryColor || DEFAULT_PRIMARY_COLOR);
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--color-royal-950', palette.c950);
    rootStyle.setProperty('--color-royal-900', palette.c900);
    rootStyle.setProperty('--color-royal-800', palette.c800);
    rootStyle.setProperty('--color-royal-700', palette.c700);
    rootStyle.setProperty('--color-royal-100', palette.c100);
    rootStyle.setProperty('--color-royal-50', palette.c50);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', palette.c900);
    }
  }, [siteConfig.primaryColor]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.students, students);
  }, [students]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.notices, notices);
  }, [notices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.gallery, gallery);
  }, [gallery]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.materials, materials);
  }, [materials]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.homework, homework);
  }, [homework]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.teachers, teachers);
  }, [teachers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.classes, classes);
  }, [classes]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.inquiries, inquiries);
  }, [inquiries]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleUpdateStudentMark = (
    studentId: string,
    termId: string,
    subjectCode: string,
    newTheoryMarks: number
  ) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.studentId !== studentId) return student;
        return {
          ...student,
          exams: student.exams.map((exam) => {
            if (exam.termId !== termId) return exam;
            return {
              ...exam,
              subjects: exam.subjects.map((sub) =>
                sub.code === subjectCode ? { ...sub, theoryMarks: newTheoryMarks } : sub
              ),
            };
          }),
        };
      })
    );
  };

  const handleUpdateClassTeacher = (classLevel: ClassLevel, classTeacher: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.classLevel === classLevel ? { ...c, classTeacher } : c))
    );
  };

  const handleResetAllDemoData = () => {
    clearAllPortalStorage();
    setSiteConfig(DEFAULT_SITE_CONFIG);
    setStudents(DEMO_STUDENTS);
    setNotices(INITIAL_NOTICES);
    setGallery(INITIAL_GALLERY_ITEMS);
    setMaterials(INITIAL_STUDY_MATERIALS);
    setHomework(INITIAL_HOMEWORK);
    setTeachers(INITIAL_TEACHERS);
    setClasses(CLASS_CURRICULUM_LIST);
    setInquiries([]);
  };

  const displaySchoolName = lang === 'hi' ? siteConfig.schoolNameHi : siteConfig.schoolName;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar
        activePage={activePage}
        lang={lang}
        schoolName={displaySchoolName}
        onToggleLang={handleToggleLang}
        onNavigate={setActivePage}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            lang={lang}
            siteConfig={siteConfig}
            notices={notices}
            gallery={gallery}
            onNavigate={setActivePage}
            onSelectNotice={setSelectedNotice}
          />
        )}
        {activePage === 'about' && (
          <AboutPage
            lang={lang}
            siteConfig={siteConfig}
            teachers={teachers}
            onNavigate={setActivePage}
          />
        )}
        {activePage === 'classes' && (
          <ClassesPage
            lang={lang}
            classes={classes}
            homework={homework}
            materials={materials}
            onNavigate={setActivePage}
          />
        )}
        {activePage === 'notices' && (
          <NoticesPage
            lang={lang}
            notices={notices}
            selectedNotice={selectedNotice}
            onSelectNotice={setSelectedNotice}
          />
        )}
        {activePage === 'gallery' && <GalleryPage lang={lang} gallery={gallery} />}
        {activePage === 'contact' && (
          <ContactPage
            lang={lang}
            siteConfig={siteConfig}
            onAddInquiry={(rec) => setInquiries((prev) => [rec, ...prev])}
          />
        )}
        {activePage === 'portal' && (
          <StudentPortalPage
            lang={lang}
            students={students}
            materials={materials}
            homework={homework}
            onNavigate={setActivePage}
          />
        )}
        {activePage === 'admin' && (
          <AdminDashboardPage
            lang={lang}
            students={students}
            notices={notices}
            gallery={gallery}
            materials={materials}
            homework={homework}
            teachers={teachers}
            classes={classes}
            siteConfig={siteConfig}
            inquiries={inquiries}
            onAddStudent={(st) => setStudents((prev) => [st, ...prev])}
            onAddNotice={(n) => setNotices((prev) => [n, ...prev])}
            onDeleteNotice={(id) => setNotices((prev) => prev.filter((n) => n.id !== id))}
            onAddGalleryItem={(item) => setGallery((prev) => [item, ...prev])}
            onDeleteGalleryItem={(id) => setGallery((prev) => prev.filter((g) => g.id !== id))}
            onAddMaterial={(m) => setMaterials((prev) => [m, ...prev])}
            onDeleteMaterial={(id) => setMaterials((prev) => prev.filter((m) => m.id !== id))}
            onAddHomework={(h) => setHomework((prev) => [h, ...prev])}
            onDeleteHomework={(id) => setHomework((prev) => prev.filter((h) => h.id !== id))}
            onAddTeacher={(tch) => setTeachers((prev) => [...prev, tch])}
            onDeleteTeacher={(id) => setTeachers((prev) => prev.filter((t) => t.id !== id))}
            onUpdateClassTeacher={handleUpdateClassTeacher}
            onUpdateSiteConfig={setSiteConfig}
            onUpdateStudentMark={handleUpdateStudentMark}
            onResetAllDemoData={handleResetAllDemoData}
            onNavigate={setActivePage}
          />
        )}
      </main>

      <Footer
        lang={lang}
        siteConfig={siteConfig}
        onToggleLang={handleToggleLang}
        onNavigate={setActivePage}
      />
      <OfflineIndicator lang={lang} />
    </div>
  );
}

import { useState } from 'react';
import { DEMO_STUDENTS, INITIAL_NOTICES } from './data/demoData';
import type { NoticeItem, PageId, StudentRecord } from './types/school';
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

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [students, setStudents] = useState<StudentRecord[]>(DEMO_STUDENTS);
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const handleAddStudent = (newStudent: StudentRecord) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleAddNotice = (newNotice: NoticeItem) => {
    setNotices((prev) => [newNotice, ...prev]);
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            notices={notices}
            onNavigate={setActivePage}
            onSelectNotice={setSelectedNotice}
          />
        )}
        {activePage === 'about' && <AboutPage onNavigate={setActivePage} />}
        {activePage === 'classes' && <ClassesPage onNavigate={setActivePage} />}
        {activePage === 'notices' && (
          <NoticesPage
            notices={notices}
            selectedNotice={selectedNotice}
            onSelectNotice={setSelectedNotice}
          />
        )}
        {activePage === 'gallery' && <GalleryPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'portal' && (
          <StudentPortalPage students={students} onNavigate={setActivePage} />
        )}
        {activePage === 'admin' && (
          <AdminDashboardPage
            students={students}
            notices={notices}
            onAddStudent={handleAddStudent}
            onAddNotice={handleAddNotice}
            onUpdateStudentMark={handleUpdateStudentMark}
            onNavigate={setActivePage}
          />
        )}
      </main>

      <Footer onNavigate={setActivePage} />
      <OfflineIndicator />
    </div>
  );
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPrintableTextDownload,
  computeAttendanceSummary,
  computeCbseGrade,
  computeContrastWithWhite,
  computeExamSummary,
  deriveBrandPalette,
  filterHomework,
  filterNotices,
  filterStudyMaterials,
  findDemoStudent,
  normalizeHexColor,
  validateContactInquiry,
  validateStudentSearchQuery,
  verifyAdminPasscode,
} from './schoolLogic';
import type {
  HomeworkItem,
  NoticeItem,
  StudentRecord,
  StudyMaterialItem,
} from '../types/school';

test('computeCbseGrade maps percentage thresholds accurately', () => {
  assert.equal(computeCbseGrade(95), 'A1');
  assert.equal(computeCbseGrade(91), 'A1');
  assert.equal(computeCbseGrade(84), 'A2');
  assert.equal(computeCbseGrade(72), 'B1');
  assert.equal(computeCbseGrade(65), 'B2');
  assert.equal(computeCbseGrade(33), 'D');
  assert.equal(computeCbseGrade(28), 'E');
});

test('computeExamSummary calculates subject totals, percentage, and pass status', () => {
  const summary = computeExamSummary([
    { code: 'ENG', subject: 'English', theoryMarks: 72, theoryMax: 80, internalMarks: 19, internalMax: 20 },
    { code: 'MAT', subject: 'Mathematics', theoryMarks: 76, theoryMax: 80, internalMarks: 20, internalMax: 20 },
  ]);
  assert.equal(summary.totalObtained, 187);
  assert.equal(summary.totalMax, 200);
  assert.equal(summary.percentage, 93.5);
  assert.equal(summary.overallGrade, 'A1');
  assert.equal(summary.passedAll, true);

  const failingSummary = computeExamSummary([
    { code: 'MAT', subject: 'Mathematics', theoryMarks: 20, theoryMax: 80, internalMarks: 10, internalMax: 20 },
  ]);
  assert.equal(failingSummary.passedAll, false);
  assert.equal(failingSummary.overallGrade, 'E');
});

test('computeAttendanceSummary aggregates working and present days accurately', () => {
  const summary = computeAttendanceSummary([
    { month: 'April', workingDays: 22, presentDays: 20, absentDays: 1, leaveDays: 1 },
    { month: 'May', workingDays: 18, presentDays: 18, absentDays: 0, leaveDays: 0 },
  ]);
  assert.equal(summary.totalWorkingDays, 40);
  assert.equal(summary.totalPresent, 38);
  assert.equal(summary.totalAbsent, 1);
  assert.equal(summary.totalLeave, 1);
  assert.equal(summary.percentage, 95);
});

test('validateStudentSearchQuery rejects empty fields and accepts valid query', () => {
  const invalid = validateStudentSearchQuery({ rollNumber: '', classLevel: '', section: '' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.rollNumber);
  assert.ok(invalid.errors.classLevel);
  assert.ok(invalid.errors.section);

  const valid = validateStudentSearchQuery({ rollNumber: '101', classLevel: 'Class 10', section: 'A' });
  assert.equal(valid.valid, true);
});

test('findDemoStudent matches rollNumber case-insensitively with class and section', () => {
  const demoStudents: StudentRecord[] = [
    {
      studentId: 'MCA-2026-10A-0101',
      rollNumber: '101',
      classLevel: 'Class 10',
      section: 'A',
      fullName: 'Aarav Sharma (Demo)',
      academicSession: '2026-27',
      house: 'Sapphire',
      classTeacher: 'Mrs. Sunita Nair',
      guardianName: 'Rajesh Sharma (Demo)',
      guardianContactMasked: 'Verified Demo Guardian',
      dateOfBirthMasked: '14-Aug-2011',
      isDemoRecord: true,
      attendance: [],
      exams: [],
    },
  ];

  const found = findDemoStudent(demoStudents, {
    rollNumber: ' 101 ',
    classLevel: 'Class 10',
    section: 'A',
  });
  assert.equal(found?.studentId, 'MCA-2026-10A-0101');

  const missing = findDemoStudent(demoStudents, {
    rollNumber: '999',
    classLevel: 'Class 10',
    section: 'A',
  });
  assert.equal(missing, null);
});

test('filterNotices filters by category and search text', () => {
  const notices: NoticeItem[] = [
    {
      id: 'n1',
      referenceNo: 'MCA/2026/01',
      title: 'Half-Yearly Examination Datesheet',
      category: 'Examination',
      date: '2026-11-12',
      audience: 'Classes 1–10',
      summary: 'Term 1 assessment timetable.',
      body: 'Full schedule.',
    },
    {
      id: 'n2',
      referenceNo: 'MCA/2026/02',
      title: 'Annual Sports Meet Registration',
      category: 'Events',
      date: '2026-11-15',
      audience: 'All Classes',
      summary: 'House athletic trials.',
      body: 'Details inside.',
    },
  ];

  assert.equal(filterNotices(notices, 'All', '').length, 2);
  assert.equal(filterNotices(notices, 'Examination', '').length, 1);
  assert.equal(filterNotices(notices, 'All', 'sports').length, 1);
});

test('validateContactInquiry validates email, phone, and message length', () => {
  const invalid = validateContactInquiry({
    fullName: 'A',
    email: 'bad-email',
    phone: '123',
    classApplying: 'Class 1',
    subject: 'Hi',
    message: 'Short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactInquiry({
    fullName: 'Priya Menon',
    email: 'priya.menon@example.com',
    phone: '9876543210',
    classApplying: 'Class 4',
    subject: 'Admission Enquiry 2027-28',
    message: 'Would like to schedule a campus tour for Class 4 admission.',
  });
  assert.equal(valid.valid, true);
});

test('filterStudyMaterials filters by class, kind, and bilingual search query', () => {
  const materials: StudyMaterialItem[] = [
    {
      id: 'm1',
      title: 'Quadratic Equations Revision Notes',
      titleHi: 'द्विघात समीकरण पुनरावृत्ति नोट्स',
      classLevel: 'Class 10',
      subject: 'Mathematics',
      kind: 'material',
      summary: 'Formula sheet and NCERT examples.',
      content: 'ax^2 + bx + c = 0',
      updatedDate: '20 Nov 2026',
      author: 'Mr. Rakesh Kumar',
    },
    {
      id: 'm2',
      title: 'Class 8 Science Sample Paper',
      titleHi: 'कक्षा 8 विज्ञान सैंपल पेपर',
      classLevel: 'Class 8',
      subject: 'Science',
      kind: 'sample-paper',
      summary: '80-mark CBSE pattern practice paper.',
      content: 'Section A MCQs...',
      updatedDate: '18 Nov 2026',
      author: 'Mrs. Sunita Nair',
    },
  ];

  assert.equal(filterStudyMaterials(materials, 'All', 'All', '').length, 2);
  assert.equal(filterStudyMaterials(materials, 'Class 10', 'All', '').length, 1);
  assert.equal(filterStudyMaterials(materials, 'All', 'sample-paper', '').length, 1);
  assert.equal(filterStudyMaterials(materials, 'All', 'All', 'द्विघात').length, 1);
});

test('filterHomework filters by class and holiday vs daily mode', () => {
  const homework: HomeworkItem[] = [
    {
      id: 'h1',
      classLevel: 'Class 5',
      subject: 'Mathematics',
      title: 'Fractions Exercise 4.2',
      description: 'Solve questions 1 to 10 in notebook.',
      assignedDate: '20 Nov 2026',
      dueDate: '22 Nov 2026',
      isHolidayHomework: false,
    },
    {
      id: 'h2',
      classLevel: 'Class 10',
      subject: 'Science',
      title: 'Winter Break Lab Record',
      description: 'Complete practical diagrams for optics.',
      assignedDate: '19 Nov 2026',
      dueDate: '02 Dec 2026',
      isHolidayHomework: true,
    },
  ];

  assert.equal(filterHomework(homework, 'All', 'all').length, 2);
  assert.equal(filterHomework(homework, 'All', 'daily').length, 1);
  assert.equal(filterHomework(homework, 'All', 'holiday').length, 1);
  assert.equal(filterHomework(homework, 'Class 10', 'holiday').length, 1);
  assert.equal(filterHomework(homework, 'Class 5', 'holiday').length, 0);
});

test('verifyAdminPasscode checks demo passcode accurately', () => {
  assert.equal(verifyAdminPasscode('MCA-ADMIN-2026'), true);
  assert.equal(verifyAdminPasscode(' mca-admin-2026 '), true);
  assert.equal(verifyAdminPasscode('wrong-pass'), false);
  assert.equal(verifyAdminPasscode(''), false);
});

test('buildPrintableTextDownload formats study item metadata and body cleanly', () => {
  const txt = buildPrintableTextDownload({
    id: 'm1',
    title: 'Trigonometry Sheet',
    titleHi: 'त्रिकोणमिति नोट्स',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    kind: 'worksheet',
    summary: 'Identity proofs.',
    content: 'sin^2 x + cos^2 x = 1',
    updatedDate: '20 Nov 2026',
    author: 'Faculty',
  });
  assert.ok(txt.includes('NIKHURA, BUXAR, BIHAR'));
  assert.ok(txt.includes('Trigonometry Sheet'));
  assert.ok(txt.includes('sin^2 x + cos^2 x = 1'));
});

test('normalizeHexColor normalizes short/full hex and falls back safely', () => {
  assert.equal(normalizeHexColor('#0f2859'), '#0F2859');
  assert.equal(normalizeHexColor('1a3'), '#11AA33');
  assert.equal(normalizeHexColor('invalid-color'), '#0F2859');
});

test('deriveBrandPalette preserves Royal Blue defaults and derives shades for custom colors', () => {
  const royal = deriveBrandPalette('#0F2859');
  assert.equal(royal.c900, '#0F2859');
  assert.equal(royal.c950, '#09193A');
  assert.equal(royal.c50, '#F0F4FB');

  const emerald = deriveBrandPalette('#0F4C3A');
  assert.equal(emerald.c900, '#0F4C3A');
  assert.notEqual(emerald.c950, '#0F4C3A');
  assert.notEqual(emerald.c50, '#0F4C3A');
});

test('computeContrastWithWhite distinguishes high-contrast dark shades from light colors', () => {
  assert.ok(computeContrastWithWhite('#0F2859') >= 10);
  assert.ok(computeContrastWithWhite('#0F4C3A') >= 8);
  assert.ok(computeContrastWithWhite('#FFFFFF') === 1);
});


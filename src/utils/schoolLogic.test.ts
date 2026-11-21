import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAttendanceSummary,
  computeCbseGrade,
  computeExamSummary,
  filterNotices,
  findDemoStudent,
  validateContactInquiry,
  validateStudentSearchQuery,
} from './schoolLogic';
import type { NoticeItem, StudentRecord } from '../types/school';

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
      guardianContactMasked: '+91 98XXX XX410',
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

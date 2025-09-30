export interface AdmissionApplication {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  applicationDate: string;
  documents: string[];
  feesPaid: boolean;
  reviewDate?: string;
  reviewRemarks?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  type: 'tuition' | 'hostel' | 'library' | 'exam' | 'other';
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  receiptNumber?: string;
}

export interface HostelRoom {
  id: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  students: string[];
  type: 'single' | 'double' | 'triple';
  floor: number;
  amenities: string[];
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'available' | 'issued' | 'reserved';
  issuedTo?: string;
  issuedDate?: string;
  dueDate?: string;
}

export interface DashboardMetrics {
  totalStudents: number;
  totalRevenue: number;
  hostelOccupancy: number;
  pendingAdmissions: number;
  overduePayments: number;
  booksIssued: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  instructor: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment';
  date: string;
  duration: number;
  maxMarks: number;
  status: 'scheduled' | 'completed' | 'graded' | 'pending';
  semester: number;
}

export interface StudentExamResult {
  id: string;
  studentId: string;
  examId: string;
  obtainedMarks: number;
  grade: string;
  status: 'graded';
}

// Mock data
export const mockAdmissions: AdmissionApplication[] = [
  {
    id: '1',
    studentName: 'Itadori Yuji',
    email: 'yuji.itadori@student.college.edu',
    phone: '+1234567890',
    course: 'CSE',
    status: 'pending',
    applicationDate: '2024-01-15',
    documents: ['10th Certificate', '12th Certificate', 'Transfer Certificate'],
    feesPaid: false
  },
  {
    id: '2',
    studentName: 'Nobara Kugisaki',
    email: 'nobara.kugisaki@student.college.edu',
    phone: '+1234567891',
    course: 'ECE',
    status: 'approved',
    applicationDate: '2024-01-10',
    documents: ['10th Certificate', '12th Certificate', 'Transfer Certificate', 'Medical Certificate'],
    feesPaid: true
  },
  {
    id: '3',
    studentName: 'Megumi Fushiguro',
    email: 'megumi.fushiguro@student.college.edu',
    phone: '+1234567892',
    course: 'CSE',
    status: 'rejected',
    applicationDate: '2024-01-20',
    documents: ['10th Certificate', '12th Certificate'],
    feesPaid: false
  }
];

export const mockFees: FeeRecord[] = [
  {
    id: '1',
    studentId: 'CS2024001',
    studentName: 'Itadori Yuji',
    amount: 50000,
    type: 'tuition',
    status: 'paid',
    dueDate: '2024-01-31',
    paidDate: '2024-01-25',
    receiptNumber: 'RCP-2024-001'
  },
  {
    id: '2',
    studentId: 'CS2024001',
    studentName: 'Itadori Yuji',
    amount: 20000,
    type: 'library',
    status: 'pending',
    dueDate: '2024-01-31',
    paidDate: '2024-01-25',
    receiptNumber: 'RCP-2024-001'
  },
  {
    id: '3',
    studentId: 'EC2024002',
    studentName: 'Nobara Kugisaki',
    amount: 15000,
    type: 'hostel',
    status: 'pending',
    dueDate: '2024-02-15',
  },
  {
    id: '4',
    studentId: 'CS2024003',
    studentName: 'Megumi Fushiguro',
    amount: 2000,
    type: 'library',
    status: 'overdue',
    dueDate: '2024-01-15',
  }
];

export const mockHostelRooms: HostelRoom[] = [
  {
    id: '1',
    roomNumber: '101',
    capacity: 2,
    occupied: 2,
    students: ['Itadori Yuji', 'Nobara Kugisaki'],
    type: 'double',
    floor: 1,
    amenities: ['WiFi', 'AC', 'Study Table', 'Wardrobe']
  },
  {
    id: '2',
    roomNumber: '102',
    capacity: 2,
    occupied: 1,
    students: ['Megumi Fushiguro'],
    type: 'double',
    floor: 1,
    amenities: ['WiFi', 'AC', 'Study Table', 'Wardrobe']
  },
  {
    id: '3',
    roomNumber: '201',
    capacity: 3,
    occupied: 0,
    students: [],
    type: 'triple',
    floor: 2,
    amenities: ['WiFi', 'Fan', 'Study Table', 'Wardrobe']
  }
];

export const mockLibraryBooks: LibraryBook[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    category: 'Computer Science',
    status: 'issued',
    issuedTo: 'Itadori Yuji',
    issuedDate: '2024-01-20',
    dueDate: '2024-02-20'
  },
  {
    id: '2',
    title: 'Digital Electronics',
    author: 'R.P. Jain',
    isbn: '978-0070144735',
    category: 'Electronics',
    status: 'available'
  },
  {
    id: '3',
    title: 'Mechanical Engineering Design',
    author: 'Joseph Shigley',
    isbn: '978-0073398204',
    category: 'Mechanical',
    status: 'reserved',
    issuedTo: 'Megumi Fushiguro'
  }
];

export const mockMetrics: DashboardMetrics = {
  totalStudents: 1250,
  totalRevenue: 45000000,
  hostelOccupancy: 85,
  pendingAdmissions: 25,
  overduePayments: 12,
  booksIssued: 450
};

export interface StudentGrade {
  studentId: string;
  studentName: string;
  cgpa: number;
  percentage: number;
  currentSemester: number;
  course: string;
  year: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    grade: string;
    marks: number;
    maxMarks: number;
  }[];
}

export const mockStudentGrades: StudentGrade[] = [
  {
    studentId: 'CS2024001',
    studentName: 'Itadori Yuji',
    cgpa: 8.5,
    percentage: 85,
    currentSemester: 4,
    course: 'CSE',
    year: 2,
    subjects: [
      {
        subjectId: '1',
        subjectName: 'Data Structures and Algorithms',
        grade: 'A',
        marks: 85,
        maxMarks: 100
      },
      {
        subjectId: '2',
        subjectName: 'Database Management Systems',
        grade: 'B+',
        marks: 78,
        maxMarks: 100
      }
    ]
  },
  {
    studentId: 'EC2024002',
    studentName: 'Nobara Kugisaki',
    cgpa: 9.2,
    percentage: 92,
    currentSemester: 4,
    course: 'ECE',
    year: 2,
    subjects: [
      {
        subjectId: '3',
        subjectName: 'Digital Electronics',
        grade: 'A+',
        marks: 95,
        maxMarks: 100
      },
      {
        subjectId: '4',
        subjectName: 'Signal Processing',
        grade: 'A',
        marks: 89,
        maxMarks: 100
      }
    ]
  },
  {
    studentId: 'CS2024003',
    studentName: 'Megumi Fushiguro',
    cgpa: 7.8,
    percentage: 78,
    currentSemester: 4,
    course: 'CSE',
    year: 2,
    subjects: [
      {
        subjectId: '1',
        subjectName: 'Data Structures and Algorithms',
        grade: 'B',
        marks: 75,
        maxMarks: 100
      },
      {
        subjectId: '2',
        subjectName: 'Database Management Systems',
        grade: 'B+',
        marks: 81,
        maxMarks: 100
      }
    ]
  }
];

// Helper function to get monthly revenue
export const getMonthlyRevenue = (): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return mockFees
    .filter(fee => {
      if (fee.status !== 'paid' || !fee.paidDate) return false;
      const paidDate = new Date(fee.paidDate);
      return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
    })
    .reduce((sum, fee) => sum + fee.amount, 0);
};

// Helper function to get top performing students
export const getTopPerformingStudents = (limit: number = 5) => {
  const studentPerformance = mockStudentGrades.map(grade => ({
    studentName: grade.studentName,
    studentId: grade.studentId,
    cgpa: grade.cgpa,
    percentage: grade.percentage
  }));
  
  return studentPerformance
    .sort((a, b) => b.cgpa - a.cgpa)
    .slice(0, limit);
};

// Helper function to get class average
export const getClassAverage = () => {
  const totalCGPA = mockStudentGrades.reduce((sum, grade) => sum + grade.cgpa, 0);
  return mockStudentGrades.length > 0 ? totalCGPA / mockStudentGrades.length : 0;
};

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    credits: 4,
    semester: 4,
    instructor: 'Gojo Sensei'
  },
  {
    id: '2',
    name: 'Database Management Systems',
    code: 'CS202',
    credits: 3,
    semester: 4,
    instructor: 'Gojo Sensei'
  }
];

export const mockExams: Exam[] = [
  {
    id: '1',
    subjectId: '1',
    subjectName: 'Data Structures and Algorithms',
    subjectCode: 'CS201',
    examType: 'midterm',
    date: '2024-02-15',
    duration: 120,
    maxMarks: 100,
    status: 'graded',
    semester: 4
  },
  {
    id: '2',
    subjectId: '2',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS202',
    examType: 'quiz',
    date: '2024-02-20',
    duration: 60,
    maxMarks: 50,
    status: 'scheduled',
    semester: 4
  },
  {
    id: '3',
    subjectId: '1',
    subjectName: 'Data Structures and Algorithms',
    subjectCode: 'CS201',
    examType: 'assignment',
    date: '2024-01-30',
    duration: 0,
    maxMarks: 25,
    status: 'graded',
    semester: 4
  },
  {
    id: '4',
    subjectId: '2',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS202',
    examType: 'final',
    date: '2024-03-15',
    duration: 180,
    maxMarks: 100,
    status: 'scheduled',
    semester: 4
  }
];

export const mockStudentExamResults: StudentExamResult[] = [
  {
    id: '1',
    studentId: 'CS2024001',
    examId: '1',
    obtainedMarks: 85,
    grade: 'A',
    status: 'graded'
  },
  {
    id: '2',
    studentId: 'CS2024001',
    examId: '3',
    obtainedMarks: 22,
    grade: 'B+',
    status: 'graded'
  },
  {
    id: '3',
    studentId: 'EC2024002',
    examId: '1',
    obtainedMarks: 92,
    grade: 'A+',
    status: 'graded'
  },
  {
    id: '4',
    studentId: 'CS2024003',
    examId: '1',
    obtainedMarks: 75,
    grade: 'B',
    status: 'graded'
  }
];

// Helper function to update fee status
export const updateFeeStatus = (feeId: string, newStatus: 'paid' | 'pending' | 'overdue', paidDate?: string, receiptNumber?: string) => {
  const feeIndex = mockFees.findIndex(fee => fee.id === feeId);
  if (feeIndex !== -1) {
    mockFees[feeIndex] = {
      ...mockFees[feeIndex],
      status: newStatus,
      paidDate,
      receiptNumber
    };
  }
};

// Helper function to update student exam result
export const updateStudentExamResult = (studentId: string, examId: string, obtainedMarks: number, grade: string) => {
  const existingResultIndex = mockStudentExamResults.findIndex(
    result => result.studentId === studentId && result.examId === examId
  );
  
  if (existingResultIndex !== -1) {
    mockStudentExamResults[existingResultIndex] = {
      ...mockStudentExamResults[existingResultIndex],
      obtainedMarks,
      grade
    };
  } else {
    mockStudentExamResults.push({
      id: (mockStudentExamResults.length + 1).toString(),
      studentId,
      examId,
      obtainedMarks,
      grade,
      status: 'graded'
    });
  }
  
  // Update exam status to graded
  const examIndex = mockExams.findIndex(exam => exam.id === examId);
  if (examIndex !== -1) {
    mockExams[examIndex].status = 'graded';
  }
  
  // Recalculate student's CGPA and percentage
  const studentResults = mockStudentExamResults.filter(result => result.studentId === studentId);
  if (studentResults.length > 0) {
    const totalMarks = studentResults.reduce((sum, result) => sum + result.obtainedMarks, 0);
    const totalMaxMarks = studentResults.reduce((sum, result) => {
      const exam = mockExams.find(e => e.id === result.examId);
      return sum + (exam?.maxMarks || 0);
    }, 0);
    
    const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
    const cgpa = percentage / 10; // Simple conversion
    
    // Update student grades
    const studentGradeIndex = mockStudentGrades.findIndex(grade => grade.studentId === studentId);
    if (studentGradeIndex !== -1) {
      mockStudentGrades[studentGradeIndex].percentage = percentage;
      mockStudentGrades[studentGradeIndex].cgpa = cgpa;
    }
  }
};

// Helper function to get student exam results
export const getStudentExamResults = (studentId: string) => {
  return mockStudentExamResults.filter(result => result.studentId === studentId);
};

// Helper function to get all students for an exam
export const getStudentsForExam = (examId: string) => {
  const allStudents = mockStudentGrades.map(grade => ({
    studentId: grade.studentId,
    studentName: grade.studentName
  }));
  
  return allStudents.map(student => {
    const existingResult = mockStudentExamResults.find(
      result => result.studentId === student.studentId && result.examId === examId
    );
    
    return {
      ...student,
      obtainedMarks: existingResult?.obtainedMarks || 0,
      grade: existingResult?.grade || '',
      isGraded: !!existingResult
    };
  });
};

export const getStudentData = (studentId: string = 'CS2024001') => {
  // Map student IDs to names for filtering
  const studentNameMap: { [key: string]: string } = {
    'CS2024001': 'Itadori Yuji',
    'EC2024002': 'Nobara Kugisaki',
    'CS2024003': 'Megumi Fushiguro'
  };

  const studentName = studentNameMap[studentId] || 'Itadori Yuji';
  
  // Get student's academic record
  const studentGrade = mockStudentGrades.find(grade => grade.studentId === studentId);

  const fees = mockFees.filter(f => f.studentId === studentId);
  const books = mockLibraryBooks.filter(book => book.issuedTo === studentName);
  const room = mockHostelRooms.find(room => room.students.includes(studentName));
  const examResults = getStudentExamResults(studentId);
  
  // Get next pending fee
  const pendingFees = fees.filter(f => f.status !== 'paid');
  const nextFee = pendingFees.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  // Get real admission status from mockAdmissions
  const admissionRecord = mockAdmissions.find(adm => adm.studentName === studentName);
  const admissionStatus = admissionRecord ? admissionRecord.status : 'pending';
  
  // Calculate totals
  const totalFeesPaid = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingFeesAmount = fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);

  return {
    studentName,
    studentId,
    fees,
    books,
    room,
    admissionStatus,
    totalFeesPaid,
    pendingFees: pendingFeesAmount,
    nextFee: nextFee ? {
      amount: nextFee.amount,
      dueDate: nextFee.dueDate,
      type: nextFee.type
    } : null,
    academicRecord: studentGrade,
    currentSemester: studentGrade?.currentSemester || 4,
    cgpa: studentGrade?.cgpa || 0,
    percentage: studentGrade?.percentage || 0,
    examResults
  };
};


export const mockSubjects2: Subject[] = [
  {
    id: '1',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    credits: 4,
    semester: 4,
    instructor: 'Gojo Sensei'
  }
];
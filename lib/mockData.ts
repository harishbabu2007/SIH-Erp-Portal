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
  },
  {
    id: '4',
    studentName: 'Gojo Satoru',
    email: 'gojo.satoru@student.college.edu',
    phone: '+1234567893',
    course: 'CSE',
    status: 'approved',
    applicationDate: '2024-01-05',
    documents: ['10th Certificate', '12th Certificate', 'Transfer Certificate', 'Medical Certificate'],
    feesPaid: true
  },
  {
    id: '5',
    studentName: 'Sukuna Ryomen',
    email: 'sukuna.ryomen@student.college.edu',
    phone: '+1234567894',
    course: 'ECE',
    status: 'approved',
    applicationDate: '2024-01-12',
    documents: ['10th Certificate', '12th Certificate', 'Transfer Certificate'],
    feesPaid: true
  },
  {
    id: '6',
    studentName: 'Maki Zenin',
    email: 'maki.zenin@student.college.edu',
    phone: '+1234567895',
    course: 'ME',
    status: 'pending',
    applicationDate: '2024-01-18',
    documents: ['10th Certificate', '12th Certificate'],
    feesPaid: false
  },
  {
    id: '7',
    studentName: 'Toge Inumaki',
    email: 'toge.inumaki@student.college.edu',
    phone: '+1234567896',
    course: 'CSE',
    status: 'rejected',
    applicationDate: '2024-01-22',
    documents: ['10th Certificate', '12th Certificate'],
    feesPaid: false
  },
  {
    id: '8',
    studentName: 'Panda',
    email: 'panda@student.college.edu',
    phone: '+1234567897',
    course: 'ECE',
    status: 'approved',
    applicationDate: '2024-01-08',
    documents: ['10th Certificate', '12th Certificate', 'Transfer Certificate', 'Medical Certificate'],
    feesPaid: true
  }
];

export const mockFees: FeeRecord[] = [
  // Approved students fees
  {
    id: '1',
    studentId: 'EC2024002',
    studentName: 'Nobara Kugisaki',
    amount: 50000,
    type: 'tuition',
    status: 'paid',
    dueDate: '2024-01-31',
    paidDate: '2024-01-25',
    receiptNumber: 'RCP-2024-001'
  },
  {
    id: '2',
    studentId: 'EC2024002',
    studentName: 'Nobara Kugisaki',
    amount: 20000,
    type: 'library',
    status: 'pending',
    dueDate: '2024-02-15',
  },
  {
    id: '3',
    studentId: 'CS2024004',
    studentName: 'Gojo Satoru',
    amount: 50000,
    type: 'tuition',
    status: 'paid',
    dueDate: '2024-01-31',
    paidDate: '2024-01-20',
    receiptNumber: 'RCP-2024-002'
  },
  {
    id: '4',
    studentId: 'CS2024004',
    studentName: 'Gojo Satoru',
    amount: 15000,
    type: 'hostel',
    status: 'paid',
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
    receiptNumber: 'RCP-2024-003'
  },
  {
    id: '5',
    studentId: 'EC2024005',
    studentName: 'Sukuna Ryomen',
    amount: 50000,
    type: 'tuition',
    status: 'paid',
    dueDate: '2024-01-31',
    paidDate: '2024-01-28',
    receiptNumber: 'RCP-2024-004'
  },
  {
    id: '6',
    studentId: 'EC2024005',
    studentName: 'Sukuna Ryomen',
    amount: 20000,
    type: 'library',
    status: 'overdue',
    dueDate: '2024-01-15',
  },
  {
    id: '7',
    studentId: 'EC2024008',
    studentName: 'Panda',
    amount: 50000,
    type: 'tuition',
    status: 'paid',
    dueDate: '2024-01-31',
    paidDate: '2024-01-22',
    receiptNumber: 'RCP-2024-005'
  },
  {
    id: '8',
    studentId: 'EC2024008',
    studentName: 'Panda',
    amount: 15000,
    type: 'hostel',
    status: 'pending',
    dueDate: '2024-02-20',
  },
  {
    id: '9',
    studentId: 'EC2024008',
    studentName: 'Panda',
    amount: 5000,
    type: 'exam',
    status: 'pending',
    dueDate: '2024-03-01',
  }
];

// Update a fee's status and related fields in-place
export const updateFeeStatus = (
  feeId: string,
  status: 'paid' | 'pending' | 'overdue',
  options?: { paidDate?: string; receiptNumber?: string }
) => {
  const fee = mockFees.find(f => f.id === feeId);
  if (!fee) return false;
  fee.status = status;
  if (status === 'paid') {
    fee.paidDate = options?.paidDate || new Date().toISOString().split('T')[0];
    fee.receiptNumber = options?.receiptNumber || `RCP-${Date.now()}`;
  }
  return true;
};

export const mockHostelRooms: HostelRoom[] = [
  {
    id: '1',
    roomNumber: '101',
    capacity: 2,
    occupied: 2,
    students: ['Nobara Kugisaki', 'Gojo Satoru'],
    type: 'double',
    floor: 1,
    amenities: ['WiFi', 'AC', 'Study Table', 'Wardrobe']
  },
  {
    id: '2',
    roomNumber: '102',
    capacity: 2,
    occupied: 2,
    students: ['Sukuna Ryomen', 'Panda'],
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
    issuedTo: 'Nobara Kugisaki',
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
    issuedTo: 'Panda'
  }
];

// Calculate dynamic metrics
export const getHostelOccupancy = (): number => {
  const totalCapacity = mockHostelRooms.reduce((sum, room) => sum + room.capacity, 0);
  const totalOccupied = mockHostelRooms.reduce((sum, room) => sum + room.occupied, 0);
  return totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
};

export const getBooksIssuedCount = (): number => {
  return mockLibraryBooks.filter(book => book.status === 'issued').length;
};

export const mockMetrics: DashboardMetrics = {
  totalStudents: 1250,
  totalRevenue: 45000000,
  hostelOccupancy: getHostelOccupancy(),
  pendingAdmissions: 25,
  overduePayments: 12,
  booksIssued: getBooksIssuedCount()
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

// Helper function to convert grade to GPA points
const gradeToGPA = (grade: string): number => {
  const gradeMap: { [key: string]: number } = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
  };
  return gradeMap[grade] || 0;
};

// Helper function to calculate CGPA and percentage from exam results
export const calculateStudentPerformance = (studentId: string) => {
  const studentResults = mockExamResults.filter(r => r.studentId === studentId);
  if (studentResults.length === 0) return { cgpa: 0, percentage: 0 };
  
  let totalGPA = 0;
  let totalMarks = 0;
  let totalMaxMarks = 0;
  
  studentResults.forEach(result => {
    const exam = mockExams.find(e => e.id === result.examId);
    if (exam) {
      totalGPA += gradeToGPA(result.grade);
      totalMarks += result.obtainedMarks;
      totalMaxMarks += exam.maxMarks;
    }
  });
  
  const cgpa = studentResults.length > 0 ? totalGPA / studentResults.length : 0;
  const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
  
  return { cgpa, percentage };
};

export const mockStudentGrades: StudentGrade[] = [
  // Approved students only
  {
    studentId: 'EC2024002',
    studentName: 'Nobara Kugisaki',
    cgpa: 0, // Will be calculated dynamically
    percentage: 0, // Will be calculated dynamically
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
    studentId: 'CS2024004',
    studentName: 'Gojo Satoru',
    cgpa: 0, // Will be calculated dynamically
    percentage: 0, // Will be calculated dynamically
    currentSemester: 4,
    course: 'CSE',
    year: 2,
    subjects: [
      {
        subjectId: '1',
        subjectName: 'Data Structures and Algorithms',
        grade: 'A+',
        marks: 95,
        maxMarks: 100
      },
      {
        subjectId: '2',
        subjectName: 'Database Management Systems',
        grade: 'A+',
        marks: 95,
        maxMarks: 100
      }
    ]
  },
  {
    studentId: 'EC2024005',
    studentName: 'Sukuna Ryomen',
    cgpa: 0, // Will be calculated dynamically
    percentage: 0, // Will be calculated dynamically
    currentSemester: 4,
    course: 'ECE',
    year: 2,
    subjects: [
      {
        subjectId: '3',
        subjectName: 'Digital Electronics',
        grade: 'B+',
        marks: 82,
        maxMarks: 100
      },
      {
        subjectId: '4',
        subjectName: 'Signal Processing',
        grade: 'A',
        marks: 88,
        maxMarks: 100
      }
    ]
  },
  {
    studentId: 'EC2024008',
    studentName: 'Panda',
    cgpa: 0, // Will be calculated dynamically
    percentage: 0, // Will be calculated dynamically
    currentSemester: 4,
    course: 'ECE',
    year: 2,
    subjects: [
      {
        subjectId: '3',
        subjectName: 'Digital Electronics',
        grade: 'A',
        marks: 87,
        maxMarks: 100
      },
      {
        subjectId: '4',
        subjectName: 'Signal Processing',
        grade: 'A',
        marks: 90,
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
  const approvedStudentIds = getApprovedStudentIds();
  const studentPerformance = mockStudentGrades
    .filter(grade => approvedStudentIds.includes(grade.studentId))
    .map(grade => {
      const performance = calculateStudentPerformance(grade.studentId);
      return {
        studentName: grade.studentName,
        studentId: grade.studentId,
        cgpa: performance.cgpa,
        percentage: performance.percentage
      };
    });
  
  return studentPerformance
    .sort((a, b) => b.cgpa - a.cgpa)
    .slice(0, limit);
};

// Helper function to get class average
export const getClassAverage = () => {
  const approvedStudentIds = getApprovedStudentIds();
  const approvedStudents = mockStudentGrades.filter(grade => approvedStudentIds.includes(grade.studentId));
  const totalCGPA = approvedStudents.reduce((sum, grade) => {
    const performance = calculateStudentPerformance(grade.studentId);
    return sum + performance.cgpa;
  }, 0);
  return approvedStudents.length > 0 ? totalCGPA / approvedStudents.length : 0;
};

// Admin dashboard dynamic metrics
// Helper function to get approved student IDs
const getApprovedStudentIds = (): string[] => {
  const approvedStudents = mockAdmissions.filter(app => app.status === 'approved');
  return approvedStudents.map(app => {
    // Map student names to student IDs (this is a simplified mapping)
    const nameToIdMap: { [key: string]: string } = {
      'Itadori Yuji': 'CS2024001',
      'Nobara Kugisaki': 'EC2024002',
      'Megumi Fushiguro': 'CS2024003',
      'Gojo Satoru': 'CS2024004',
      'Sukuna Ryomen': 'EC2024005',
      'Maki Zenin': 'ME2024006',
      'Toge Inumaki': 'CS2024007',
      'Panda': 'EC2024008'
    };
    return nameToIdMap[app.studentName] || app.studentName;
  });
};

export const getTotalApprovedStudents = (): number =>
  mockAdmissions.filter(app => app.status === 'approved').length;

export const getApprovedStudentNames = (): string[] => {
  return mockAdmissions
    .filter(app => app.status === 'approved')
    .map(app => app.studentName);
};

export const getTotalRevenueCollected = (): number => {
  const approvedStudentIds = getApprovedStudentIds();
  return mockFees
    .filter(fee => fee.status === 'paid' && approvedStudentIds.includes(fee.studentId))
    .reduce((sum, fee) => sum + fee.amount, 0);
};

export const getPendingAdmissionsCount = (): number =>
  mockAdmissions.filter(app => app.status === 'pending').length;

export const getOverduePaymentsCount = (): number => {
  const approvedStudentIds = getApprovedStudentIds();
  return mockFees.filter(fee => fee.status === 'overdue' && approvedStudentIds.includes(fee.studentId)).length;
};

export const getRecentApplications = (limit: number = 3) =>
  mockAdmissions
    .slice()
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, limit);

export const getRecentPayments = (limit: number = 3) => {
  const approvedStudentIds = getApprovedStudentIds();
  return mockFees
    .filter(f => f.status === 'paid' && approvedStudentIds.includes(f.studentId))
    .slice()
    .sort((a, b) => new Date(b.paidDate || '1970-01-01').getTime() - new Date(a.paidDate || '1970-01-01').getTime())
    .slice(0, limit);
};

export const getUpcomingExams = (limit: number = 3) =>
  mockExams
    .filter(e => e.status === 'scheduled')
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);

export const getUpcomingExamsCount = (): number =>
  mockExams.filter(e => e.status === 'scheduled').length;

export const getAdminDashboardData = () => {
  return {
    totalStudents: getTotalApprovedStudents(),
    totalRevenue: getTotalRevenueCollected(),
    hostelOccupancy: getHostelOccupancy(),
    booksIssued: getBooksIssuedCount(),
    upcomingExamsCount: getUpcomingExamsCount(),
    pendingAdmissions: getPendingAdmissionsCount(),
    overduePayments: getOverduePaymentsCount(),
    monthlyRevenue: getMonthlyRevenue(),
    recentApplications: getRecentApplications(3),
    recentPayments: getRecentPayments(3),
    upcomingExams: getUpcomingExams(3),
    topStudents: getTopPerformingStudents(3),
    classAverage: getClassAverage(),
  } as const;
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
  },
  {
    id: '3',
    name: 'Digital Electronics',
    code: 'EC201',
    credits: 4,
    semester: 4,
    instructor: 'Prof. Geto'
  },
  {
    id: '4',
    name: 'Signal Processing',
    code: 'EC202',
    credits: 3,
    semester: 4,
    instructor: 'Prof. Geto'
  },
  {
    id: '5',
    name: 'Mechanical Engineering Design',
    code: 'ME201',
    credits: 4,
    semester: 4,
    instructor: 'Prof. Nanami'
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
    status: 'completed',
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
    status: 'completed',
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
  },
  {
    id: '5',
    subjectId: '3',
    subjectName: 'Digital Electronics',
    subjectCode: 'EC201',
    examType: 'midterm',
    date: '2024-02-18',
    duration: 120,
    maxMarks: 100,
    status: 'completed',
    semester: 4
  },
  {
    id: '6',
    subjectId: '4',
    subjectName: 'Signal Processing',
    subjectCode: 'EC202',
    examType: 'quiz',
    date: '2024-02-25',
    duration: 60,
    maxMarks: 50,
    status: 'scheduled',
    semester: 4
  },
  {
    id: '7',
    subjectId: '5',
    subjectName: 'Mechanical Engineering Design',
    subjectCode: 'ME201',
    examType: 'assignment',
    date: '2024-02-05',
    duration: 0,
    maxMarks: 30,
    status: 'completed',
    semester: 4
  },
  {
    id: '8',
    subjectId: '3',
    subjectName: 'Digital Electronics',
    subjectCode: 'EC201',
    examType: 'final',
    date: '2024-03-20',
    duration: 180,
    maxMarks: 100,
    status: 'scheduled',
    semester: 4
  }
];

export interface ExamResult {
  studentId: string;
  examId: string;
  obtainedMarks: number;
  grade: string;
}

export const mockExamResults: ExamResult[] = [
  // Nobara Kugisaki results (approved)
  { studentId: 'EC2024002', examId: '1', obtainedMarks: 92, grade: 'A+' },
  { studentId: 'EC2024002', examId: '3', obtainedMarks: 24, grade: 'A' },
  { studentId: 'EC2024002', examId: '5', obtainedMarks: 88, grade: 'A' },
  
  // Gojo Satoru results (approved)
  { studentId: 'CS2024004', examId: '1', obtainedMarks: 95, grade: 'A+' },
  { studentId: 'CS2024004', examId: '3', obtainedMarks: 25, grade: 'A+' },
  { studentId: 'CS2024004', examId: '5', obtainedMarks: 90, grade: 'A+' },
  
  // Sukuna Ryomen results (approved)
  { studentId: 'EC2024005', examId: '1', obtainedMarks: 78, grade: 'B+' },
  { studentId: 'EC2024005', examId: '3', obtainedMarks: 20, grade: 'B' },
  { studentId: 'EC2024005', examId: '5', obtainedMarks: 82, grade: 'A' },
  
  // Panda results (approved)
  { studentId: 'EC2024008', examId: '1', obtainedMarks: 85, grade: 'A' },
  { studentId: 'EC2024008', examId: '3', obtainedMarks: 23, grade: 'A' },
  { studentId: 'EC2024008', examId: '5', obtainedMarks: 87, grade: 'A' },
  
  // Note: Exams 2, 4, 6, 7, 8 are scheduled but not yet graded
  // Exams 1, 3, 5, 7 are completed and graded
];


export const getStudentData = (studentId: string = 'CS2024001') => {
  // Map student IDs to names for filtering
  const studentNameMap: { [key: string]: string } = {
    'CS2024001': 'Itadori Yuji',
    'EC2024002': 'Nobara Kugisaki',
    'CS2024003': 'Megumi Fushiguro',
    'CS2024004': 'Gojo Satoru',
    'EC2024005': 'Sukuna Ryomen',
    'ME2024006': 'Maki Zenin',
    'CS2024007': 'Toge Inumaki',
    'EC2024008': 'Panda'
  };

  const studentName = studentNameMap[studentId] || 'Itadori Yuji';
  
  // Get real admission status from mockAdmissions
  const admissionRecord = mockAdmissions.find(adm => adm.studentName === studentName);
  const admissionStatus = admissionRecord ? admissionRecord.status : 'pending';
  
  // Only return academic data if student is approved
  if (admissionStatus !== 'approved') {
    return {
      studentName,
      studentId,
      fees: [],
      books: [],
      room: null,
      admissionStatus,
      course: null,
      year: null,
      totalFeesPaid: 0,
      pendingFees: 0,
      nextFee: null,
      academicRecord: null,
      currentSemester: 0,
      cgpa: 0,
      percentage: 0
    };
  }
  
  // Get student's academic record (only for approved students)
  const studentGrade = mockStudentGrades.find(grade => grade.studentId === studentId);
  const fees = mockFees.filter(f => f.studentId === studentId);
  const books = mockLibraryBooks.filter(book => book.issuedTo === studentName);
  const room = mockHostelRooms.find(room => room.students.includes(studentName));
  
  // Get next pending fee
  const pendingFees = fees.filter(f => f.status !== 'paid');
  const nextFee = pendingFees.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  
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
    course: admissionRecord?.course || null,
    year: admissionRecord ? 2 : null, // Default to 2nd year for approved students
    totalFeesPaid,
    pendingFees: pendingFeesAmount,
    nextFee: nextFee ? {
      amount: nextFee.amount,
      dueDate: nextFee.dueDate,
      type: nextFee.type
    } : null,
    academicRecord: studentGrade,
    currentSemester: studentGrade?.currentSemester || 4,
    cgpa: studentGrade ? calculateStudentPerformance(studentId).cgpa : 0,
    percentage: studentGrade ? calculateStudentPerformance(studentId).percentage : 0
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

// Additional functions for exam management
export const getStudentsForExam = (examId: string) => {
  const approvedStudentIds = getApprovedStudentIds();
  return mockStudentGrades
    .filter(student => approvedStudentIds.includes(student.studentId))
    .map(student => {
      const existing = mockExamResults.find(r => r.studentId === student.studentId && r.examId === examId);
      return {
        studentId: student.studentId,
        studentName: student.studentName,
        obtainedMarks: existing?.obtainedMarks,
        grade: existing?.grade,
        isGraded: Boolean(existing)
      };
    });
};

export const getStudentExamResults = (studentId: string) => {
  return mockExamResults
    .filter(r => r.studentId === studentId)
    .map(r => {
      const exam = mockExams.find(e => e.id === r.examId)!;
      return {
        id: r.examId,
        subjectName: exam.subjectName,
        subjectCode: exam.subjectCode,
        examType: exam.examType,
        date: exam.date,
        duration: exam.duration,
        maxMarks: exam.maxMarks,
        obtainedMarks: r.obtainedMarks,
        grade: r.grade,
        status: 'graded' as const,
        semester: exam.semester
      };
    });
};

export const updateStudentExamResult = (studentId: string, examId: string, marks: number, grade: string) => {
  const existing = mockExamResults.find(r => r.studentId === studentId && r.examId === examId);
  if (existing) {
    existing.obtainedMarks = marks;
    existing.grade = grade;
  } else {
    mockExamResults.push({ studentId, examId, obtainedMarks: marks, grade });
  }
  return true;
};
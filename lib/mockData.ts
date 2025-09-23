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
  obtainedMarks?: number;
  grade?: string;
  status: 'scheduled' | 'graded' | 'pending';
  semester: number;
}

// Mock data
export const mockAdmissions: AdmissionApplication[] = [
  {
    id: '1',
    studentName: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1234567890',
    course: 'Computer Science',
    status: 'pending',
    applicationDate: '2024-01-15',
    documents: ['10th Certificate', '12th Certificate', 'Transfer Certificate'],
    feesPaid: false
  },
  {
    id: '2',
    studentName: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+1234567891',
    course: 'Electronics',
    status: 'approved',
    applicationDate: '2024-01-10',
    documents: ['10th Certificate', '12th Certificate', 'Transfer Certificate', 'Medical Certificate'],
    feesPaid: true
  },
  {
    id: '3',
    studentName: 'Carol Davis',
    email: 'carol@example.com',
    phone: '+1234567892',
    course: 'Mechanical Engineering',
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
    studentName: 'John Doe',
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
    studentName: 'Jane Smith',
    amount: 15000,
    type: 'hostel',
    status: 'pending',
    dueDate: '2024-02-15',
  },
  {
    id: '3',
    studentId: 'CS2024001',
    studentName: 'John Doe',
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
    students: ['John Doe', 'Mike Johnson'],
    type: 'double',
    floor: 1,
    amenities: ['WiFi', 'AC', 'Study Table', 'Wardrobe']
  },
  {
    id: '2',
    roomNumber: '102',
    capacity: 2,
    occupied: 1,
    students: ['Jane Smith'],
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
    issuedTo: 'John Doe',
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
    issuedTo: 'Alice Johnson'
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

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    credits: 4,
    semester: 4,
    instructor: 'Dr. Smith Johnson'
  },
  {
    id: '2',
    name: 'Database Management Systems',
    code: 'CS202',
    credits: 3,
    semester: 4,
    instructor: 'Prof. Emily Davis'
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
    obtainedMarks: 85,
    grade: 'A',
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
    obtainedMarks: 22,
    grade: 'B+',
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

export const getStudentData = (studentId: string = 'CS2024001') => {
  // Map student IDs to names for filtering
  const studentNameMap: { [key: string]: string } = {
    'CS2024001': 'John Doe',
    'EC2024002': 'Jane Smith'
  };
  
  const studentName = studentNameMap[studentId] || 'John Doe';
  
  const fees = mockFees.filter(f => f.studentId === studentId);
  const books = mockLibraryBooks.filter(book => book.issuedTo === studentName);
  const room = mockHostelRooms.find(room => room.students.includes(studentName));
  
  return {
    fees,
    books,
    room,
    admissionStatus: 'approved',
    totalFeesPaid: fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0),
    pendingFees: fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0)
  };
};

export const mockSubjects2: Subject[] = [
  {
    id: '1',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    credits: 4,
    semester: 4,
    instructor: 'Dr. Smith Johnson'
  }
];
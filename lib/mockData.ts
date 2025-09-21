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

export const getStudentData = (studentId: string) => {
  const fees = mockFees.filter(fee => fee.studentId === studentId);
  const books = mockLibraryBooks.filter(book => book.issuedTo === 'John Doe'); // Mock for current user
  const room = mockHostelRooms.find(room => room.students.includes('John Doe')); // Mock for current user

  return {
    fees,
    books,
    room,
    admissionStatus: 'approved',
    totalFeesPaid: fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0),
    pendingFees: fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0)
  };
};
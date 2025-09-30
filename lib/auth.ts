'use client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  studentId?: string;
  course?: string;
  year?: number;
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@college.edu',
    name: 'Gojo Sensei',
    role: 'admin',
    profileImage: 'https://avatarfiles.alphacoders.com/365/thumb-1920-365264.jpeg'
  },
  {
    id: '2',
    email: 'yuji.itadori@student.college.edu',
    name: 'Itadori Yuji',
    role: 'student',
    studentId: 'CS2024001',
    course: 'CSE',
    year: 2,
    profileImage: 'https://i.pinimg.com/564x/4c/33/c8/4c33c83087660d070158de0cd52f85e1.jpg'
  },
  {
    id: '3',
    email: 'nobara.kugisaki@student.college.edu',
    name: 'Nobara Kugisaki',
    role: 'student',
    studentId: 'EC2024002',
    course: 'ECE',
    year: 2,
    profileImage: 'https://i.pinimg.com/736x/ba/5a/70/ba5a7064b4b1f9b260df25901008e21c.jpg'
  },
  {
    id: '4',
    email: 'megumi.fushiguro@student.college.edu',
    name: 'Megumi Fushiguro',
    role: 'student',
    studentId: 'CS2024003',
    course: 'CSE',
    year: 2,
    profileImage: 'https://i.pinimg.com/564x/8a/2b/8a/8a2b8a4c4c4c4c4c4c4c4c4c4c4c4c4c.jpg'
  },
  {
    id: '5',
    email: 'gojo.satoru@student.college.edu',
    name: 'Gojo Satoru',
    role: 'student',
    studentId: 'CS2024004',
    course: 'CSE',
    year: 2,
    profileImage: 'https://i.pinimg.com/564x/9b/3c/9b/9b3c9b5d5d5d5d5d5d5d5d5d5d5d5d5d.jpg'
  },
  {
    id: '6',
    email: 'sukuna.ryomen@student.college.edu',
    name: 'Sukuna Ryomen',
    role: 'student',
    studentId: 'EC2024005',
    course: 'ECE',
    year: 2,
    profileImage: 'https://i.pinimg.com/564x/7c/4d/7c/7c4d7c6e6e6e6e6e6e6e6e6e6e6e6e6e.jpg'
  },
  {
    id: '7',
    email: 'maki.zenin@student.college.edu',
    name: 'Maki Zenin',
    role: 'student',
    studentId: 'ME2024006',
    course: 'ME',
    year: 2,
    profileImage: 'https://i.pinimg.com/564x/6d/5e/6d/6d5e6d7f7f7f7f7f7f7f7f7f7f7f7f7f.jpg'
  },
  {
    id: '8',
    email: 'toge.inumaki@student.college.edu',
    name: 'Toge Inumaki',
    role: 'student',
    studentId: 'CS2024007',
    course: 'CSE',
    year: 2,
    profileImage: 'https://i.pinimg.com/564x/5e/6f/5e/5e6f5e8f8f8f8f8f8f8f8f8f8f8f8f8f.jpg'
  },
  {
    id: '9',
    email: 'panda@student.college.edu',
    name: 'Panda',
    role: 'student',
    studentId: 'EC2024008',
    course: 'ECE',
    year: 2,
    profileImage: 'https://i.pinimg.com/564x/4f/7g/4f/4f7g4f9f9f9f9f9f9f9f9f9f9f9f9f9f.jpg'
  }
];

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    // Check for stored authentication
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('erp_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Mock authentication - in real app, this would call an API
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Mock password validation (in real app, would be hashed comparison)
    if (password !== 'password123') {
      return { success: false, error: 'Invalid password' };
    }

    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('erp_user', JSON.stringify(user));
    }

    return { success: true, user };
  }

  logout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('erp_user');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: 'student' | 'admin'): boolean {
    return this.currentUser?.role === role;
  }
}

export const authService = AuthService.getInstance();
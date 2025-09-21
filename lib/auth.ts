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
    name: 'Dr. Sarah Johnson',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    email: 'john.doe@student.college.edu',
    name: 'John Doe',
    role: 'student',
    studentId: 'CS2024001',
    course: 'Computer Science',
    year: 2,
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    email: 'jane.smith@student.college.edu',
    name: 'Jane Smith',
    role: 'student',
    studentId: 'EC2024002',
    course: 'Electronics',
    year: 1,
    profileImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
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
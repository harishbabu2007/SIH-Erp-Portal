'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BookOpen, 
  Plus, 
  Search,
  Filter,
  Download,
  UserPlus,
  RotateCcw,
  Calendar,
  CircleAlert as AlertCircle
} from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { mockLibraryBooks, LibraryBook, getStudentData } from '@/lib/mockData';
import { StudentSelector } from '@/components/StudentSelector';

export default function LibraryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<LibraryBook[]>(mockLibraryBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const router = useRouter();

  // Add refs for search bars
  const adminSearchInputRef = useRef<HTMLInputElement>(null);
  const studentSearchInputRef = useRef<HTMLInputElement>(null);

  // Focus admin search bar
  useEffect(() => {
    if (user?.role === 'admin' && adminSearchInputRef.current) {
      adminSearchInputRef.current.focus();
    }
  }, [user, searchTerm]);

  // Focus student search bar
  useEffect(() => {
    if (user?.role !== 'admin' && studentSearchInputRef.current) {
      studentSearchInputRef.current.focus();
    }
  }, [user, searchTerm]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) {
    return null;
  }

  const handleIssueBook = (bookId: string, studentName: string) => {
    if (user.role !== 'admin') return;
    
    setBooks(prev => 
      prev.map(book => 
        book.id === bookId && book.status === 'available'
          ? {
              ...book,
              status: 'issued',
              issuedTo: studentName,
              issuedDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
            }
          : book
      )
    );
  };

  const handleReturnBook = (bookId: string) => {
    if (user.role !== 'admin') return;
    
    setBooks(prev => 
      prev.map(book => 
        book.id === bookId
          ? {
              ...book,
              status: 'available',
              issuedTo: undefined,
              issuedDate: undefined,
              dueDate: undefined
            }
          : book
      )
    );
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.status === 'available').length;
  const issuedBooks = books.filter(book => book.status === 'issued').length;
  const reservedBooks = books.filter(book => book.status === 'reserved').length;

  const AdminView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Library Management</h1>
          <p className="text-muted-foreground">Manage books, issue and return records</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Issue Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue Book to Student</DialogTitle>
                <DialogDescription>Select a book and student to issue</DialogDescription>
              </DialogHeader>
              <IssueBookForm books={books.filter(b => b.status === 'available')} onIssue={handleIssueBook} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>Add a new book to the library catalog</DialogDescription>
              </DialogHeader>
              <AddBookForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issued</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{issuedBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reservedBooks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, author, or ISBN..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  ref={adminSearchInputRef}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>Library Catalog ({filteredBooks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>
                    </div>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        book.status === 'available' ? 'default' : 
                        book.status === 'issued' ? 'secondary' : 'outline'
                      }
                    >
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{book.issuedTo || '-'}</TableCell>
                  <TableCell>
                    {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {book.status === 'issued' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReturnBook(book.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Return
                        </Button>
                      )}
                      {book.status === 'available' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4 mr-1" />
                              Issue
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Issue Book</DialogTitle>
                              <DialogDescription>Issue "{book.title}" to a student</DialogDescription>
                            </DialogHeader>
                            <IssueBookForm 
                              books={[book]} 
                              onIssue={handleIssueBook}
                              preSelectedBook={book.id}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const studentData = getStudentData(user.studentId || '');
  const isApproved = studentData.admissionStatus === 'approved';

  const StudentView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Library</h1>
        <p className="text-muted-foreground">Browse books and view your issued books</p>
      </div>

      {!isApproved ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Admission Not Approved</h3>
            <p className="text-muted-foreground mb-4">
              Your admission is currently <span className="capitalize font-medium">{studentData.admissionStatus}</span>. 
              Library access will be available once your admission is approved.
            </p>
            <Button variant="outline" onClick={() => router.push('/dashboard/admissions')}>
              View Admission Status
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>

      {/* Student's Issued Books */}
      {studentData.books.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Issued Books</CardTitle>
            <CardDescription>Books currently issued to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentData.books.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                    <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Issued</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {book.dueDate && new Date(book.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Books Catalog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Available Books
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  ref={studentSearchInputRef}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books.filter(book => 
              book.status === 'available' &&
              (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
              (categoryFilter === 'all' || book.category === categoryFilter)
            ).map((book) => (
              <Card key={book.id} className="relative">
                <CardHeader>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline">{book.category}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ISBN:</span>
                      <span>{book.isbn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Request Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="library" />
      <main className="container mx-auto px-4 py-8">
        {user.role === 'admin' ? <AdminView /> : <StudentView />}
      </main>
    </div>
  );
}

function AddBookForm() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding book:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Book Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter book title"
          required
        />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="Enter author name"
          required
        />
      </div>
      <div>
        <Label htmlFor="isbn">ISBN</Label>
        <Input
          id="isbn"
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          placeholder="978-0123456789"
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Mechanical">Mechanical</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Add Book</Button>
      </div>
    </form>
  );
}

function IssueBookForm({ 
  books, 
  onIssue, 
  preSelectedBook 
}: { 
  books: LibraryBook[];
  onIssue: (bookId: string, studentName: string) => void;
  preSelectedBook?: string;
}) {
  const [selectedBookId, setSelectedBookId] = useState(preSelectedBook || '');
  const [studentName, setStudentName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookId && studentName) {
      onIssue(selectedBookId, studentName);
      setSelectedBookId('');
      setStudentName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="book">Select Book</Label>
        <Select value={selectedBookId} onValueChange={setSelectedBookId} disabled={!!preSelectedBook}>
          <SelectTrigger>
            <SelectValue placeholder="Select a book to issue" />
          </SelectTrigger>
          <SelectContent>
            {books.map(book => (
              <SelectItem key={book.id} value={book.id}>
                {book.title} by {book.author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="student">Student Name</Label>
        <StudentSelector
          value={studentName}
          onValueChange={setStudentName}
          placeholder="Search and select approved student"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Issue Book</Button>
      </div>
    </form>
  );
}
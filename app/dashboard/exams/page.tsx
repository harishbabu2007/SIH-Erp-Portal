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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Search, Calendar, Clock, Award, CreditCard as Edit, GraduationCap, FileText, TrendingUp, User as UserIcon } from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { mockSubjects, mockExams, Subject, Exam, updateStudentExamResult, getStudentsForExam, getStudentExamResults } from '@/lib/mockData';

export default function ExamsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [searchTerm, setSearchTerm] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const router = useRouter();

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

  const handleAddSubject = (subjectData: Omit<Subject, 'id'>) => {
    if (user.role !== 'admin') return;
    
    const newSubject: Subject = {
      ...subjectData,
      id: (subjects.length + 1).toString()
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const handleAddExam = (examData: Omit<Exam, 'id'>) => {
    if (user.role !== 'admin') return;
    
    const newExam: Exam = {
      ...examData,
      id: (exams.length + 1).toString()
    };
    setExams(prev => [...prev, newExam]);
  };

  const handleUpdateExamResult = (examId: string, obtainedMarks: number, grade: string) => {
    if (user.role !== 'admin') return;
    
    setExams(prev => 
      prev.map(exam => 
        exam.id === examId 
          ? { ...exam, obtainedMarks, grade, status: 'graded' as const }
          : exam
      )
    );
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = examTypeFilter === 'all' || exam.examType === examTypeFilter;
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const studentExams = user.role === 'student' ? filteredExams : filteredExams;
  const completedExams = studentExams.filter(exam => exam.status === 'graded');
  const upcomingExams = studentExams.filter(exam => exam.status === 'scheduled');
  const totalMarks = completedExams.reduce((sum, exam) => sum + (exam.obtainedMarks || 0), 0);
  const maxTotalMarks = completedExams.reduce((sum, exam) => sum + exam.maxMarks, 0);
  const averagePercentage = maxTotalMarks > 0 ? Math.round((totalMarks / maxTotalMarks) * 100) : 0;

  const AdminView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Exams & Subjects Management</h1>
          <p className="text-muted-foreground">Manage subjects, schedule exams, and update results</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>Create a new subject for the curriculum</DialogDescription>
              </DialogHeader>
              <AddSubjectForm onSubmit={handleAddSubject} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Exam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Exam</DialogTitle>
                <DialogDescription>Schedule an exam for a subject</DialogDescription>
              </DialogHeader>
              <AddExamForm subjects={subjects} onSubmit={handleAddExam} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="exams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{exams.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{upcomingExams.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Award className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedExams.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjects.length}</div>
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
                    {/* Add ref and useEffect for focus */}
                    {(() => {
                      const inputRef = useRef<HTMLInputElement>(null);
                      useEffect(() => {
                        if (inputRef.current) {
                          inputRef.current.focus();
                        }
                      }, [searchTerm]);
                      return (
                        <Input
                          id="search"
                          placeholder="Search by subject name or code..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          ref={inputRef}
                        />
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <Label htmlFor="type-filter">Exam Type</Label>
                  <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="midterm">Midterm</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
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
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="graded">Graded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exams Table */}
          <Card>
            <CardHeader>
              <CardTitle>Exams ({filteredExams.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Max Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{exam.subjectName}</p>
                          <p className="text-sm text-muted-foreground">{exam.subjectCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{exam.examType}</Badge>
                      </TableCell>
                      <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                      <TableCell>{exam.duration > 0 ? `${exam.duration} min` : 'N/A'}</TableCell>
                      <TableCell>{exam.maxMarks}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            exam.status === 'graded' ? 'default' : 
                            exam.status === 'completed' ? 'secondary' : 'outline'
                          }
                        >
                          {exam.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {exam.status === 'completed' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Add Result
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Exam Result</DialogTitle>
                                <DialogDescription>Add marks and grade for {exam.subjectName}</DialogDescription>
                              </DialogHeader>
                              <UpdateResultForm 
                                exam={exam} 
                                onSubmit={(marks, grade) => handleUpdateExamResult(exam.id, marks, grade)} 
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subjects ({subjects.length})</CardTitle>
              <CardDescription>Manage curriculum subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Instructor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.credits}</TableCell>
                      <TableCell>{subject.semester}</TableCell>
                      <TableCell>{subject.instructor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const StudentView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Exams & Subjects</h1>
        <p className="text-muted-foreground">View your subjects, exam schedule, and results</p>
      </div>

      {/* Performance Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Semester 4</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averagePercentage}%</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{upcomingExams.length}</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{subjects.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="exams">My Exams</TabsTrigger>
          <TabsTrigger value="subjects">My Subjects</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-6">
          {/* Upcoming Exams */}
          {upcomingExams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Exams</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/50">
                      <div>
                        <p className="font-medium">{exam.subjectName}</p>
                        <p className="text-sm text-muted-foreground">{exam.subjectCode} • {exam.examType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{new Date(exam.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.duration > 0 ? `${exam.duration} minutes` : 'Assignment'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Exams */}
          <Card>
            <CardHeader>
              <CardTitle>All Exams</CardTitle>
              <CardDescription>Complete list of your exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentExams.map((exam) => {
                  const studentResult = getStudentExamResults(user.studentId || '').find(result => result.examId === exam.id);
                  return (
                  <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{exam.subjectName}</p>
                      <p className="text-sm text-muted-foreground">{exam.subjectCode}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="capitalize">{exam.examType}</Badge>
                        <Badge 
                          variant={
                            studentResult ? 'default' : 
                            exam.status === 'completed' ? 'secondary' : 'outline'
                          }
                        >
                          {studentResult ? 'graded' : exam.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{new Date(exam.date).toLocaleDateString()}</p>
                      {studentResult && (
                        <div className="mt-1">
                          <p className="text-sm">
                            <span className="font-medium">{studentResult.obtainedMarks}/{exam.maxMarks}</span>
                            <span className="ml-2 text-muted-foreground">({studentResult.grade})</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Semester Subjects</CardTitle>
              <CardDescription>Semester 4 subjects and instructors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {subjects.map((subject) => (
                  <Card key={subject.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription>{subject.code} • {subject.credits} Credits</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{subject.instructor}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
              <CardDescription>Your graded exam results and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {completedExams.length > 0 ? (
                <div className="space-y-4">
                  {completedExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{exam.subjectName}</p>
                        <p className="text-sm text-muted-foreground">{exam.subjectCode} • {exam.examType}</p>
                        <p className="text-xs text-muted-foreground">{new Date(exam.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {exam.obtainedMarks}/{exam.maxMarks}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">{exam.grade}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(((exam.obtainedMarks || 0) / exam.maxMarks) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No graded results available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="exams" />
      <main className="container mx-auto px-4 py-8">
        {user.role === 'admin' ? <AdminView /> : <StudentView />}
      </main>
    </div>
  );
}

function AddSubjectForm({ onSubmit }: { onSubmit: (data: Omit<Subject, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    semester: '',
    instructor: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSubmit({
        name: formData.name,
        code: formData.code,
        credits: parseInt(formData.credits),
        semester: parseInt(formData.semester),
        instructor: formData.instructor
      });
      
      setFormData({
        name: '',
        code: '',
        credits: '',
        semester: '',
        instructor: ''
      });
      
      alert('Subject added successfully!');
    } catch (error) {
      alert('Error adding subject. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Subject Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Data Structures and Algorithms"
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="code">Subject Code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="CS201"
            required
          />
        </div>
        <div>
          <Label htmlFor="credits">Credits *</Label>
          <Input
            id="credits"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
            placeholder="4"
            min="1"
            max="6"
            required
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="semester">Semester *</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, semester: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="instructor">Instructor *</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="Gojo Sensei"
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Subject'}
        </Button>
      </div>
    </form>
  );
}

function AddExamForm({ 
  subjects, 
  onSubmit 
}: { 
  subjects: Subject[];
  onSubmit: (data: Omit<Exam, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    subjectId: '',
    examType: '',
    date: '',
    duration: '',
    maxMarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const selectedSubject = subjects.find(s => s.id === formData.subjectId);
      if (!selectedSubject) return;

      onSubmit({
        subjectId: formData.subjectId,
        subjectName: selectedSubject.name,
        subjectCode: selectedSubject.code,
        examType: formData.examType as 'midterm' | 'final' | 'quiz' | 'assignment',
        date: formData.date,
        duration: parseInt(formData.duration) || 0,
        maxMarks: parseInt(formData.maxMarks),
        status: 'scheduled',
        semester: selectedSubject.semester
      });
      
      setFormData({
        subjectId: '',
        examType: '',
        date: '',
        duration: '',
        maxMarks: ''
      });
      
      alert('Exam scheduled successfully!');
    } catch (error) {
      alert('Error scheduling exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Select onValueChange={(value) => setFormData({ ...formData, subjectId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(subject => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="examType">Exam Type *</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, examType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="midterm">Midterm</SelectItem>
              <SelectItem value="final">Final</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Exam Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="120"
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="maxMarks">Maximum Marks *</Label>
          <Input
            id="maxMarks"
            type="number"
            value={formData.maxMarks}
            onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
            placeholder="100"
            min="1"
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Scheduling...' : 'Schedule Exam'}
        </Button>
      </div>
    </form>
  );
}

function UpdateResultForm({ 
  exam, 
  onSubmit 
}: { 
  exam: Exam;
  onSubmit: (marks: number, grade: string) => void;
}) {
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [grade, setGrade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateGrade = (marks: number, maxMarks: number) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const handleMarksChange = (value: string) => {
    setObtainedMarks(value);
    if (value) {
      const marks = parseInt(value);
      const calculatedGrade = calculateGrade(marks, exam.maxMarks);
      setGrade(calculatedGrade);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSubmit(parseInt(obtainedMarks), grade);
      
      alert('Result updated successfully!');
    } catch (error) {
      alert('Error updating result. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold">{exam.subjectName}</h4>
        <p className="text-sm text-muted-foreground">{exam.subjectCode} • {exam.examType}</p>
        <p className="text-sm text-muted-foreground">Maximum Marks: {exam.maxMarks}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="marks">Obtained Marks *</Label>
          <Input
            id="marks"
            type="number"
            value={obtainedMarks}
            onChange={(e) => handleMarksChange(e.target.value)}
            placeholder="85"
            min="0"
            max={exam.maxMarks}
            required
          />
        </div>
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="A"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" disabled={isSubmitting || !obtainedMarks || !grade}>
          {isSubmitting ? 'Updating...' : 'Update Result'}
        </Button>
      </div>
    </form>
  );
}
export const users = [
  {
    id: 'admin1',
    email: 'admin@gmail.com',
    password: 'pass@123', // Real admin credentials from API guide
    name: 'Nguyễn Quản Trị',
    phone: '0901234567',
    role: 'admin',
    position: 'Quản trị viên'
  },
  {
    id: 'teacher1',
    email: 'sarah@tttenglish.edu.vn',
    password: 'Teacher@123',
    name: 'Sarah Johnson',
    phone: '0912345678',
    role: 'teacher',
    specialty: 'IELTS',
    experience: '5 năm'
  },
  {
    id: 'teacher2',
    email: 'john@tttenglish.edu.vn',
    password: 'Teacher@123',
    name: 'John Smith',
    phone: '0923456789',
    role: 'teacher',
    specialty: 'TOEIC',
    experience: '3 năm'
  },
  {
    id: 'student1',
    email: 'student1@gmail.com',
    password: 'Student@123',
    name: 'Nguyễn Văn An',
    phone: '0934567890',
    role: 'student',
    studentId: 'SV001',
    class: 'IELTS Advanced'
  },
  {
    id: 'student2',
    email: 'student2@gmail.com',
    password: 'Student@123',
    name: 'Trần Thị Bình',
    phone: '0945678901',
    role: 'student',
    studentId: 'SV002',
    class: 'TOEIC Preparation'
  },
  {
    id: 'parent1',
    email: 'parent1@gmail.com',
    password: 'Parent@123',
    name: 'Nguyễn Văn Phụ',
    phone: '0956789012',
    role: 'parent',
    children: ['student1'],
    relationship: 'Bố'
  },
  {
    id: 'parent2',
    email: 'parent2@gmail.com',
    password: 'Parent@123',
    name: 'Trần Văn Huynh',
    phone: '0967890123',
    role: 'parent',
    children: ['student2'],
    relationship: 'Bố'
  }
]; 



// student them lich hoc , thanh toan 
// teacher thay doi lich day thanh CALENDER . bỏ thao tác ởở
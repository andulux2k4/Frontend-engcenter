# HƯỚNG DẪN API CHI TIẾT - HỆ THỐNG QUẢN LÝ TRUNG TÂM TIẾNG ANH

## 📋 TỔNG QUAN HỆ THỐNG

**Đề tài**: Xây dựng website quản lý trung tâm tiếng anh

**Các vai trò người dùng**:

- **Admin**: Quản lý toàn bộ hệ thống
- **Teacher**: Giáo viên - quản lý lớp học và điểm danh
- **Parent**: Phụ huynh - xem thông tin con em
- **Student**: Học sinh - xem thông tin học tập

**Base URL**: `https://english-center-website.onrender.com/v1/api`

---

## 🔐 1. AUTHENTICATION & ACCOUNT API

### 1.1 Đăng nhập

**POST** `/login`

**Mô tả**: Đăng nhập vào hệ thống

**Request Body**:

```json
{
  "email": "admin@gmail.com",
  "password": "pass@123"
}
```

**Response Success (200)**:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "684ba6d8067cbc595e427fb0",
      "name": "Admin User",
      "email": "admin@gmail.com",
      "role": "Admin"
    }
  }
}
```

**Luồng sử dụng**:

1. User nhập email/password
2. Hệ thống xác thực
3. Trả về JWT token để sử dụng cho các API khác

### 1.2 Đăng xuất

**POST** `/logout`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

### 1.3 Quên mật khẩu

**POST** `/forgot-password`

**Request Body**:

```json
{
  "email": "user@gmail.com"
}
```

### 1.4 Xác thực mã reset

**POST** `/verify-reset-code`

**Request Body**:

```json
{
  "email": "user@gmail.com",
  "resetCode": "123456"
}
```

### 1.5 Đặt lại mật khẩu

**POST** `/reset-password`

**Request Body**:

```json
{
  "email": "user@gmail.com",
  "resetCode": "123456",
  "newPassword": "newpassword123"
}
```

---

## 👤 2. PROFILE & USER MANAGEMENT API

### 2.1 Xem thông tin cá nhân

**GET** `/profile`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "id": "684ba6d8067cbc595e427fb0",
    "name": "Nguyễn Văn A",
    "email": "user@gmail.com",
    "role": "Teacher",
    "phoneNumber": "0123456789",
    "address": "Hà Nội",
    "gender": "Nam"
  }
}
```

### 2.2 Cập nhật thông tin cá nhân

**PATCH** `/profile`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "name": "Nguyễn Văn B",
  "phoneNumber": "0987654321",
  "address": "TP.HCM"
}
```

### 2.3 Đổi mật khẩu

**POST** `/change-password`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

### 2.4 Danh sách người dùng (Admin)

**GET** `/users`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `page`: Trang (default: 1)
- `limit`: Số items/trang (default: 10)
- `email`: Lọc theo email
- `name`: Lọc theo tên
- `role`: Lọc theo vai trò (Admin, Teacher, Parent, Student)
- `isActive`: Lọc theo trạng thái (true/false)

**Ví dụ**: `/users?page=1&limit=10&role=Teacher&isActive=true`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "684ba6d8067cbc595e427fb0",
        "name": "Nguyễn Thị A",
        "email": "teacher@gmail.com",
        "role": "Teacher",
        "isActive": true,
        "createdAt": "2024-12-01T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

---

## 🎓 3. CLASS MANAGEMENT API

### 3.1 Tạo lớp học mới (Admin)

**POST** `/classes`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "className": "4a3",
  "year": 2025,
  "grade": 4,
  "isAvailable": true,
  "feePerLesson": 100000,
  "schedule": {
    "startDate": "08/12/2025",
    "endDate": "11/20/2025",
    "daysOfLessonInWeek": [1, 3, 5]
  },
  "teacherId": "684ba6d8067cbc595e427fb0",
  "studentList": ["684aee9c10e24b616dccdf76"],
  "attendanceId": null
}
```

**Response Success (201)**:

```json
{
  "success": true,
  "message": "Tạo lớp học thành công",
  "data": {
    "id": "6853a91e437e7f0016e07c1d",
    "className": "4a3",
    "year": 2025,
    "grade": 4,
    "teacher": {
      "id": "684ba6d8067cbc595e427fb0",
      "name": "Nguyễn Thị B"
    },
    "studentCount": 1,
    "feePerLesson": 100000
  }
}
```

**Luồng sử dụng**:

1. Admin chọn tạo lớp mới
2. Nhập thông tin lớp học (tên, năm, lứa tuổi)
3. Chọn giáo viên phụ trách
4. Thiết lập lịch học (ngày bắt đầu, kết thúc, các ngày trong tuần)
5. Thêm học sinh vào lớp (có thể thêm sau)

### 3.2 Danh sách tất cả lớp học

**GET** `/classes`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `summary`: true/false - Hiển thị tóm tắt
- `page`: Trang
- `limit`: Số items/trang
- `year`: Lọc theo năm
- `grade`: Lọc theo lứa tuổi
- `isAvailable`: Lọc lớp đang hoạt động
- `teacherId`: Lọc theo giáo viên

**Ví dụ**: `/classes?year=2025&grade=4&isAvailable=true`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "id": "6853a91e437e7f0016e07c1d",
        "className": "4a3",
        "year": 2025,
        "grade": 4,
        "teacher": {
          "name": "Nguyễn Thị B"
        },
        "studentCount": 25,
        "isAvailable": true,
        "schedule": {
          "startDate": "2025-08-12",
          "endDate": "2025-11-20",
          "daysOfLessonInWeek": [1, 3, 5]
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 30
    }
  }
}
```

### 3.3 Chi tiết một lớp học

**GET** `/classes/:classId`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `include`: attendance,detailed,students,schedule

**Ví dụ**: `/classes/6853a91e437e7f0016e07c1d?include=students,attendance`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "id": "6853a91e437e7f0016e07c1d",
    "className": "4a3",
    "year": 2025,
    "grade": 4,
    "feePerLesson": 100000,
    "teacher": {
      "id": "684ba6d8067cbc595e427fb0",
      "name": "Nguyễn Thị B",
      "phoneNumber": "0123456789"
    },
    "students": [
      {
        "id": "684aee9c10e24b616dccdf76",
        "name": "Nguyễn Văn A",
        "attendanceRate": 85.5
      }
    ],
    "schedule": {
      "startDate": "2025-08-12",
      "endDate": "2025-11-20",
      "daysOfLessonInWeek": [1, 3, 5]
    },
    "statistics": {
      "totalStudents": 25,
      "totalLessons": 48,
      "averageAttendance": 87.2
    }
  }
}
```

### 3.4 Cập nhật lớp học (Admin)

**PATCH** `/classes/:classId`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "studentList": "6860e46f24e0e9f17ed61b2b",
  "feePerLesson": 120000
}
```

### 3.5 Đóng lớp học (Admin)

**DELETE** `/classes/:classId`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `hardDelete`: false (mặc định - soft delete)

**Response Success (200)**:

```json
{
  "success": true,
  "message": "Đóng lớp học thành công",
  "data": {
    "classId": "6853a91e437e7f0016e07c1d",
    "className": "4a3",
    "closedAt": "2025-06-30T10:00:00Z"
  }
}
```

### 3.6 Tổng quan lớp học (Admin)

**GET** `/classes/overview`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "totalClasses": 15,
    "activeClasses": 12,
    "closedClasses": 3,
    "totalStudents": 350,
    "byGrade": {
      "grade3": 5,
      "grade4": 7,
      "grade5": 3
    },
    "byYear": {
      "2024": 3,
      "2025": 12
    }
  }
}
```

---

## 👨‍🏫 4. TEACHER MANAGEMENT API

### 4.1 Tạo giáo viên mới (Admin)

**POST** `/teachers`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "email": "teacher@gmail.com",
  "passwordBeforeHash": "11111111",
  "name": "Nguyễn Thị Tuấn Phong",
  "gender": "Nữ",
  "phoneNumber": "047857286",
  "address": "Hải Dương",
  "classId": [],
  "wagePerLesson": 100000
}
```

**Response Success (201)**:

```json
{
  "success": true,
  "message": "Tạo giáo viên thành công",
  "data": {
    "id": "684ba6d8067cbc595e427fb0",
    "name": "Nguyễn Thị Tuấn Phong",
    "email": "teacher@gmail.com",
    "wagePerLesson": 100000,
    "classCount": 0
  }
}
```

### 4.2 Danh sách giáo viên (Admin)

**GET** `/teachers`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `page`: Trang
- `limit`: Số items/trang
- `isActive`: Lọc theo trạng thái

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "teachers": [
      {
        "id": "684ba6d8067cbc595e427fb0",
        "name": "Nguyễn Thị A",
        "email": "teacher@gmail.com",
        "classCount": 3,
        "wagePerLesson": 100000,
        "totalWageOwed": 2500000,
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15
    }
  }
}
```

### 4.3 Thông tin chi tiết giáo viên

**GET** `/teachers/:teacherId`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "id": "684ba6d8067cbc595e427fb0",
    "name": "Nguyễn Thị A",
    "email": "teacher@gmail.com",
    "phoneNumber": "0123456789",
    "address": "Hà Nội",
    "wagePerLesson": 100000,
    "classes": [
      {
        "id": "6853a91e437e7f0016e07c1d",
        "className": "4a3",
        "studentCount": 25,
        "totalLessons": 48
      }
    ],
    "statistics": {
      "totalClassesTaught": 3,
      "totalLessons": 144,
      "totalWageEarned": 14400000,
      "unpaidWage": 2500000
    }
  }
}
```

**Luồng Teacher đăng nhập**:

1. Teacher đăng nhập bằng email/password
2. Hệ thống trả về token và thông tin cơ bản
3. Teacher có thể xem:
   - Các lớp mình đang dạy
   - Số buổi đã dạy của mỗi lớp
   - Điểm danh học sinh
   - Lương đã nhận và chưa nhận

### 4.4 Cập nhật thông tin giáo viên (Admin)

**PATCH** `/teachers/:teacherId`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "wagePerLesson": 120000,
  "address": "TP.HCM"
}
```

---

## 👨‍👩‍👧‍👦 5. PARENT MANAGEMENT API

### 5.1 Tạo phụ huynh mới (Admin)

**POST** `/parents`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "email": "parent@gmail.com",
  "passwordBeforeHash": "11111111",
  "name": "Nguyễn Văn Cha",
  "gender": "Nam",
  "phoneNumber": "03424354226",
  "address": "Hà Nội",
  "childId": ["6860e46f24e0e9f17ed61b2b"],
  "canSeeTeacher": true
}
```

### 5.2 Danh sách phụ huynh (Admin)

**GET** `/parents`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `page`, `limit`, `isActive`

### 5.3 Thông tin chi tiết con em (Parent)

**GET** `/parents/:parentId/children-details`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "children": [
      {
        "id": "6860e46f24e0e9f17ed61b2b",
        "name": "Nguyễn Văn Con",
        "class": {
          "id": "6853a91e437e7f0016e07c1d",
          "className": "4a3",
          "teacher": {
            "name": "Nguyễn Thị B",
            "phoneNumber": "0123456789"
          }
        },
        "attendance": {
          "totalLessons": 48,
          "attendedLessons": 42,
          "absentLessons": 6,
          "attendanceRate": 87.5,
          "recentAbsences": [
            {
              "date": "2025-06-25",
              "reason": "Sick"
            }
          ]
        },
        "payment": {
          "monthlyFee": 800000,
          "unpaidAmount": 1600000,
          "unpaidMonths": ["2025-05", "2025-06"],
          "discount": {
            "percentage": 10,
            "discountAmount": 160000
          },
          "totalOwed": 1440000
        }
      }
    ]
  }
}
```

**Luồng Parent đăng nhập**:

1. Parent đăng nhập
2. Xem thông tin con em:
   - Lớp đang học
   - Giáo viên dạy (nếu được phép xem)
   - Số buổi đã học/nghỉ cụ thể
   - Số tiền học chưa đóng theo tháng
   - Tổng số tiền nợ (có tính giảm giá)

---

## 👨‍🎓 6. STUDENT MANAGEMENT API

### 6.1 Tạo học sinh mới (Admin)

**POST** `/students`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "email": "student@gmail.com",
  "passwordBeforeHash": "11111111",
  "name": "Tài khoản test",
  "gender": "Nam",
  "phoneNumber": "9238946923",
  "address": "Hà Nội",
  "classId": null,
  "parentId": null
}
```

### 6.2 Thông tin học sinh

**GET** `/students/:studentId`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "id": "6860e46f24e0e9f17ed61b2b",
    "name": "Tài khoản test",
    "email": "student@gmail.com",
    "class": {
      "id": "6853a91e437e7f0016e07c1d",
      "className": "4a3",
      "teacher": "Nguyễn Thị B"
    },
    "attendance": {
      "totalLessons": 48,
      "attendedLessons": 42,
      "absentLessons": 6,
      "attendanceRate": 87.5
    },
    "parent": {
      "name": "Nguyễn Văn Cha",
      "phoneNumber": "0123456789"
    }
  }
}
```

**Luồng Student đăng nhập**:

1. Student đăng nhập
2. Xem thông tin học tập:
   - Lớp đang học
   - Đã học bao nhiêu buổi
   - Nghỉ bao nhiêu buổi
   - Tỷ lệ tham gia lớp học

### 6.3 Đăng ký học sinh vào lớp (Admin) - **RECOMMENDED**

**POST** `/students/:studentId/enroll`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "classesWithDiscount": [
    {
      "classId": "6853a91e437e7f0016e07c1d",
      "discountPercentage": 10
    }
  ]
}
```

**Response Success (200)**:

```json
{
  "success": true,
  "message": "Đăng ký lớp học cho học sinh thành công",
  "data": {
    "student": {
      "id": "6860e46f24e0e9f17ed61b2b",
      "name": "Tài khoản test"
    },
    "enrolledClasses": [
      {
        "classId": "6853a91e437e7f0016e07c1d",
        "className": "4a3",
        "feePerLesson": 100000,
        "discountApplied": 10
      }
    ],
    "paymentRecords": [
      {
        "month": 6,
        "year": 2025,
        "amountDue": 800000,
        "discountAmount": 80000,
        "finalAmount": 720000
      }
    ]
  }
}
```

**Lưu ý**: API này tự động xử lý:

- Thêm student vào class.studentList
- Thêm classId vào student.classId
- Tạo payment record với discount

### 6.4 Rút học sinh khỏi lớp (Admin)

**POST** `/students/:studentId/withdraw`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "classIds": ["6853a91e437e7f0016e07c1d"]
}
```

---

## ✅ 7. ATTENDANCE API

### 7.1 Tạo buổi điểm danh (Teacher, Admin)

**POST** `/attendance/class/:classId`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "date": "2025-06-30",
  "note": "Buổi học về từ vựng"
}
```

**Response Success (201)**:

```json
{
  "success": true,
  "message": "Tạo buổi điểm danh thành công",
  "data": {
    "id": "attendance123",
    "classId": "6853a91e437e7f0016e07c1d",
    "date": "2025-06-30",
    "students": [
      {
        "studentId": "6860e46f24e0e9f17ed61b2b",
        "studentName": "Tài khoản test",
        "isAbsent": false
      }
    ]
  }
}
```

### 7.2 Điểm danh học sinh (Teacher, Admin)

**PATCH** `/attendance/:attendanceId/mark`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "students": [
    {
      "studentId": "6860e46f24e0e9f17ed61b2b",
      "isAbsent": true,
      "note": "Ốm"
    }
  ]
}
```

**Response Success (200)**:

```json
{
  "success": true,
  "message": "Điểm danh thành công",
  "data": {
    "attendanceId": "attendance123",
    "date": "2025-06-30",
    "updatedStudents": [
      {
        "studentId": "6860e46f24e0e9f17ed61b2b",
        "studentName": "Tài khoản test",
        "isAbsent": true,
        "note": "Ốm"
      }
    ]
  }
}
```

**Luồng điểm danh**:

1. Teacher/Admin tạo buổi điểm danh cho lớp
2. Hệ thống tự động tạo danh sách học sinh
3. Teacher đánh dấu vắng mặt cho từng học sinh
4. Hệ thống tự động thông báo cho phụ huynh (nếu có cấu hình)

### 7.3 Lịch sử điểm danh lớp học

**GET** `/attendance/class/:classId`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `page`, `limit`, `startDate`, `endDate`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "attendances": [
      {
        "id": "attendance123",
        "date": "2025-06-30",
        "totalStudents": 25,
        "presentStudents": 23,
        "absentStudents": 2,
        "attendanceRate": 92.0
      }
    ],
    "statistics": {
      "averageAttendanceRate": 89.5,
      "totalLessons": 48,
      "bestAttendanceDate": "2025-06-15",
      "worstAttendanceDate": "2025-06-25"
    }
  }
}
```

---

## 💰 8. PAYMENT API

### 8.1 Xem khoản chưa thanh toán (Parent, Admin)

**GET** `/payments/unpaid/:parentId`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "children": [
      {
        "studentId": "6860e46f24e0e9f17ed61b2b",
        "studentName": "Tài khoản test",
        "class": "4a3",
        "unpaidPayments": [
          {
            "month": 5,
            "year": 2025,
            "amountDue": 800000,
            "amountPaid": 0,
            "unpaidAmount": 800000,
            "attendedLessons": 8,
            "totalLessons": 8,
            "discountApplied": 80000,
            "finalAmount": 720000
          }
        ],
        "totalUnpaid": 1440000
      }
    ],
    "grandTotalUnpaid": 1440000
  }
}
```

**Lưu ý**: Học phí chỉ tính cho buổi có mặt, không tính buổi vắng

### 8.2 Tạo yêu cầu thanh toán (Parent)

**POST** `/payments/request`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "studentId": "6860e46f24e0e9f17ed61b2b",
  "month": 6,
  "year": 2025,
  "amountToPay": 720000,
  "paymentMethod": "bank_transfer",
  "note": "Thanh toán học phí tháng 6"
}
```

### 8.3 Xử lý thanh toán (Admin)

**PATCH** `/payments/:paymentId/process`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "status": "completed",
  "actualAmountReceived": 720000,
  "processingNote": "Đã nhận đủ tiền"
}
```

---

## 💼 9. TEACHER WAGE PAYMENT API

### 9.1 Tính lương giáo viên (Admin)

**POST** `/teacher-wages/calculate`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "month": 6,
  "year": 2025,
  "teacherIds": ["684ba6d8067cbc595e427fb0"]
}
```

### 9.2 Xem lương giáo viên

**GET** `/teacher-wages/teacher/:teacherId`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `month`, `year`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "teacher": {
      "id": "684ba6d8067cbc595e427fb0",
      "name": "Nguyễn Thị A"
    },
    "wageDetails": [
      {
        "month": 6,
        "year": 2025,
        "totalLessons": 24,
        "wagePerLesson": 100000,
        "totalWage": 2400000,
        "paidAmount": 0,
        "unpaidAmount": 2400000,
        "status": "pending"
      }
    ],
    "summary": {
      "totalEarned": 2400000,
      "totalPaid": 0,
      "totalUnpaid": 2400000
    }
  }
}
```

### 9.3 Trả lương giáo viên (Admin)

**PATCH** `/teacher-wages/:wageId/pay`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "amountPaid": 2400000,
  "paymentDate": "2025-06-30",
  "paymentMethod": "bank_transfer",
  "note": "Lương tháng 6/2025"
}
```

---

## 📊 10. STATISTICS API

### 10.1 Thống kê tổng quan (Admin)

**GET** `/statistics`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `startDate`, `endDate`, `month`, `year`, `quarter`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalStudents": 350,
      "totalTeachers": 15,
      "totalClasses": 12,
      "totalRevenue": 28000000,
      "totalExpenses": 12000000,
      "netProfit": 16000000
    },
    "studentGrowth": {
      "thisMonth": 25,
      "lastMonth": 20,
      "growthRate": 25.0
    },
    "revenueBreakdown": {
      "expectedRevenue": 32000000,
      "actualRevenue": 28000000,
      "collectionRate": 87.5,
      "unpaidAmount": 4000000
    },
    "teacherWages": {
      "totalOwed": 12000000,
      "totalPaid": 8000000,
      "unpaidAmount": 4000000
    },
    "attendanceStats": {
      "averageAttendanceRate": 89.2,
      "bestPerformingClass": "4a3",
      "worstPerformingClass": "3b2"
    },
    "monthlyTrends": [
      {
        "month": "2025-01",
        "students": 320,
        "revenue": 25600000,
        "expenses": 10800000
      },
      {
        "month": "2025-02",
        "students": 335,
        "revenue": 26800000,
        "expenses": 11200000
      }
    ]
  }
}
```

---

## 📢 11. ADVERTISEMENT API

### 11.1 Xem quảng cáo (Public)

**GET** `/advertisements/public`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "advertisements": [
      {
        "id": "ad123",
        "title": "Khai giảng lớp Tiếng Anh lớp 3 - Năm 2025",
        "content": "Trung tâm khai giảng lớp học mới...",
        "type": "popup",
        "imageUrl": "https://example.com/ad-image.jpg",
        "isActive": true,
        "startDate": "2025-07-01",
        "endDate": "2025-08-15"
      }
    ]
  }
}
```

### 11.2 Tạo quảng cáo mới (Admin)

**POST** `/advertisements`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "title": "Khai giảng lớp mới",
  "content": "Trung tâm sắp khai giảng các lớp học mới...",
  "type": "slider",
  "imageUrl": "https://example.com/image.jpg",
  "startDate": "2025-07-01",
  "endDate": "2025-08-15",
  "targetAudience": "parents",
  "isActive": true
}
```

**Luồng quảng cáo**:

1. Admin tạo quảng cáo khi chuẩn bị mở lớp mới
2. Quảng cáo hiển thị trên trang chủ (popup/slider)
3. Phụ huynh xem và có thể đăng ký

---

## 📧 12. NOTIFICATION API

### 12.1 Tạo và gửi thông báo (Admin, Teacher)

**POST** `/notifications`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "title": "Thông báo nghỉ học",
  "content": "Lớp 4a3 nghỉ học ngày mai do giáo viên bận việc đột xuất",
  "targetRole": "Parent",
  "type": "urgent",
  "method": "both",
  "classId": "6853a91e437e7f0016e07c1d"
}
```

**Response Success (201)**:

```json
{
  "success": true,
  "message": "Tạo và gửi thông báo thành công",
  "data": {
    "id": "notif123",
    "title": "Thông báo nghỉ học",
    "sentTo": 25,
    "method": "both",
    "createdAt": "2025-06-30T10:00:00Z"
  }
}
```

### 12.2 Xem thông báo theo vai trò (Student, Parent, Teacher)

**GET** `/notifications/for-role`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

- `page`, `limit`, `type`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif123",
        "title": "Thông báo nghỉ học",
        "content": "Lớp 4a3 nghỉ học ngày mai...",
        "type": "urgent",
        "createdAt": "2025-06-30T10:00:00Z",
        "isRead": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48
    }
  }
}
```

**Lưu ý**: API này chỉ trả về thông báo web, không bao gồm thông báo chỉ gửi qua email

### 12.3 Thiết lập thông báo tự động (Admin)

**POST** `/notifications/auto-notifications`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "type": "attendance_payment",
  "frequency": "monthly",
  "isActive": true,
  "settings": {
    "dayOfMonth": 1,
    "hour": 8,
    "includeAttendance": true,
    "includePayment": true
  }
}
```

**Response Success (201)**:

```json
{
  "success": true,
  "message": "Thiết lập thông báo tự động thành công",
  "data": {
    "id": "auto123",
    "type": "attendance_payment",
    "frequency": "monthly",
    "nextRun": "2025-07-01T08:00:00Z"
  }
}
```

### 12.4 Xem trạng thái scheduler (Admin)

**GET** `/notifications/scheduler/status`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "name": "hourly-notification-check",
        "running": true,
        "scheduled": true,
        "timezone": "Asia/Ho_Chi_Minh"
      },
      {
        "name": "daily-notifications",
        "running": true,
        "scheduled": true
      },
      {
        "name": "monthly-notifications",
        "running": true,
        "scheduled": true
      }
    ],
    "totalJobs": 3,
    "runningJobs": 3
  }
}
```

**Luồng thông báo tự động**:

1. Admin thiết lập thông báo tự động
2. Hệ thống chạy theo lịch định sẵn
3. Tự động gửi email cho phụ huynh về:
   - Số buổi vắng của con
   - Số tiền chưa đóng
   - Thông báo khẩn cấp

### 12.5 Xóa cấu hình thông báo tự động (Admin)

**DELETE** `/notifications/auto-settings/:settingId`

**Headers**: `Authorization: Bearer <token>`

**Response Success (200)**:

```json
{
  "success": true,
  "message": "Xóa cấu hình thông báo tự động thành công",
  "data": {
    "deletedSettingId": "auto123"
  }
}
```

---

## 🔄 13. LUỒNG SỬ DỤNG CHỦ YẾU

### 13.1 Luồng Admin quản lý trung tâm

1. **Đăng nhập**: `POST /login`
2. **Tạo giáo viên**: `POST /teachers`
3. **Tạo lớp học**: `POST /classes`
4. **Tạo học sinh**: `POST /students`
5. **Đăng ký học sinh vào lớp**: `POST /students/:id/enroll`
6. **Tạo phụ huynh**: `POST /parents`
7. **Liên kết phụ huynh-con**: `PATCH /parents/:id/children`
8. **Xem thống kê**: `GET /statistics`
9. **Thiết lập thông báo tự động**: `POST /notifications/auto-notifications`

### 13.2 Luồng Teacher dạy học

1. **Đăng nhập**: `POST /login`
2. **Xem lớp được phân công**: `GET /teachers/:id`
3. **Tạo buổi học**: `POST /attendance/class/:classId`
4. **Điểm danh học sinh**: `PATCH /attendance/:id/mark`
5. **Gửi thông báo khẩn cấp**: `POST /notifications`
6. **Xem lương**: `GET /teacher-wages/teacher/:id`

### 13.3 Luồng Parent theo dõi con

1. **Đăng nhập**: `POST /login`
2. **Xem thông tin con**: `GET /parents/:id/children-details`
3. **Xem khoản chưa thanh toán**: `GET /payments/unpaid/:id`
4. **Tạo yêu cầu thanh toán**: `POST /payments/request`
5. **Xem thông báo**: `GET /notifications/for-role`

### 13.4 Luồng Student học tập

1. **Đăng nhập**: `POST /login`
2. **Xem thông tin học tập**: `GET /students/:id`
3. **Xem thông báo**: `GET /notifications/for-role`

---

## 🎯 14. TÍNH NĂNG ĐẶC BIỆT

### 14.1 Tính học phí theo buổi có mặt

- Hệ thống chỉ tính tiền cho các buổi học sinh có mặt
- Buổi vắng không tính phí
- Áp dụng giảm giá theo % cho từng gia đình

### 14.2 Thông báo tự động qua email

- Gửi thông báo số buổi vắng + tiền chưa đóng
- Thông báo khẩn cấp nghỉ học
- Lịch trình tự động (hàng giờ, ngày, tháng)

### 14.3 Quản lý lớp học theo năm

- Lớp 3 năm 2024 khác lớp 3 năm 2025
- Có thể có nhiều lớp cùng lứa tuổi (3.1, 3.2, 3.3)
- Đóng lớp mà không xóa dữ liệu

### 14.4 Phụ huynh có thể ẩn/hiện thông tin giáo viên

- Admin cấu hình `canSeeTeacher` cho từng phụ huynh
- Linh hoạt theo chính sách trung tâm

---

## ⚠️ 15. LƯU Ý QUAN TRỌNG

### 15.1 Authentication

- Tất cả API (trừ login và public) đều cần JWT token
- Token gửi qua Header: `Authorization: Bearer <token>`

### 15.2 Phân quyền

- **Admin**: Toàn quyền
- **Teacher**: Quản lý lớp được phân công
- **Parent**: Xem thông tin con em
- **Student**: Xem thông tin học tập cá nhân

### 15.3 Pagination

- Hầu hết API list đều hỗ trợ `page` và `limit`
- Default: `page=1`, `limit=10`

### 15.4 Date Format

- Input: `DD/MM/YYYY` hoặc `YYYY-MM-DD`
- Output: ISO 8601 format

### 15.5 Error Handling

```json
{
  "success": false,
  "message": "Lỗi xác thực",
  "error": "Token không hợp lệ"
}
```

---

## 📞 16. LIÊN HỆ & HỖ TRỢ

**Base URL**: `https://english-center-website.onrender.com/v1/api`

**Postman Collection**: English Center APIs.postman_collection.json

**Tài liệu này bao gồm**:

- ✅ Tất cả API endpoints
- ✅ Request/Response examples
- ✅ Luồng sử dụng chi tiết
- ✅ Phân quyền rõ ràng
- ✅ Tính năng đặc biệt của hệ thống
- ✅ Best practices

**Cập nhật lần cuối**: 30/06/2025

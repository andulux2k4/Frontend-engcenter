# Tài Liệu API Trung Tâm Tiếng Anh - Hướng Dẫn Chi Tiết

## Mục Lục

1. [Xác Thực Người Dùng](#xác-thực-người-dùng)
2. [Quản Lý Lớp Học](#quản-lý-lớp-học)
3. [Quản Lý Người Dùng](#quản-lý-người-dùng)
4. [Quản Lý Điểm Danh](#quản-lý-điểm-danh)
5. [Quản Lý Giáo Viên](#quản-lý-giáo-viên)
6. [Quản Lý Phụ Huynh](#quản-lý-phụ-huynh)
7. [Quản Lý Học Sinh](#quản-lý-học-sinh)
8. [Luồng Sử Dụng API](#luồng-sử-dụng-api)
9. [Tổng Hợp Quyền Theo Vai Trò](#tổng-hợp-quyền-theo-vai-trò)

---

1. Xác Thực Người Dùng (3 APIs)
   Đăng nhập hệ thống: Nhận JWT token
   Xem thông tin cá nhân: Profile của user hiện tại
   Cập nhật thông tin cá nhân: Sửa profile

2. Quản Lý Lớp Học (7 APIs)
   Tạo lớp học mới: Admin tạo lớp với đầy đủ thông tin
   Lấy danh sách tất cả lớp: Với bộ lọc theo tên, năm, khối
   Xem chi tiết lớp: Thông tin đầy đủ của một lớp
   Cập nhật thông tin lớp: Sửa thông tin lớp học
   Đóng lớp học: Vô hiệu hóa lớp
   Lấy giáo viên khả dụng: Để phân công
   Lấy học sinh khả dụng: Để thêm vào lớp

3. Quản Lý Người Dùng (1 API)
   Lấy danh sách người dùng: Với phân trang và bộ lọc

4. Quản Lý Điểm Danh (4 APIs)
   Tạo buổi điểm danh mới: Cho một lớp học cụ thể
   Thực hiện điểm danh: Đánh dấu có mặt/vắng mặt (tự động update Payment & TeacherWage)
   Lấy danh sách điểm danh: Lịch sử điểm danh của lớp
   Xóa bản ghi điểm danh: Chỉ Admin

5. Quản Lý Giáo Viên (5 APIs)
   Tạo tài khoản giáo viên mới
   Lấy danh sách tất cả giáo viên
   Lấy thông tin chi tiết giáo viên
   Cập nhật thông tin giáo viên
   Xóa tài khoản giáo viên

6. Quản Lý Phụ Huynh (4 APIs)
   Tạo tài khoản phụ huynh mới
   Cập nhật quan hệ phụ huynh-con: Add/remove con
   Xem thông tin lớp học của con
   Xem các khoản thanh toán chưa hoàn thành

7. Quản Lý Học Sinh (5 APIs)
   Tạo tài khoản học sinh mới
   Lấy danh sách tất cả học sinh
   Lấy thông tin chi tiết học sinh
   Đăng ký học sinh vào lớp: Với giảm giá tùy chọn
   Rút học sinh khỏi lớp: Withdraw từ các lớp

🔄 Luồng Sử Dụng API:
Giáo Viên (Hàng ngày):
Đăng nhập → Xem lớp → Tạo điểm danh → Đánh dấu học sinh → Xem lịch sử
Admin (Quản lý):
Đăng nhập → Tạo giáo viên → Tạo học sinh → Tạo lớp → Đăng ký học sinh → Theo dõi
Phụ Huynh (Theo dõi):
Đăng nhập → Xem lớp của con → Kiểm tra thanh toán

## Xác Thực Người Dùng

### 1. Đăng Nhập Hệ Thống

**Đường dẫn:** `POST /v1/api/login`  
**Mô tả:** Xác thực thông tin người dùng và nhận token JWT  
**Quyền truy cập:** Công khai (Tất cả người dùng)  
**Đầu vào:** Dữ liệu form

- `email` (chuỗi, bắt buộc): Email người dùng
- `password` (chuỗi, bắt buộc): Mật khẩu

**Ví dụ yêu cầu:**

```
POST /v1/api/login
Content-Type: application/x-www-form-urlencoded

Đầu vào : email và password
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "684aee9c10e24b616dccdf74",
    "email": "user1@gmail.com",
    "role": "Student",
    "name": "Nguyễn Văn A"
  }
}
```

### 2. Xem Thông Tin Cá Nhân

**Đường dẫn:** `GET /v1/api/profile`  
**Mô tả:** Lấy thông tin cá nhân của người dùng hiện tại  
**Quyền truy cập:** Tất cả người dùng đã đăng nhập  
**Headers:** `Authorization: Bearer <token>`

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy thông tin profile thành công",
  "data": {
    "id": "684aee9c10e24b616dccdf74",
    "email": "user1@gmail.com",
    "name": "Nguyễn Văn A",
    "role": "Student",
    "gender": "Nam",
    "phoneNumber": "0912345678",
    "address": "123 Đường ABC, TP.HCM"
  }
}
```

### 3. Cập Nhật Thông Tin Cá Nhân

**Đường dẫn:** `PATCH /v1/api/profile`  
**Mô tả:** Cập nhật thông tin cá nhân của người dùng  
**Quyền truy cập:** Tất cả người dùng đã đăng nhập  
**Headers:** `Authorization: Bearer <token>`  
**Đầu vào:** Dữ liệu form (tùy chọn)

- `name` (chuỗi): Họ và tên
- `gender` (chuỗi): Giới tính
- `phoneNumber` (chuỗi): Số điện thoại
- `address` (chuỗi): Địa chỉ

---

## Quản Lý Lớp Học

### 1. Tạo Lớp Học Mới

**Đường dẫn:** `POST /v1/api/class`  
**Mô tả:** Tạo một lớp học mới trong hệ thống  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "className": "3A1",
  "year": 2025,
  "grade": 3,
  "isAvailable": true,
  "feePerLesson": 100000,
  "schedule": {
    "startDate": "19/07/2025",
    "endDate": "31/12/2025",
    "daysOfLessonInWeek": [2, 4, 6]
  },
  "teacherId": "684ba6d8067cbc595e427fb0",
  "studentList": ["684ba74d067cbc595e427fbc", "684ba70e067cbc595e427fb4"]
}
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Tạo lớp học thành công",
  "data": {
    "_id": "684c060dae07023012bcfe22",
    "className": "3A1",
    "year": 2025,
    "grade": 3,
    "isAvailable": true,
    "feePerLesson": 100000,
    "schedule": {
      "startDate": "2025-07-19T00:00:00.000Z",
      "endDate": "2025-12-31T00:00:00.000Z",
      "daysOfLessonInWeek": [2, 4, 6]
    },
    "teacherId": "684ba6d8067cbc595e427fb0",
    "studentList": ["684ba74d067cbc595e427fbc", "684ba70e067cbc595e427fb4"],
    "createdAt": "2025-06-20T10:00:00.000Z"
  }
}
```

### 2. Lấy Danh Sách Tất Cả Lớp Học

**Đường dẫn:** `GET /v1/api/class`  
**Mô tả:** Lấy danh sách tất cả lớp học với bộ lọc  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Tham số truy vấn:**

- `className` (chuỗi, tùy chọn): Lọc theo tên lớp
- `year` (số, tùy chọn): Lọc theo năm học
- `grade` (số, tùy chọn): Lọc theo khối lớp

**Ví dụ yêu cầu:**

```
GET /v1/api/class?className=3A&year=2025&grade=3
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy danh sách lớp học thành công",
  "data": [
    {
      "_id": "684c060dae07023012bcfe22",
      "className": "3A1",
      "year": 2025,
      "grade": 3,
      "isAvailable": true,
      "teacherId": {
        "name": "Nguyễn Văn Giáo",
        "email": "teacher1@gmail.com"
      },
      "studentCount": 25,
      "feePerLesson": 100000
    }
  ],
  "totalClasses": 1
}
```

### 3. Xem Chi Tiết Lớp Học

**Đường dẫn:** `GET /v1/api/class/:classId`  
**Mô tả:** Lấy thông tin chi tiết của một lớp học cụ thể  
**Quyền truy cập:** Admin, Giáo viên (chỉ lớp được phân công)  
**Headers:** `Authorization: Bearer <token>`  
**Tham số đường dẫn:**

- `classId` (chuỗi, bắt buộc): ID của lớp học

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy thông tin lớp học thành công",
  "data": {
    "_id": "684c060dae07023012bcfe22",
    "className": "3A1",
    "year": 2025,
    "grade": 3,
    "isAvailable": true,
    "feePerLesson": 100000,
    "schedule": {
      "startDate": "2025-07-19T00:00:00.000Z",
      "endDate": "2025-12-31T00:00:00.000Z",
      "daysOfLessonInWeek": [2, 4, 6]
    },
    "teacherId": {
      "_id": "684ba6d8067cbc595e427fb0",
      "name": "Nguyễn Văn Giáo",
      "email": "teacher1@gmail.com"
    },
    "studentList": [
      {
        "_id": "684ba74d067cbc595e427fbc",
        "name": "Nguyễn Văn A",
        "email": "student1@gmail.com"
      }
    ]
  }
}
```

### 4. Cập Nhật Thông Tin Lớp Học

**Đường dẫn:** `PATCH /v1/api/class/:classId`  
**Mô tả:** Cập nhật thông tin của lớp học  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Tham số đường dẫn:**

- `classId` (chuỗi, bắt buộc): ID của lớp học

**Ví dụ yêu cầu:**

```json
{
  "className": "4A3",
  "year": 2025,
  "grade": 4,
  "isAvailable": true,
  "feePerLesson": 200000,
  "teacherId": "684ba6d8067cbc595e427fb0",
  "studentList": {
    "studentIds": ["684aee9c10e24b616dccdf76", "684ba70e067cbc595e427fb4"],
    "action": "set"
  },
  "schedule": {
    "startDate": "10/02/2025",
    "endDate": "29/07/2025",
    "daysOfLessonInWeek": [2, 3, 5]
  }
}
```

### 5. Đóng Lớp Học

**Đường dẫn:** `DELETE /v1/api/class/:classId`  
**Mô tả:** Đóng/vô hiệu hóa một lớp học  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Tham số đường dẫn:**

- `classId` (chuỗi, bắt buộc): ID của lớp học

### 6. Lấy Danh Sách Giáo Viên Khả Dụng

**Đường dẫn:** `GET /v1/api/classes/available-teachers`  
**Mô tả:** Lấy danh sách giáo viên có thể phân công cho lớp học  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Tham số truy vấn:**

- `excludeClassId` (chuỗi, tùy chọn): Loại trừ giáo viên đã được phân công cho lớp này

### 7. Lấy Danh Sách Học Sinh Khả Dụng

**Đường dẫn:** `GET /v1/api/classes/available-students`  
**Mô tả:** Lấy danh sách học sinh có thể thêm vào lớp học  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Tham số truy vấn:**

- `excludeClassId` (chuỗi, tùy chọn): Loại trừ học sinh đã có trong lớp này

---

## Quản Lý Người Dùng

### 1. Lấy Danh Sách Người Dùng

**Đường dẫn:** `GET /v1/api/user/`  
**Mô tả:** Lấy danh sách tất cả người dùng với phân trang và bộ lọc  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Tham số truy vấn:**

- `page` (số, tùy chọn, mặc định: 1): Số trang
- `limit` (số, tùy chọn, mặc định: 10): Số bản ghi mỗi trang
- `email` (chuỗi, tùy chọn): Lọc theo email
- `name` (chuỗi, tùy chọn): Lọc theo tên
- `role` (chuỗi, tùy chọn): Lọc theo vai trò (Admin, Teacher, Student, Parent)
- `sortBy` (chuỗi, tùy chọn): Trường sắp xếp
- `sortOrder` (chuỗi, tùy chọn): Thứ tự sắp xếp (asc, desc)

**Ví dụ yêu cầu:**

```
GET /v1/api/user/?page=1&limit=10&email=user&role=Teacher
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy danh sách người dùng thành công",
  "data": [
    {
      "_id": "684ba6d8067cbc595e427fb0",
      "email": "teacher1@gmail.com",
      "name": "Nguyễn Văn Giáo",
      "role": "Teacher",
      "gender": "Nam",
      "phoneNumber": "0912345678",
      "createdAt": "2025-06-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalUsers": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Quản Lý Điểm Danh

### 1. Tạo Buổi Điểm Danh Mới

**Đường dẫn:** `POST /v1/api/attendance/class/:classId`  
**Mô tả:** Tạo buổi điểm danh mới cho lớp học (tất cả học sinh mặc định có mặt)  
**Quyền truy cập:** Giáo viên, Admin  
**Headers:** `Authorization: Bearer <token>`  
**Tham số đường dẫn:**

- `classId` (chuỗi, bắt buộc): ID của lớp học  
  **Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "date": "20/06/2025",
  "lessonNumber": 1
}
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Tạo buổi điểm danh thành công",
  "data": {
    "_id": "68554a7dee73d9a73e547469",
    "classId": "684c060dae07023012bcfe22",
    "date": "2025-06-20T00:00:00.000Z",
    "lessonNumber": 1,
    "students": [
      {
        "studentId": "684ba74d067cbc595e427fbc",
        "isAbsent": false
      },
      {
        "studentId": "684ba70e067cbc595e427fb4",
        "isAbsent": false
      }
    ],
    "createdAt": "2025-06-20T10:00:00.000Z"
  }
}
```

### 2. Thực Hiện Điểm Danh (Đánh Dấu Học Sinh)

**Đường dẫn:** `PATCH /v1/api/attendance/:attendanceId/mark`  
**Mô tả:** Đánh dấu trạng thái có mặt/vắng mặt cho học sinh (tự động cập nhật bản ghi thanh toán và lương giáo viên)  
**Quyền truy cập:** Giáo viên, Admin  
**Headers:** `Authorization: Bearer <token>`  
**Tham số đường dẫn:**

- `attendanceId` (chuỗi, bắt buộc): ID của bản ghi điểm danh  
  **Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "students": [
    {
      "studentId": "684aee9c10e24b616dccdf76",
      "isAbsent": false
    },
    {
      "studentId": "684ba70e067cbc595e427fb4",
      "isAbsent": true
    }
  ]
}
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Điểm danh thành công",
  "data": {
    "_id": "68554a7dee73d9a73e547469",
    "classId": "684c060dae07023012bcfe22",
    "date": "2025-06-20T00:00:00.000Z",
    "lessonNumber": 1,
    "students": [
      {
        "studentId": {
          "_id": "684aee9c10e24b616dccdf76",
          "name": "Nguyễn Văn A"
        },
        "isAbsent": false
      },
      {
        "studentId": {
          "_id": "684ba70e067cbc595e427fb4",
          "name": "Trần Thị B"
        },
        "isAbsent": true
      }
    ],
    "updatedAt": "2025-06-20T11:00:00.000Z"
  }
}
```

### 3. Lấy Danh Sách Điểm Danh Của Lớp

**Đường dẫn:** `GET /v1/api/attendance/class/:classId`  
**Mô tả:** Lấy lịch sử điểm danh của một lớp học cụ thể  
**Quyền truy cập:** Giáo viên, Admin  
**Headers:** `Authorization: Bearer <token>`  
**Tham số đường dẫn:**

- `classId` (chuỗi, bắt buộc): ID của lớp học  
  **Tham số truy vấn:**
- `page` (số, tùy chọn, mặc định: 1): Số trang
- `limit` (số, tùy chọn, mặc định: 10): Số bản ghi mỗi trang
- `startDate` (chuỗi, tùy chọn): Lọc từ ngày (DD/MM/YYYY)
- `endDate` (chuỗi, tùy chọn): Lọc đến ngày (DD/MM/YYYY)

**Ví dụ yêu cầu:**

```
GET /v1/api/attendance/class/684c060dae07023012bcfe22?page=1&limit=5&startDate=01/06/2025
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy danh sách điểm danh lớp thành công",
  "data": [
    {
      "_id": "68554a7dee73d9a73e547469",
      "classId": {
        "className": "3A1",
        "grade": 3
      },
      "date": "2025-06-20T00:00:00.000Z",
      "lessonNumber": 1,
      "students": [
        {
          "studentId": {
            "userId": {
              "name": "Nguyễn Văn A"
            }
          },
          "isAbsent": false
        }
      ],
      "createdAt": "2025-06-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 25
  }
}
```

### 4. Xóa Bản Ghi Điểm Danh

**Đường dẫn:** `DELETE /v1/api/attendance/:attendanceId`  
**Mô tả:** Xóa một bản ghi điểm danh  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Tham số đường dẫn:**

- `attendanceId` (chuỗi, bắt buộc): ID của bản ghi điểm danh

**Ví dụ phản hồi:**

```json
{
  "msg": "Xóa điểm danh thành công"
}
```

---

## Quản Lý Giáo Viên

### 1. Tạo Tài Khoản Giáo Viên Mới

**Đường dẫn:** `POST /v1/api/teachers/`  
**Mô tả:** Tạo tài khoản giáo viên mới trong hệ thống  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "email": "teacher2@gmail.com",
  "passwordBeforeHash": "password123",
  "name": "Trần Văn Giáo",
  "gender": "Nam",
  "phoneNumber": "0912345678",
  "address": "456 Đường Giáo Viên, TP.HCM",
  "specialization": "Tiếng Anh",
  "experience": 5
}
```

### 2. Lấy Danh Sách Tất Cả Giáo Viên

**Đường dẫn:** `GET /v1/api/teachers`  
**Mô tả:** Lấy danh sách tất cả giáo viên  
**Quyền truy cập:** Admin, Học sinh (thông tin hạn chế)  
**Headers:** `Authorization: Bearer <token>`

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy danh sách giáo viên thành công",
  "data": [
    {
      "_id": "684ba6d8067cbc595e427fb0",
      "userId": {
        "name": "Nguyễn Văn Giáo",
        "email": "teacher1@gmail.com"
      },
      "specialization": "Tiếng Anh",
      "experience": 3,
      "currentClasses": ["3A1", "4B2"]
    }
  ]
}
```

### 3. Lấy Thông Tin Chi Tiết Giáo Viên

**Đường dẫn:** `GET /v1/api/teachers/:teacherId`  
**Mô tả:** Lấy thông tin chi tiết của một giáo viên cụ thể  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`

### 4. Cập Nhật Thông Tin Giáo Viên

**Đường dẫn:** `PATCH /v1/api/teachers/:teacherId`  
**Mô tả:** Cập nhật thông tin của giáo viên  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`

### 5. Xóa Tài Khoản Giáo Viên

**Đường dẫn:** `DELETE /v1/api/teachers/:teacherId`  
**Mô tả:** Xóa tài khoản giáo viên khỏi hệ thống  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`

---

## Quản Lý Phụ Huynh

### 1. Tạo Tài Khoản Phụ Huynh Mới

**Đường dẫn:** `POST /v1/api/parents`  
**Mô tả:** Tạo tài khoản phụ huynh mới trong hệ thống  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "email": "parent1@gmail.com",
  "passwordBeforeHash": "password123",
  "name": "Võ Văn Phụ Huynh",
  "gender": "Nam",
  "phoneNumber": "0748278432",
  "address": "789 Đường Phụ Huynh, TP.HCM",
  "childId": null,
  "canSeeTeacher": false
}
```

### 2. Cập Nhật Quan Hệ Phụ Huynh-Con

**Đường dẫn:** `PATCH /v1/api/parents/:parentId/children`  
**Mô tả:** Thêm hoặc xóa con khỏi tài khoản phụ huynh  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "action": "add",
  "studentId": ["684aee9c10e24b616dccdf76"]
}
```

**Các hành động khả dụng:**

- `add`: Thêm con vào tài khoản phụ huynh
- `remove`: Xóa con khỏi tài khoản phụ huynh

### 3. Xem Thông Tin Lớp Học Của Con

**Đường dẫn:** `GET /v1/api/parents/:parentId/classes`  
**Mô tả:** Lấy thông tin về các lớp học mà con đang tham gia  
**Quyền truy cập:** Phụ huynh, Admin  
**Headers:** `Authorization: Bearer <token>`

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy thông tin lớp học của con thành công",
  "data": [
    {
      "child": {
        "_id": "684aee9c10e24b616dccdf76",
        "name": "Nguyễn Văn Con"
      },
      "classes": [
        {
          "_id": "684c060dae07023012bcfe22",
          "className": "3A1",
          "grade": 3,
          "teacher": {
            "name": "Nguyễn Văn Giáo"
          },
          "schedule": {
            "daysOfLessonInWeek": [2, 4, 6]
          }
        }
      ]
    }
  ]
}
```

### 4. Xem Các Khoản Thanh Toán Chưa Hoàn Thành

**Đường dẫn:** `GET /v1/api/parents/:parentId/payments/unpaid`  
**Mô tả:** Lấy danh sách các khoản thanh toán chưa hoàn thành của con  
**Quyền truy cập:** Phụ huynh, Admin  
**Headers:** `Authorization: Bearer <token>`

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy danh sách thanh toán chưa hoàn thành thành công",
  "data": [
    {
      "childName": "Nguyễn Văn Con",
      "unpaidPayments": [
        {
          "_id": "payment123",
          "className": "3A1",
          "month": 6,
          "year": 2025,
          "amountDue": 800000,
          "dueDate": "2025-06-30T00:00:00.000Z"
        }
      ]
    }
  ],
  "totalUnpaid": 800000
}
```

---

## Quản Lý Học Sinh

### 1. Tạo Tài Khoản Học Sinh Mới

**Đường dẫn:** `POST /v1/api/students`  
**Mô tả:** Tạo tài khoản học sinh mới trong hệ thống  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "email": "student3@gmail.com",
  "passwordBeforeHash": "password123",
  "name": "Nguyễn Văn Học Sinh",
  "gender": "Nam",
  "phoneNumber": "0748278432",
  "address": "321 Đường Học Sinh, TP.HCM",
  "classId": null,
  "parentId": null
}
```

### 2. Lấy Danh Sách Tất Cả Học Sinh

**Đường dẫn:** `GET /v1/api/students`  
**Mô tả:** Lấy danh sách tất cả học sinh  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`

**Ví dụ phản hồi:**

```json
{
  "msg": "Lấy danh sách học sinh thành công",
  "data": [
    {
      "_id": "684aee9c10e24b616dccdf76",
      "userId": {
        "name": "Nguyễn Văn A",
        "email": "student1@gmail.com"
      },
      "currentClasses": ["3A1"],
      "parentId": {
        "name": "Võ Văn Phụ Huynh"
      }
    }
  ]
}
```

### 3. Lấy Thông Tin Chi Tiết Học Sinh

**Đường dẫn:** `GET /v1/api/students/:studentId`  
**Mô tả:** Lấy thông tin chi tiết của một học sinh cụ thể  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`

### 4. Đăng Ký Học Sinh Vào Lớp Học

**Đường dẫn:** `POST /v1/api/students/:studentId/enroll`  
**Mô tả:** Đăng ký học sinh vào một hoặc nhiều lớp học với giảm giá tùy chọn  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "classWithDiscount": [
    {
      "classId": "684c060dae07023012bcfe22",
      "discountPercentage": 10
    },
    {
      "classId": "684c060dae07023012bcfe23",
      "discountPercentage": 0
    }
  ]
}
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Đăng ký học sinh vào lớp thành công",
  "data": {
    "enrolledClasses": [
      {
        "classId": "684c060dae07023012bcfe22",
        "className": "3A1",
        "discountApplied": 10,
        "feeAfterDiscount": 90000
      }
    ],
    "paymentsCreated": [
      {
        "paymentId": "payment123",
        "month": 6,
        "year": 2025,
        "amountDue": 90000
      }
    ]
  }
}
```

### 5. Rút Học Sinh Khỏi Lớp Học

**Đường dẫn:** `POST /v1/api/students/:studentId/withdraw`  
**Mô tả:** Rút học sinh khỏi các lớp học đã chỉ định  
**Quyền truy cập:** Chỉ Admin  
**Headers:** `Authorization: Bearer <admin_token>`  
**Đầu vào:** JSON body

**Ví dụ yêu cầu:**

```json
{
  "classIds": ["684e975752f5ca689d6e8d24"]
}
```

**Ví dụ phản hồi:**

```json
{
  "msg": "Rút học sinh khỏi lớp thành công",
  "data": {
    "withdrawnFromClasses": [
      {
        "classId": "684e975752f5ca689d6e8d24",
        "className": "4B2"
      }
    ]
  }
}
```

---

## Luồng Sử Dụng API

### Luồng Công Việc Hàng Ngày Của Giáo Viên

1. **Đăng nhập:** `POST /v1/api/login`
2. **Xem danh sách lớp:** `GET /v1/api/class` (lấy các lớp được phân công)
3. **Tạo buổi điểm danh:** `POST /v1/api/attendance/class/:classId`
4. **Đánh dấu học sinh:** `PATCH /v1/api/attendance/:attendanceId/mark`
5. **Xem lịch sử điểm danh:** `GET /v1/api/attendance/class/:classId`

### Luồng Quản Lý Lớp Học Của Admin

1. **Đăng nhập:** `POST /v1/api/login`
2. **Tạo giáo viên:** `POST /v1/api/teachers/`
3. **Tạo học sinh:** `POST /v1/api/students`
4. **Tạo lớp học:** `POST /v1/api/class`
5. **Đăng ký học sinh:** `POST /v1/api/students/:studentId/enroll`
6. **Theo dõi điểm danh:** `GET /v1/api/attendance/class/:classId`

### Luồng Theo Dõi Của Phụ Huynh

1. **Đăng nhập:** `POST /v1/api/login`
2. **Xem lớp học của con:** `GET /v1/api/parents/:parentId/classes`
3. **Kiểm tra thanh toán:** `GET /v1/api/parents/:parentId/payments/unpaid`

---

## Tổng Hợp Quyền Theo Vai Trò

### 👑 **Admin (Quyền Đầy Đủ)**

**Quản lý người dùng:**

- `GET /v1/api/user/` - Xem tất cả người dùng
- `POST /v1/api/teachers/` - Tạo giáo viên
- `POST /v1/api/students` - Tạo học sinh
- `POST /v1/api/parents` - Tạo phụ huynh
- Tất cả các thao tác cập nhật/xóa người dùng

**Quản lý lớp học:**

- `POST /v1/api/class` - Tạo lớp học
- `GET /v1/api/class` - Xem tất cả lớp học
- `GET /v1/api/class/:classId` - Xem chi tiết lớp
- `PATCH /v1/api/class/:classId` - Cập nhật lớp
- `DELETE /v1/api/class/:classId` - Đóng lớp
- `GET /v1/api/classes/available-teachers` - Xem giáo viên khả dụng
- `GET /v1/api/classes/available-students` - Xem học sinh khả dụng

**Quản lý điểm danh:**

- `POST /v1/api/attendance/class/:classId` - Tạo điểm danh
- `PATCH /v1/api/attendance/:attendanceId/mark` - Đánh dấu điểm danh
- `GET /v1/api/attendance/class/:classId` - Xem điểm danh
- `DELETE /v1/api/attendance/:attendanceId` - Xóa điểm danh

**Thao tác học sinh:**

- `POST /v1/api/students/:studentId/enroll` - Đăng ký học sinh
- `POST /v1/api/students/:studentId/withdraw` - Rút học sinh

**Thao tác phụ huynh:**

- `PATCH /v1/api/parents/:parentId/children` - Quản lý quan hệ phụ huynh-con

### 👩‍🏫 **Giáo Viên (Quyền Giảng Dạy)**

**Thông tin cá nhân:**

- `GET /v1/api/profile` - Xem thông tin cá nhân
- `PATCH /v1/api/profile` - Cập nhật thông tin cá nhân

**Quản lý lớp học:**

- `GET /v1/api/class/:classId` - Xem chi tiết lớp được phân công

**Quản lý điểm danh:**

- `POST /v1/api/attendance/class/:classId` - Tạo điểm danh cho lớp được phân công
- `PATCH /v1/api/attendance/:attendanceId/mark` - Đánh dấu điểm danh học sinh
- `GET /v1/api/attendance/class/:classId` - Xem lịch sử điểm danh

### 👨‍👩‍👧‍👦 **Phụ Huynh (Quyền Theo Dõi Con)**

**Thông tin cá nhân:**

- `GET /v1/api/profile` - Xem thông tin cá nhân
- `PATCH /v1/api/profile` - Cập nhật thông tin cá nhân

**Thông tin con:**

- `GET /v1/api/parents/:parentId/classes` - Xem lớp học của con
- `GET /v1/api/parents/:parentId/payments/unpaid` - Xem thanh toán chưa hoàn thành

**Giáo viên (Hạn chế):**

- `GET /v1/api/teachers` - Xem thông tin giáo viên (nếu canSeeTeacher = true)

### 🎓 **Học Sinh (Quyền Hạn Chế)**

**Thông tin cá nhân:**

- `GET /v1/api/profile` - Xem thông tin cá nhân
- `PATCH /v1/api/profile` - Cập nhật thông tin cá nhân

**Giáo viên:**

- `GET /v1/api/teachers` - Xem thông tin giáo viên

---

## Ghi Chú Quan Trọng

1. **Xác thực bắt buộc:** Tất cả API trừ đăng nhập đều cần header `Authorization: Bearer <token>`
2. **Định dạng token:** JWT token nhận được từ endpoint đăng nhập
3. **Định dạng ngày:** Sử dụng DD/MM/YYYY hoặc YYYY-MM-DD cho input ngày tháng
4. **Phản hồi lỗi:** Tất cả API trả về lỗi theo định dạng:
   ```json
   {
     "msg": "Thông báo lỗi",
     "error": "Mô tả chi tiết lỗi"
   }
   ```
5. **Phân trang:** Hầu hết API danh sách hỗ trợ phân trang với tham số `page` và `limit`
6. **Bộ lọc:** Nhiều API GET hỗ trợ tham số truy vấn để lọc dữ liệu
7. **Tự động cập nhật:** API điểm danh tự động cập nhật bản ghi thanh toán và lương giáo viên

## Mã Trạng Thái HTTP

- `200` - Thành công
- `201` - Tạo thành công
- `400` - Yêu cầu không hợp lệ (lỗi validation)
- `401` - Chưa xác thực (thiếu/sai token)
- `403` - Không có quyền (quyền không đủ)
- `404` - Không tìm thấy
- `500` - Lỗi server nội bộ

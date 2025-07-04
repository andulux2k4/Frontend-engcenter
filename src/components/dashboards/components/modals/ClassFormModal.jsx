import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiEdit,
  FiX,
  FiSave,
  FiUserPlus,
  FiUserX,
  FiUsers,
} from "react-icons/fi";
import apiService from "../../../../services/api";

function ClassFormModal({
  isEdit,
  showModal,
  setShowModal,
  classData,
  setClassData,
  allTeachers,
  handleSubmit,
  loading,
  user,
  setError,
}) {
  // Core state
  const [originalData, setOriginalData] = useState(null);
  const [changedFields, setChangedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initializedRef = useRef(false);

  // Student management state
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Utility functions
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    let date;
    if (typeof dateString === "string" && dateString.includes("/")) {
      const parts = dateString.split("/");
      date = new Date(
        parseInt(parts[2]),
        parseInt(parts[0]) - 1,
        parseInt(parts[1])
      );
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const formatDaysOfWeek = (days) => {
    if (!days || !Array.isArray(days)) return [];

    // Convert numeric days to day names if needed
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days.map((day) => {
      if (typeof day === "number") return dayNames[day];
      return day;
    });
  };

  // Initialize form data when modal opens
  useEffect(() => {
    if (showModal && classData && !initializedRef.current) {
      const formattedData = { ...classData };

      // Auto-fill date fields from schedule if available
      if (classData.schedule) {
        if (classData.schedule.startDate) {
          formattedData.startDate = formatDateForInput(
            classData.schedule.startDate
          );
        }
        if (classData.schedule.endDate) {
          formattedData.endDate = formatDateForInput(
            classData.schedule.endDate
          );
        }
        if (classData.schedule.daysOfLessonInWeek) {
          formattedData.daysOfLessonInWeek = formatDaysOfWeek(
            classData.schedule.daysOfLessonInWeek
          );
        }
      } else {
        // Handle direct date fields
        if (classData.startDate) {
          formattedData.startDate = formatDateForInput(classData.startDate);
        }
        if (classData.endDate) {
          formattedData.endDate = formatDateForInput(classData.endDate);
        }
        if (classData.daysOfLessonInWeek) {
          formattedData.daysOfLessonInWeek = formatDaysOfWeek(
            classData.daysOfLessonInWeek
          );
        }
      }

      // Ensure daysOfLessonInWeek is always an array
      if (!formattedData.daysOfLessonInWeek) {
        formattedData.daysOfLessonInWeek = [];
      }

      setOriginalData(formattedData);
      setChangedFields({});
      setClassData(formattedData);
      initializedRef.current = true;
    }
  }, [showModal]); // Remove classData from dependency array to prevent infinite loop

  // Reset initialization flag when modal closes
  useEffect(() => {
    if (!showModal) {
      initializedRef.current = false;
    }
  }, [showModal]);

  // Track field changes
  useEffect(() => {
    if (originalData && classData) {
      const newChangedFields = {};

      // Check simple fields
      ["name", "year", "grade", "teacherId", "feePerLesson"].forEach(
        (field) => {
          if (originalData[field] !== classData[field]) {
            newChangedFields[field] = classData[field];
          }
        }
      );

      // Check date fields
      if (originalData.startDate !== classData.startDate) {
        newChangedFields.startDate = classData.startDate;
      }
      if (originalData.endDate !== classData.endDate) {
        newChangedFields.endDate = classData.endDate;
      }

      // Check days of week with deep comparison
      const originalDays = originalData.daysOfLessonInWeek || [];
      const currentDays = classData.daysOfLessonInWeek || [];

      if (
        originalDays.length !== currentDays.length ||
        !originalDays.every((day) => currentDays.includes(day))
      ) {
        newChangedFields.daysOfLessonInWeek = currentDays;
      }

      setChangedFields(newChangedFields);
    }
  }, [classData, originalData]);

  // Form submission handler
  const handleFormSubmit = async () => {
    if (!user?.token || isSubmitting) return;

    // For edit mode, require classData to have id
    if (isEdit && !classData?.id && !classData?._id) {
      console.error("❌ Edit mode requires classData with id");
      return;
    }

    console.log("🎯 ClassFormModal - handleFormSubmit called:", {
      isEdit,
      hasClassId: !!(classData?.id || classData?._id),
      classData,
      changedFields: isEdit ? changedFields : "N/A (create mode)",
    });

    // If no changes in edit mode, just close modal
    if (isEdit && Object.keys(changedFields).length === 0) {
      console.log("📝 No changes detected in edit mode, closing modal");
      handleSubmit ? handleSubmit() : setShowModal(false);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        // Edit mode: send only changed fields
        const updateData = {};

        // Handle simple fields
        ["name", "year", "grade", "teacherId", "feePerLesson"].forEach(
          (field) => {
            if (changedFields[field] !== undefined) {
              const apiFieldName = field === "name" ? "className" : field;
              updateData[apiFieldName] = [
                "year",
                "grade",
                "feePerLesson",
              ].includes(field)
                ? parseInt(changedFields[field])
                : changedFields[field];
            }
          }
        );

        // Handle schedule fields
        const hasScheduleChanges =
          changedFields.startDate !== undefined ||
          changedFields.endDate !== undefined ||
          changedFields.daysOfLessonInWeek !== undefined;

        if (hasScheduleChanges) {
          updateData.schedule = {};

          if (changedFields.startDate !== undefined) {
            updateData.schedule.startDate = changedFields.startDate;
          }
          if (changedFields.endDate !== undefined) {
            updateData.schedule.endDate = changedFields.endDate;
          }
          if (changedFields.daysOfLessonInWeek !== undefined) {
            const dayToNumberMap = {
              Monday: 0,
              Tuesday: 1,
              Wednesday: 2,
              Thursday: 3,
              Friday: 4,
              Saturday: 5,
              Sunday: 6,
            };
            updateData.schedule.daysOfLessonInWeek =
              changedFields.daysOfLessonInWeek.map((day) =>
                typeof day === "number" ? day : dayToNumberMap[day]
              );
          }
        }

        const classId = classData.id || classData._id;
        const response = await apiService.updateClass(
          user.token,
          classId,
          updateData
        );

        if (response.data) {
          handleSubmit ? handleSubmit() : setShowModal(false);
        } else {
          setError(response.msg || "Không thể cập nhật lớp học");
        }
      } else {
        // Create mode: use original handler
        console.log(
          "🆕 Create mode - calling handleSubmit from AdminDashboard"
        );
        handleSubmit();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(isEdit ? "Lỗi khi cập nhật lớp học" : "Lỗi khi tạo lớp học");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Student management effects
  useEffect(() => {
    if (isEdit && showModal && classData?.id) {
      fetchEnrolledStudents();
    }
  }, [isEdit, showModal, classData?.id]);

  useEffect(() => {
    if (availableStudents.length > 0) {
      setSelectedStudentId("");
    }
  }, [availableStudents]);

  // Student management functions
  const fetchEnrolledStudents = async () => {
    if (!user?.token || (!classData?.id && !classData?._id)) return;

    setLoadingStudents(true);
    try {
      const classId = classData._id || classData.id;
      const response = await apiService.getClassById(user.token, classId);

      let studentList = [];
      if (response.data?.studentList) {
        studentList = response.data.studentList;
      } else if (response.data?.students) {
        studentList = response.data.students;
      } else if (response.students) {
        studentList = response.students;
      } else if (response.data?.enrollments) {
        studentList = response.data.enrollments;
      }

      setEnrolledStudents(studentList);
    } catch (error) {
      console.error("❌ Error fetching enrolled students:", error);
      setError("Không thể tải danh sách học sinh của lớp");
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchAvailableStudents = async () => {
    if (!user?.token || !classData?.id) return;

    setLoadingStudents(true);
    try {
      const classId = classData._id || classData.id;
      const response = await apiService.getAvailableStudents(
        user.token,
        classId
      );

      if (response.data && Array.isArray(response.data)) {
        setAvailableStudents(response.data);
      }
    } catch (error) {
      console.error("Error fetching available students:", error);
      setError("Không thể tải danh sách học sinh khả dụng");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleEnrollStudent = async () => {
    if (!user?.token || !classData?.id || !selectedStudentId) return;

    setLoadingStudents(true);
    try {
      const classId = classData._id || classData.id;
      const response = await apiService.enrollStudent(
        user.token,
        selectedStudentId,
        {
          classesWithDiscount: [
            {
              classId: classId,
              discountPercentage: parseInt(discountPercentage) || 0,
            },
          ],
        }
      );

      if (response.msg && response.msg.includes("thành công")) {
        fetchEnrolledStudents();
        setShowAddStudentModal(false);
        setSearchTerm("");
        setDiscountPercentage(0);
      } else {
        setError(response.msg || "Không thể thêm học sinh vào lớp");
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
      setError("Lỗi khi thêm học sinh vào lớp");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleWithdrawStudent = async (studentId) => {
    if (!user?.token || !classData?.id) return;

    if (!window.confirm("Bạn có chắc chắn muốn gỡ học sinh này khỏi lớp?")) {
      return;
    }

    setLoadingStudents(true);
    try {
      const classId = classData._id || classData.id;
      const response = await apiService.withdrawStudent(user.token, studentId, {
        classIds: [classId],
      });

      if (response.msg && response.msg.includes("thành công")) {
        fetchEnrolledStudents();
      } else {
        setError(response.msg || "Không thể gỡ học sinh khỏi lớp");
      }
    } catch (error) {
      console.error("Error withdrawing student:", error);
      setError("Lỗi khi gỡ học sinh khỏi lớp");
    } finally {
      setLoadingStudents(false);
    }
  };

  // Filter available students based on search term
  const filteredAvailableStudents = availableStudents.filter((student) => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    if (!searchTermLower) return true;

    const studentName = student.name || student.userId?.name || "";
    const studentEmail = student.email || student.userId?.email || "";

    return (
      studentName.toLowerCase().includes(searchTermLower) ||
      studentEmail.toLowerCase().includes(searchTermLower)
    );
  });

  // Render modal
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: showModal ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "95%",
          maxWidth: "700px",
          maxHeight: "95vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 24px 0 24px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {isEdit ? (
                <>
                  <FiEdit style={{ color: "#3b82f6" }} />
                  Chỉnh sửa lớp học
                </>
              ) : (
                <>
                  <FiPlus style={{ color: "#10b981" }} />
                  Tạo lớp học mới
                </>
              )}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f3f4f6";
                e.target.style.color = "#374151";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#6b7280";
              }}
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
          }}
        >
          {/* Class Information Form */}
          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {/* Class Name */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Tên lớp học <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={classData?.name || ""}
                onChange={(e) =>
                  setClassData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nhập tên lớp học"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Year and Grade */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Năm học <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="number"
                  value={classData?.year || new Date().getFullYear()}
                  onChange={(e) =>
                    setClassData((prev) => ({ ...prev, year: e.target.value }))
                  }
                  min={new Date().getFullYear() - 5}
                  max={new Date().getFullYear() + 5}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#111827",
                    backgroundColor: "#ffffff",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Khối lớp <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={classData?.grade || ""}
                  onChange={(e) =>
                    setClassData((prev) => ({ ...prev, grade: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#111827",
                    backgroundColor: "#ffffff",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                >
                  <option value="">Chọn khối lớp</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Lớp {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teacher */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Giáo viên phụ trách
              </label>
              <select
                value={classData?.teacherId || ""}
                onChange={(e) =>
                  setClassData((prev) => ({
                    ...prev,
                    teacherId: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              >
                <option value="">Chọn giáo viên</option>
                {(allTeachers || []).map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee per Lesson */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Học phí mỗi buổi (VNĐ){" "}
                <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                value={classData?.feePerLesson || ""}
                onChange={(e) =>
                  setClassData((prev) => ({
                    ...prev,
                    feePerLesson: e.target.value,
                  }))
                }
                placeholder="Nhập học phí mỗi buổi"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Start and End Dates */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Ngày bắt đầu <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="date"
                  value={classData?.startDate || ""}
                  onChange={(e) =>
                    setClassData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#111827",
                    backgroundColor: "#ffffff",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Ngày kết thúc <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="date"
                  value={classData?.endDate || ""}
                  onChange={(e) =>
                    setClassData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#111827",
                    backgroundColor: "#ffffff",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {/* Days of Week */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Ngày học trong tuần <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "8px",
                }}
              >
                {[
                  { key: "Monday", label: "Thứ 2" },
                  { key: "Tuesday", label: "Thứ 3" },
                  { key: "Wednesday", label: "Thứ 4" },
                  { key: "Thursday", label: "Thứ 5" },
                  { key: "Friday", label: "Thứ 6" },
                  { key: "Saturday", label: "Thứ 7" },
                  { key: "Sunday", label: "Chủ nhật" },
                ].map(({ key, label }) => {
                  const isSelected = (
                    classData?.daysOfLessonInWeek || []
                  ).includes(key);
                  return (
                    <label
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 16px",
                        border: `2px solid ${
                          isSelected ? "#3b82f6" : "#e5e7eb"
                        }`,
                        borderRadius: "8px",
                        backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                        color: isSelected ? "#1d4ed8" : "#374151",
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "all 0.2s ease",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.target.style.backgroundColor = "#f9fafb";
                          e.target.style.borderColor = "#9ca3af";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.target.style.backgroundColor = "#ffffff";
                          e.target.style.borderColor = "#e5e7eb";
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const days = classData?.daysOfLessonInWeek || [];
                          if (e.target.checked) {
                            setClassData((prev) => ({
                              ...prev,
                              daysOfLessonInWeek: [...days, key],
                            }));
                          } else {
                            setClassData((prev) => ({
                              ...prev,
                              daysOfLessonInWeek: days.filter(
                                (day) => day !== key
                              ),
                            }));
                          }
                        }}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#3b82f6",
                        }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Changed Fields Debug Info (only in edit mode) */}
            {isEdit && Object.keys(changedFields).length > 0 && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "8px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    color: "#0369a1",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Các trường đã thay đổi ({Object.keys(changedFields).length}):
                </h4>
                <div style={{ fontSize: "12px", color: "#0369a1" }}>
                  {Object.entries(changedFields).map(([field, value]) => (
                    <div key={field} style={{ marginBottom: "4px" }}>
                      <strong>{field}:</strong>{" "}
                      {field === "daysOfLessonInWeek"
                        ? JSON.stringify(value)
                        : String(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Management Section (only in edit mode) */}
          {isEdit && classData?.id && (
            <div
              style={{
                marginTop: "32px",
                borderTop: "2px solid #e5e7eb",
                paddingTop: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#111827",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FiUsers style={{ color: "#3b82f6" }} />
                  Danh sách học sinh ({enrolledStudents.length})
                </h3>
                <button
                  onClick={() => {
                    fetchAvailableStudents();
                    setShowAddStudentModal(true);
                  }}
                  disabled={Object.keys(changedFields).length > 0}
                  style={{
                    padding: "10px 16px",
                    backgroundColor:
                      Object.keys(changedFields).length > 0
                        ? "#9ca3af"
                        : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor:
                      Object.keys(changedFields).length > 0
                        ? "not-allowed"
                        : "pointer",
                    opacity: Object.keys(changedFields).length > 0 ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <FiUserPlus />
                  Thêm học sinh
                </button>
              </div>

              {/* Warning for unsaved changes */}
              {Object.keys(changedFields).length > 0 && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px 16px",
                    backgroundColor: "#fef3c7",
                    border: "1px solid #f59e0b",
                    borderRadius: "8px",
                    color: "#92400e",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ⚠️ Có thay đổi chưa lưu. Vui lòng lưu thay đổi trước khi quản
                  lý học sinh.
                </div>
              )}

              {/* Students List */}
              {loadingStudents ? (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Đang tải danh sách học sinh...
                </div>
              ) : enrolledStudents.length > 0 ? (
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      padding: "12px 16px",
                      borderBottom: "1px solid #e5e7eb",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr auto",
                      gap: "16px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    <div>Tên học sinh</div>
                    <div>Email</div>
                    <div>Số điện thoại</div>
                    <div>Thao tác</div>
                  </div>
                  {enrolledStudents.map((student, index) => (
                    <div
                      key={student._id || student.id || index}
                      style={{
                        padding: "12px 16px",
                        borderBottom:
                          index < enrolledStudents.length - 1
                            ? "1px solid #e5e7eb"
                            : "none",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr auto",
                        gap: "16px",
                        fontSize: "14px",
                        color: "#111827",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        {student.userId?.name ||
                          student.name ||
                          student.studentId?.name ||
                          student.user?.name ||
                          "(Không có tên)"}
                      </div>
                      <div>
                        {student.userId?.email ||
                          student.email ||
                          student.studentId?.email ||
                          student.user?.email ||
                          ""}
                      </div>
                      <div>
                        {student.userId?.phoneNumber ||
                          student.phoneNumber ||
                          student.phone ||
                          student.studentId?.phoneNumber ||
                          student.user?.phoneNumber ||
                          ""}
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            handleWithdrawStudent(student._id || student.id)
                          }
                          disabled={Object.keys(changedFields).length > 0}
                          style={{
                            padding: "6px 12px",
                            backgroundColor:
                              Object.keys(changedFields).length > 0
                                ? "#9ca3af"
                                : "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            cursor:
                              Object.keys(changedFields).length > 0
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              Object.keys(changedFields).length > 0 ? 0.6 : 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <FiUserX />
                          Gỡ khỏi lớp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Chưa có học sinh nào trong lớp này
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            padding: "24px",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setShowModal(false)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#ffffff",
              color: "#374151",
              border: "2px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f3f4f6";
              e.target.style.borderColor = "#9ca3af";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.borderColor = "#d1d5db";
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleFormSubmit}
            disabled={loading || isSubmitting}
            style={{
              padding: "12px 24px",
              backgroundColor: loading || isSubmitting ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading || isSubmitting ? "not-allowed" : "pointer",
              opacity: loading || isSubmitting ? 0.7 : 1,
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {loading || isSubmitting ? (
              "Đang xử lý..."
            ) : isEdit ? (
              Object.keys(changedFields).length > 0 ? (
                <>
                  <FiSave />
                  Lưu thay đổi
                </>
              ) : (
                <>
                  <FiSave />
                  Lưu
                </>
              )
            ) : (
              <>
                <FiPlus />
                Tạo lớp học
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Add Student Modal Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FiUserPlus style={{ color: "#10b981" }} />
                Thêm học sinh vào lớp
              </h3>
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  setSearchTerm("");
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "20px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.color = "#374151";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#6b7280";
                }}
              >
                <FiX />
              </button>
            </div>

            {/* Add Student Modal Content */}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: "24px",
              }}
            >
              {loadingStudents ? (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Đang tải danh sách học sinh khả dụng...
                </div>
              ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                  {/* Search Input */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Tìm kiếm học sinh
                    </label>
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên hoặc email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "#111827",
                        backgroundColor: "#ffffff",
                        transition: "border-color 0.2s ease",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>

                  {/* Student Selection */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Chọn học sinh <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "#111827",
                        backgroundColor: "#ffffff",
                        transition: "border-color 0.2s ease",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    >
                      <option value="">-- Chọn học sinh --</option>
                      {filteredAvailableStudents.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.name || student.userId?.name} (
                          {student.email || student.userId?.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Giảm giá (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercentage}
                      onChange={(e) => {
                        const value = Math.min(
                          Math.max(0, parseInt(e.target.value) || 0),
                          100
                        );
                        setDiscountPercentage(value);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "#111827",
                        backgroundColor: "#ffffff",
                        transition: "border-color 0.2s ease",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Add Student Modal Actions */}
            <div
              style={{
                padding: "24px",
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  setSearchTerm("");
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ffffff",
                  color: "#374151",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.borderColor = "#9ca3af";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#d1d5db";
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleEnrollStudent}
                disabled={!selectedStudentId || loadingStudents}
                style={{
                  padding: "12px 24px",
                  backgroundColor:
                    selectedStudentId && !loadingStudents
                      ? "#10b981"
                      : "#9ca3af",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor:
                    selectedStudentId && !loadingStudents
                      ? "pointer"
                      : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                {loadingStudents ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    <FiUserPlus />
                    Thêm học sinh
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassFormModal;

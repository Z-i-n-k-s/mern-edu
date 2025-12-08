const Course = require("../../models/courseModel");
const Teacher = require("../../models/userModel");

// Create a new course
exports.createCourse = async (req, res) => {
  const { teacherId } = req.params;
  const { Course_Name } = req.body;

  // Fix field name: schema uses instructorId
  const courseData = {
    ...req.body,
    instructorId: teacherId,
  };

  try {
    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Prevent duplicate course names for the same instructor
    const existingCourse = await Course.findOne({
      Course_Name: Course_Name,
      instructorId: teacherId,
    });

    if (existingCourse) {
      return res
        .status(400)
        .json({ message: "Course with the same name already exists" });
    }

    // Create course
    const course = await Course.create(courseData);

    res.status(201).json({
      message: "Course created",
      course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create course",
      error: err.message,
    });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};

// Get course by name
exports.getCourseByName = async (req, res) => {
  try {
    const course = await Course.findOne({
      Course_Name: req.params.courseName,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Failed to fetch course details:", error);
    res.status(500).json({ message: "Failed to fetch course details" });
  }
};

// Student enroll in a course
exports.enrollInCourse = async (req, res) => {
  const { courseId } = req.params;
  const { studentId, amount, method } = req.body;

  try {
    if (!studentId) {
      return res.status(400).json({ message: "Student ID required" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    if (!method) {
      return res.status(400).json({ message: "Payment method required" });
    }

    // Find course (string ID)
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Teacher is stored as string instructorId
    const teacher = await Teacher.findById(course.instructorId);
    if (!teacher) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Prevent duplicate enrollment
    if (course.studentsEnrolledIds.includes(studentId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Add student (string only)
    course.studentsEnrolledIds.push(studentId);
    await course.save();

    // Increase teacher revenue (add field if not exists)
    teacher.revenue = (teacher.revenue || 0) + amount;
    await teacher.save();

    res.status(200).json({ message: "Enrollment successful" });

  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({
      message: "Enrollment failed",
      error: err.message,
    });
  }
};
exports.getStudentCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const courses = await Course.find({
      studentsEnrolledIds: studentId,
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

const express = require('express');
const router = express.Router();

// User controllers
const userSignUpController = require("../controller/User/userSignUp");
const userSignInController = require("../controller/User/userSignIn");
const userDetailsController = require('../controller/User/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/User/userLogout');
const allUsers = require('../controller/User/allUsers');
const updateUser = require('../controller/User/updateUser');
const userSearchController = require('../controller/User/userSearch');
const userDeleteController = require('../controller/User/userDelete');
const updateProfile = require('../controller/User/updateProfile');
const userForgotPass = require('../controller/User/userForgotPass');
const userResetPass = require('../controller/User/userResetPass');
const verifyResetToken = require('../controller/User/verifyResetToken');
const { createCourse, getAllCourses, getCourseByName, enrollInCourse, getStudentCourses } = require('../controller/course/courseController');




// ---------------- USER ROUTES ----------------

router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);

// Forgot/reset password
router.post("/forgot-password", userForgotPass);
router.post("/reset-password", userResetPass);
router.get("/verify-reset-token/:token", verifyResetToken);

// Admin panel
router.get("/all-user", authToken, allUsers);
router.post("/user-search", userSearchController);
router.post("/update-user", authToken, updateUser);
router.post("/update-profile", authToken, updateProfile);
router.post("/delete-user", authToken, userDeleteController);

// ---------------- COURSE ROUTES ----------------

// Create course for a specific teacher
router.post("/course/create/:teacherId", authToken, createCourse);

// Get all courses
router.get("/courses", getAllCourses);

// Get course by name
router.get("/course/name/:courseName", getCourseByName);


// ---------------- ENROLLMENT ROUTES ----------------

// Student enrolls in a course (string IDs only)
router.post(
  "/course/enroll/:courseId", 
  authToken, 
  enrollInCourse
);

// Get all courses a student is enrolled in
router.get(
  "/courses/student/:studentId",
  authToken,
  getStudentCourses
);


module.exports = router;

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

// Course controllers
const {
  createCourse,
  getAllCourses,
  getCourseByName,
  enrollInCourse,
  getStudentCourses
} = require('../controller/course/courseController');

// 🔴 Live Class controllers

const studentAllLiveClasses = require('../controller/liveclass/studentAllLiveClasses');
const teacherLiveClassHistory = require('../controller/liveclass/teacherLiveClassHistory');
const cancelLiveClass = require('../controller/liveclass/cancelLiveClass');
const updateLiveClass = require('../controller/liveclass/updateLiveClass');
const createLiveClass = require('../controller/liveclass/createLiveClass');


const assignmentController = require("../controller/assignment/assignmentController");
const quizController = require("../controller/quiz/quizController");


// ---------------- USER ROUTES ----------------

router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);

router.post("/forgot-password", userForgotPass);
router.post("/reset-password", userResetPass);
router.get("/verify-reset-token/:token", verifyResetToken);

router.get("/all-user", authToken, allUsers);
router.post("/user-search", userSearchController);
router.post("/update-user", authToken, updateUser);
router.post("/update-profile", authToken, updateProfile);
router.post("/delete-user", authToken, userDeleteController);


// ---------------- COURSE ROUTES ----------------

router.post("/course/create/:teacherId", authToken, createCourse);
router.get("/courses", getAllCourses);
router.get("/course/name/:courseName", getCourseByName);


// ---------------- ENROLLMENT ROUTES ----------------

router.post(
  "/course/enroll/:courseId",
  authToken,
  enrollInCourse
);

router.get(
  "/courses/student/:studentId",
  authToken,
  getStudentCourses
);


// ---------------- LIVE CLASS ROUTES ----------------

// Teacher creates a live class
router.post(
  "/live-class/create",
  authToken,
  createLiveClass
);

// Teacher updates live class (date/time/title)
router.put(
  "/live-class/update/:liveClassId",
  authToken,
  updateLiveClass
);

// Teacher cancels a live class
router.put(
  "/live-class/cancel/:liveClassId",
  authToken,
  cancelLiveClass
);

// Teacher views his live class history
router.get(
  "/live-class/teacher/history",
  authToken,
  teacherLiveClassHistory
);

// Student views ALL available live classes
router.get(
  "/live-class/student/all",
  authToken,
  studentAllLiveClasses
);

// Assignment routes
router.post("/assignments", assignmentController.createAssignment);
router.get("/assignments", assignmentController.getAssignmentsByCourse);
router.get("/assignments-questions", assignmentController.getAssignmentsByTeacher);
router.post("/assignment-answers", assignmentController.submitAssignmentAnswer);
router.get("/assignment-answers", assignmentController.getAssignmentAnswersByStudent);
router.get("/assignment-answers-questions", assignmentController.getAssignmentAnswersByQuestion);
router.post("/assignment-feedback", assignmentController.submitAssignmentFeedback);
router.get("/assignment-feedback", assignmentController.getAssignmentFeedbackByTeacher);
router.get("/assignment-feedback/by-answer", assignmentController.getAssignmentFeedbackByAnswer);

// Quiz routes
router.post("/teacher/:teacherId/courses/:courseId/quizzes", quizController.createQuiz);
router.get("/course/:courseId/quizzes", quizController.getQuizzesByCourse);
router.post("/quizAttempt", quizController.saveQuizAttempt);
router.get("/student/:studentId/quizAttempts", quizController.getQuizAttemptsByStudent);

module.exports = router;

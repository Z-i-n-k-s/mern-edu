const backendDomain = process.env.REACT_APP_BACKEND_URL;

const SummaryApi = {
  // ------------------- USER APIS -------------------
  signUP: { url: `${backendDomain}/api/signup`, method: "post" },
  signIn: { url: `${backendDomain}/api/signin`, method: "post" },
  current_user: { url: `${backendDomain}/api/user-details`, method: "get" },
  forgotPassword: { url: `${backendDomain}/api/forgot-password`, method: "post" },
  verifyResetToken: { url: `${backendDomain}/api/verify-reset-token`, method: "get" },
  resetPassword: { url: `${backendDomain}/api/reset-password`, method: "post" },
  logout_user: { url: `${backendDomain}/api/userLogout`, method: "get" },
  allUser: { url: `${backendDomain}/api/all-user`, method: "get" },
  userSearch: { url: `${backendDomain}/api/user-search`, method: "post" },
  updateUser: { url: `${backendDomain}/api/update-user`, method: "post" },
  updateProfile: { url: `${backendDomain}/api/update-profile`, method: "post" },
  deleteUser: { url: `${backendDomain}/api/delete-user`, method: "post" },

  // ------------------- COURSE APIS -------------------
  createCourse: (teacherId) => ({
    url: `${backendDomain}/api/course/create/${teacherId}`,
    method: "post",
  }),
  getAllCourses: { url: `${backendDomain}/api/courses`, method: "get" },
  getCourseByName: (courseName) => ({
    url: `${backendDomain}/api/course/name/${courseName}`,
    method: "get",
  }),

  // ------------------- STUDENT COURSE APIS -------------------
  studentAllCourses: { url: `${backendDomain}/api/student/courses`, method: "get" },

  enrollInCourse: (courseId) => ({
    url: `${backendDomain}/api/course/enroll/${courseId}`,
    method: "post",
  }),

  getStudentCourses: (studentId) => ({
    url: `${backendDomain}/api/courses/student/${studentId}`,
    method: "get",
  }),
};

export default SummaryApi;

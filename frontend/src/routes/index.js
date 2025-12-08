import App from "../App";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUP from "../pages/SignUP";
import Adminpanel from "../pages/Adminpanel";
import AllUsers from "../pages/AllUsers";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import { useSelector } from "react-redux";
import { createBrowserRouter, Navigate } from "react-router-dom";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import ROLE from "../common/role";
import TeacherCreateCourse from "../pages/TeacherCreateCourse";
import StudentAllCourses from "../pages/StudentAllCourses";
import StudentEnrolledCourses from "../pages/StudentEnrolledCourses";

// Redirect root
const RootRedirect = () => {
  const user = useSelector((state) => state?.user?.user);

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case ROLE.ADMIN:
      return <Navigate to="/admin-panel/all-users" replace />;
    case ROLE.TEACHER:
      return <Navigate to="/teacher-dashboard" replace />;
    case ROLE.STUDENT:
      return <Navigate to="/student-dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <RootRedirect /> },

      { path: "login", element: <GuestRoute><Login /></GuestRoute> },
      { path: "forgot-password", element: <GuestRoute><ForgotPassword /></GuestRoute> },
      { path: "reset-password/:token", element: <GuestRoute><ResetPassword /></GuestRoute> },
      { path: "sign-up", element: <GuestRoute><SignUP /></GuestRoute> },

      { path: "home", element: <ProtectedRoute><Home /></ProtectedRoute> },

      // STUDENT ROUTE
      {
        path: "student-dashboard",
        element: (
          <ProtectedRoute role={ROLE.STUDENT}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student/all-courses",
        element: (
          <ProtectedRoute role={ROLE.STUDENT}>
            <StudentAllCourses />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student/my-courses",
        element: (
          <ProtectedRoute role={ROLE.STUDENT}>
            <StudentEnrolledCourses />
          </ProtectedRoute>
        ),
      },

      // TEACHER ROUTE
      {
        path: "teacher-dashboard",
        element: (
          <ProtectedRoute role={ROLE.TEACHER}>
            <TeacherDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/teacher/my-courses",
        element: (
          <ProtectedRoute role={ROLE.TEACHER}>
            <TeacherCreateCourse />
          </ProtectedRoute>
        ),
      },

      // ADMIN ROUTES
      {
        path: "admin-panel",
        element: (
          <ProtectedRoute role={ROLE.ADMIN}>
            <Adminpanel />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "all-users",
            element: (
              <ProtectedRoute role={ROLE.ADMIN}>
                <AllUsers />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;

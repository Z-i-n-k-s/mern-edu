import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

const StudentEnrolledCourses = () => {
  const user = useSelector((state) => state?.user?.user);
  const studentId = user?._id;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (!studentId) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(SummaryApi.getStudentCourses(studentId).url, {
          method: SummaryApi.getStudentCourses(studentId).method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch courses");
          setLoading(false);
          return;
        }

        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error fetching courses");
        setLoading(false);
      }
    };

    fetchStudentCourses();
  }, [studentId]);

  if (loading) {
    return <div className="p-4">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (courses.length === 0) {
    return <div className="p-4">You are not enrolled in any courses yet.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Courses</h2>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li
            key={course._id}
            className="border p-3 rounded hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{course.Course_Name}</h3>
            <p><strong>Department:</strong> {course.Department}</p>
            <p><strong>Credit:</strong> {course.Credit}</p>
            <p><strong>Schedule:</strong> {course.Schedule || "Not scheduled"}</p>
            <p><strong>Price:</strong> ${course.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentEnrolledCourses;

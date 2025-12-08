import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import StudentEnrollCourse from "../components/StudentEnrollCourse";

const StudentAllCourses = () => {
  const user = useSelector((state) => state?.user?.user);
  const studentId = user?._id;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await fetch(SummaryApi.getAllCourses.url, {
        method: SummaryApi.getAllCourses.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load courses.");
        setLoading(false);
        return;
      }

      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error loading courses. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const handleViewDetailsClick = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  if (loading) return <div className="p-6">Loading courses...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
      {courses.length === 0 ? (
        <div>No courses available at the moment.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = course.studentsEnrolledIds.includes(studentId);
            return (
              <div
                key={course._id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold">{course.Course_Name}</h3>
                <p><strong>Initial:</strong> {course.Course_Initial}</p>
                <p><strong>Credit:</strong> {course.Credit}</p>
                <p><strong>Department:</strong> {course.Department}</p>
                <p><strong>Prerequisites:</strong> {course.Prerequisites || "None"}</p>
                <p><strong>Description:</strong> {course.Description || "No description"}</p>
                <p><strong>Schedule:</strong> {course.Schedule || "Not scheduled"}</p>
                <p><strong>Price:</strong> ${course.price || 0}</p>
                <p><strong>Advanced:</strong> {course.advanced ? "Yes" : "No"}</p>

                <div className="flex gap-2 mt-3">
                  {isEnrolled ? (
                    <>
                      <span className="px-3 py-1 bg-gray-400 text-white rounded">
                        Already Enrolled
                      </span>
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => handleViewDetailsClick(course)}
                      >
                        View Details
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => handleEnrollClick(course)}
                      >
                        Enroll Now
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => handleViewDetailsClick(course)}
                      >
                        View Details
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enroll Modal */}
      {showEnrollModal && selectedCourse && (
        <StudentEnrollCourse
          course={selectedCourse}
          onClose={() => setShowEnrollModal(false)}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">{selectedCourse.Course_Name}</h3>
            <p><strong>Initial:</strong> {selectedCourse.Course_Initial}</p>
            <p><strong>Credit:</strong> {selectedCourse.Credit}</p>
            <p><strong>Department:</strong> {selectedCourse.Department}</p>
            <p><strong>Prerequisites:</strong> {selectedCourse.Prerequisites || "None"}</p>
            <p><strong>Description:</strong> {selectedCourse.Description || "No description"}</p>
            <p><strong>Schedule:</strong> {selectedCourse.Schedule || "Not scheduled"}</p>
            <p><strong>Price:</strong> ${selectedCourse.price || 0}</p>
            <p><strong>Advanced:</strong> {selectedCourse.advanced ? "Yes" : "No"}</p>

            <button
              className="mt-4 px-4 py-2 bg-gray-400 rounded"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAllCourses;

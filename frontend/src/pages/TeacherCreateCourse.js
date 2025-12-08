import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

const TeacherCreateCourse = () => {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Logged-in teacher from Redux
  const user = useSelector((state) => state?.user?.user);
  const teacherId = user?._id || user?.id;

  // Form data
  const [formData, setFormData] = useState({
    Course_Name: "",
    Course_Initial: "",
    Credit: "",
    Department: "",
    Prerequisites: "",
    Description: "",
    Schedule: "",
    price: "",
    advanced: false,
    studentsEnrolledIds: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Fetch teacher-specific courses
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

      // Filter: Keep only teacher's courses
      const filtered = data.filter(
        (course) =>
          course.instructorId?.toString() === teacherId?.toString()
      );

      setCourses(filtered);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error loading courses. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) fetchCourses();
  }, [teacherId]);

  const handleCreateCourse = async () => {
    if (!teacherId) {
      alert("Teacher ID missing. Login again.");
      return;
    }

    try {
      const response = await fetch(SummaryApi.createCourse(teacherId).url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create course");
        return;
      }

      alert("Course created successfully!");
      setShowModal(false);

      // Reset form
      setFormData({
        Course_Name: "",
        Course_Initial: "",
        Credit: "",
        Department: "",
        Prerequisites: "",
        Description: "",
        Schedule: "",
        price: "",
        advanced: false,
        studentsEnrolledIds: [],
      });

      // Refresh course list
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Course</h2>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setShowModal(true)}
      >
        + New Course
      </button>

      {/* Course List */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Your Courses</h3>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && courses.length === 0 && (
          <p>You haven't created any courses yet.</p>
        )}

        {courses.map((course) => (
          <div key={course._id} className="border p-3 rounded mb-3">
            <h4 className="font-semibold">{course.Course_Name}</h4>
            <p>Initial: {course.Course_Initial}</p>
            <p>Credit: {course.Credit}</p>
            <p>Schedule: {course.Schedule}</p>
          </div>
        ))}
      </div>

      {/* POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Create New Course</h3>

            <input
              type="text"
              name="Course_Name"
              placeholder="Course Name"
              value={formData.Course_Name}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <input
              type="text"
              name="Course_Initial"
              placeholder="Course Initial"
              value={formData.Course_Initial}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <input
              type="number"
              name="Credit"
              placeholder="Credit"
              value={formData.Credit}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <input
              type="text"
              name="Department"
              placeholder="Department"
              value={formData.Department}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <input
              type="text"
              name="Prerequisites"
              placeholder="Prerequisites"
              value={formData.Prerequisites}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <textarea
              name="Description"
              placeholder="Description"
              value={formData.Description}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <input
              type="text"
              name="Schedule"
              placeholder="Schedule (e.g. Sun-Tue 10AM)"
              value={formData.Schedule}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                name="advanced"
                checked={formData.advanced}
                onChange={handleChange}
              />
              Advanced Course
            </label>

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-400 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleCreateCourse}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCreateCourse;

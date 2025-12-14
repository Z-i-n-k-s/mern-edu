import React, { useState, useEffect } from "react";
import SummaryApi from "../common";

const CreateAssignmentModal = ({ onClose, onSuccess, teacherId }) => {
  const [courseId, setCourseId] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentQuestion, setAssignmentQuestion] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch teacher courses to populate dropdown
  const fetchCourses = async () => {
    try {
      const res = await fetch(SummaryApi.getAllCourses.url, {
        method: SummaryApi.getAllCourses.method,
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        // filter courses for this teacher
        const teacherCourses = data.filter(
          (c) => c.instructorId === teacherId
        );
        setCourses(teacherCourses);
        if (teacherCourses.length > 0) setCourseId(teacherCourses[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (teacherId) fetchCourses();
  }, [teacherId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !assignmentName || !assignmentQuestion) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(SummaryApi.createAssignment.url, {
        method: SummaryApi.createAssignment.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId,
          courseId,
          assignmentName,
          assignmentQuestion,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(); // refresh list
        onClose(); // close modal
      } else {
        setError(data.message || "Failed to create assignment");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while creating assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Create Assignment</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 font-medium">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.Course_Name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Assignment Name</label>
            <input
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Assignment Question</label>
            <textarea
              value={assignmentQuestion}
              onChange={(e) => setAssignmentQuestion(e.target.value)}
              className="w-full border px-2 py-1 rounded"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;

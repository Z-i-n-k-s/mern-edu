import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import CreateAssignmentModal from "../components/CreateAssignmentModal";

const TeacherPostAssignment = () => {
  const user = useSelector((state) => state?.user?.user);
  const teacherId = user?._id || user?.id;

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch teacher's assignments
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${SummaryApi.getAssignmentsByTeacher.url}?teacherId=${teacherId}`,
        {
          method: SummaryApi.getAssignmentsByTeacher.method,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAssignments(data);
      } else {
        setError(data.message || "Failed to fetch assignments");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) fetchAssignments();
  }, [teacherId]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Assignments</h2>
        <button
          onClick={() => setOpenCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Assignment
        </button>
      </div>

      {loading ? (
        <p>Loading assignments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : assignments.length === 0 ? (
        <p>No assignments posted yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Assignment Name</th>
              <th>Course ID</th>
              <th>Question</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id} className="border-t text-center">
                <td>{assignment.assignmentName}</td>
                <td>{assignment.courseId}</td>
                <td>{assignment.assignmentQuestion}</td>
                <td>
                  {new Date(assignment.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {openCreateModal && (
        <CreateAssignmentModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={fetchAssignments}
          teacherId={teacherId}
        />
      )}
    </div>
  );
};

export default TeacherPostAssignment;

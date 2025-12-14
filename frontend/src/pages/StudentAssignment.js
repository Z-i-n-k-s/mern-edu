import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

const StudentAssignment = () => {
  const user = useSelector((state) => state?.user?.user);
  const studentId = user?._id || user?.id;

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // {assignmentId: {base64, fileName}}
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Convert file → Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  // 1️⃣ Fetch student courses
  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (!studentId) return;
      setLoading(true);
      setMessage("");

      try {
        const res = await fetch(SummaryApi.getStudentCourses(studentId).url, {
          method: SummaryApi.getStudentCourses(studentId).method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.message || "Failed to fetch courses");
          setLoading(false);
          return;
        }
        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("Error fetching courses");
        setLoading(false);
      }
    };

    fetchStudentCourses();
  }, [studentId]);

  // 2️⃣ Fetch assignments for each course
  useEffect(() => {
    if (!courses.length) return;

    const fetchAssignments = async () => {
      try {
        const allAssignments = [];
        for (const course of courses) {
          const res = await fetch(
            `${SummaryApi.getAssignmentsByCourse.url}?courseId=${course._id}`,
            {
              method: SummaryApi.getAssignmentsByCourse.method,
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );
          const data = await res.json();
          if (res.ok) allAssignments.push(...data);
        }
        setAssignments(allAssignments);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch assignments");
      }
    };

    fetchAssignments();
  }, [courses]);

  // 3️⃣ Fetch submitted assignments by student
  useEffect(() => {
    if (!studentId) return;

    const fetchSubmitted = async () => {
      try {
        const res = await fetch(
          `${SummaryApi.getAssignmentAnswersByStudent.url}?studentId=${studentId}`,
          {
            method: SummaryApi.getAssignmentAnswersByStudent.method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          const submittedMap = {};
          data.forEach((item) => {
            submittedMap[item.assignmentQuestionId] = true;
          });
          setSubmittedAssignments(submittedMap);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubmitted();
  }, [studentId]);

  // 4️⃣ Handle file change
  const handleFileChange = (assignmentId) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setSelectedFiles((prev) => ({
        ...prev,
        [assignmentId]: { base64, fileName: file.name },
      }));
    } catch (err) {
      console.error(err);
      setMessage("Failed to read file");
    }
  };

  // 5️⃣ Submit assignment
  const handleSubmit = (assignmentId) => async () => {
    if (!selectedFiles[assignmentId]) {
      setMessage("Please select a file to submit.");
      return;
    }

    const payload = {
      assignmentQuestionId: assignmentId,
      studentId,
      answers: [
        {
          image: selectedFiles[assignmentId].base64,
          fileName: selectedFiles[assignmentId].fileName,
        },
      ],
    };

    try {
      const res = await fetch(SummaryApi.submitAssignmentAnswer.url, {
        method: SummaryApi.submitAssignmentAnswer.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Submission successful!");
        setSelectedFiles((prev) => {
          const { [assignmentId]: _, ...rest } = prev;
          return rest;
        });
        setSubmittedAssignments((prev) => ({ ...prev, [assignmentId]: true }));
      } else {
        setMessage(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error while submitting assignment");
    }
  };

  const unsubmittedAssignments = assignments.filter(
    (a) => !submittedAssignments[a._id]
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Submit Your Assignments</h2>
      {message && <p className="text-red-600 mb-2">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : unsubmittedAssignments.length === 0 ? (
        <p>No assignments to submit.</p>
      ) : (
        unsubmittedAssignments.map((assignment) => (
          <div
            key={assignment._id}
            className="border p-4 rounded mb-4 shadow"
          >
            <h3 className="font-semibold">{assignment.assignmentName}</h3>
            <p className="text-gray-700">{assignment.assignmentQuestion}</p>
            <p className="text-sm text-gray-500">
              Course ID: {assignment.courseId} | Created:{" "}
              {new Date(assignment.createdAt).toLocaleString()}
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange(assignment._id)}
              className="mt-2"
            />

            {selectedFiles[assignment._id] && (
              <div className="mt-2">
                <p className="text-sm">Preview:</p>
                <img
                  src={selectedFiles[assignment._id].base64}
                  alt="preview"
                  className="w-48 h-auto border mt-1"
                />
              </div>
            )}

            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleSubmit(assignment._id)}
            >
              Submit Answer
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentAssignment;

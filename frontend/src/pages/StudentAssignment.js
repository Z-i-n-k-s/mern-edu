import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import SummaryApi from "../common";

const StudentAssignment = () => {
  const user = useSelector((state) => state?.user?.user);
  const studentId = user?._id || user?.id;
  const [unsubmittedAssignments, setUnsubmittedAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);
  const [submittedLoaded, setSubmittedLoaded] = useState(false);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

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
      } catch (err) {
        console.error(err);
        setMessage("Error fetching courses");
        setLoading(false);
      }
    };

    fetchStudentCourses();
  }, [studentId]);

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
        setAssignmentsLoaded(true);
        console.log('got assignments', allAssignments);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch assignments");
        setAssignmentsLoaded(true);
      }
    };

    fetchAssignments();
  }, [courses]);

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
          console.log('got submitted assignments', submittedMap);
        }
        setSubmittedLoaded(true);
      } catch (err) {
        console.error(err);
        setSubmittedLoaded(true);
      }
    };

    fetchSubmitted();
  }, [studentId]);

  // Only filter assignments once BOTH data sources are loaded
  useEffect(() => {
    if (!assignmentsLoaded || !submittedLoaded) return;

    const filtered = assignments.filter((a) => !submittedAssignments[a._id]);
    setUnsubmittedAssignments(filtered);
    setLoading(false);
    console.log('unsubmitted assignments', filtered);
  }, [assignments, submittedAssignments, assignmentsLoaded, submittedLoaded]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Assignments
          </h1>
          <p className="text-gray-600">
            Submit your assignments and track your progress
          </p>
        </div>

        {/* Alert Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.includes("successful")
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {message.includes("successful") ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <p
              className={
                message.includes("successful")
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {message}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        ) : unsubmittedAssignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-600">
              You have no pending assignments to submit.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {unsubmittedAssignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Assignment Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {assignment.assignmentName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Course ID: {assignment.courseId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(assignment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {assignment.assignmentQuestion}
                    </p>
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange(assignment._id)}
                        className="hidden"
                        id={`file-${assignment._id}`}
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload your answer
                        </p>
                        <p className="text-xs text-gray-500">
                          Supported formats: Images only
                        </p>
                      </div>
                    </label>

                    {/* File Preview */}
                    {selectedFiles[assignment._id] && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Selected File:{" "}
                          {selectedFiles[assignment._id].fileName}
                        </p>
                        <div className="flex justify-center">
                          <img
                            src={selectedFiles[assignment._id].base64}
                            alt="preview"
                            className="max-w-full h-auto rounded-lg border-2 border-gray-200 shadow-sm"
                            style={{ maxHeight: "300px" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit(assignment._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Submit Assignment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;
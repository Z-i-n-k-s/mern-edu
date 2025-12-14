import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

const StudentAssignmentFeedback = () => {
  const user = useSelector((state) => state?.user?.user);
  const studentId = user?._id || user?.id;

  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [feedbackByAnswer, setFeedbackByAnswer] = useState({});
  const [message, setMessage] = useState("");

  // 1️⃣ Fetch all submissions by this student
  useEffect(() => {
    if (!studentId) return;

    const fetchSubmissions = async () => {
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
          setSubmittedAnswers(data);
        } else {
          setMessage(data.message || "Failed to fetch submissions.");
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setMessage("Server error while fetching submissions.");
      }
    };

    fetchSubmissions();
  }, [studentId]);

  // 2️⃣ Fetch feedback for each submission
  useEffect(() => {
    if (!submittedAnswers.length) return;

    submittedAnswers.forEach(async (sub) => {
      try {
        const res = await fetch(
          `${SummaryApi.getAssignmentFeedbackByAnswer.url}?assignmentAnswerId=${sub._id}`,
          {
            method: SummaryApi.getAssignmentFeedbackByAnswer.method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();
        const fbText = Array.isArray(data) && data.length ? data[0].feedback : null;
        setFeedbackByAnswer((prev) => ({ ...prev, [sub._id]: fbText }));
      } catch (err) {
        console.error(`Error fetching feedback for ${sub._id}:`, err);
        setFeedbackByAnswer((prev) => ({ ...prev, [sub._id]: null }));
      }
    });
  }, [submittedAnswers]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Submissions & Feedback</h2>

      {message && <p className="text-red-600 mb-2">{message}</p>}

      {submittedAnswers.length === 0 ? (
        <p className="text-gray-600">You haven’t submitted any assignments yet.</p>
      ) : (
        submittedAnswers.map((sub) => (
          <div key={sub._id} className="border p-4 rounded mb-4 shadow bg-gray-50">
            {sub.answers?.[0]?.image && (
              <img
                src={sub.answers[0].image}
                alt="Your submission"
                className="w-48 h-auto mb-2 border"
              />
            )}
            <div className="feedback-box">
              <h4 className="font-semibold">Feedback:</h4>
              {feedbackByAnswer[sub._id] == null ? (
                <p className="text-gray-500 italic">No feedback yet.</p>
              ) : (
                <p>{feedbackByAnswer[sub._id]}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentAssignmentFeedback;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

const TeacherAssignmentFeedback = () => {
  const user = useSelector((state) => state?.user?.user);
  const teacherId = user?._id || user?.id;

  const [questions, setQuestions] = useState([]);
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [feedbacks, setFeedbacks] = useState({}); // { [answerId]: feedbackText }
  const [feedbacksGiven, setFeedbacksGiven] = useState({}); // { [answerId]: true }
  const [message, setMessage] = useState("");

  // 1️⃣ Fetch teacher's assignment questions
  useEffect(() => {
    if (!teacherId) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${SummaryApi.getAssignmentsByTeacher.url}?teacherId=${teacherId}`,
          {
            method: SummaryApi.getAssignmentsByTeacher.method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setQuestions(data);

          // For each question, fetch its answers
          data.forEach(async (question) => {
            try {
              const resAns = await fetch(
                `${SummaryApi.getAssignmentAnswersByQuestion.url}?assignmentQuestionId=${question._id}`,
                {
                  method: SummaryApi.getAssignmentAnswersByQuestion.method,
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                }
              );
              const ansData = await resAns.json();
              if (resAns.ok) {
                setAnswersByQuestion((prev) => ({
                  ...prev,
                  [question._id]: ansData,
                }));
              }
            } catch (err) {
              console.error("Error fetching answers:", err);
            }
          });
        }
      } catch (err) {
        console.error("Error fetching assignment questions:", err);
        setMessage("Failed to load assignment questions.");
      }
    };

    fetchQuestions();
  }, [teacherId]);

  // 2️⃣ Fetch already given feedbacks
  useEffect(() => {
    if (!teacherId) return;

    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          `${SummaryApi.getAssignmentFeedbackByTeacher.url}?teacherId=${teacherId}`,
          {
            method: SummaryApi.getAssignmentFeedbackByTeacher.method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          const map = {};
          data.forEach((fb) => {
            map[fb.assignmentAnswerId] = true;
          });
          setFeedbacksGiven(map);
        }
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };

    fetchFeedbacks();
  }, [teacherId]);

  // Handle feedback textarea change
  const handleFeedbackChange = (answerId, value) => {
    setFeedbacks((prev) => ({ ...prev, [answerId]: value }));
  };

  // Submit feedback
  const submitFeedback = async (answerId) => {
    const text = feedbacks[answerId];
    if (!text) {
      alert("Feedback cannot be empty.");
      return;
    }

    try {
      const res = await fetch(SummaryApi.submitAssignmentFeedback.url, {
        method: SummaryApi.submitAssignmentFeedback.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          assignmentAnswerId: answerId,
          teacherId,
          feedback: text,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbacksGiven((prev) => ({ ...prev, [answerId]: true }));
        setFeedbacks((prev) => ({ ...prev, [answerId]: "" }));
        alert("Feedback submitted successfully!");
      } else {
        alert(data.message || "Failed to submit feedback.");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Server error while submitting feedback.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assignment Feedback</h2>
      {message && <p className="text-red-600 mb-2">{message}</p>}

      {questions.length === 0 ? (
        <p>No assignment questions found.</p>
      ) : (
        questions.map((q) => {
          const pendingAnswers = (answersByQuestion[q._id] || []).filter(
            (ans) => !feedbacksGiven[ans._id]
          );

          return (
            <div key={q._id} className="border p-4 rounded mb-4 shadow">
              <h3 className="font-semibold">{q.assignmentName}</h3>
              <p>
                <strong>Question:</strong> {q.assignmentQuestion}
              </p>

              {pendingAnswers.length > 0 ? (
                <div className="mt-2">
                  <h4 className="font-medium mb-2">Awaiting Feedback:</h4>
                  {pendingAnswers.map((ans) => (
                    <div
                      key={ans._id}
                      className="border p-2 rounded mb-2 bg-gray-50"
                    >
                      <p>
                        <strong>Student ID:</strong> {ans.studentId}
                      </p>
                      {ans.answers?.[0]?.image && (
                        <img
                          src={ans.answers[0].image}
                          alt={`Submission by ${ans.studentId}`}
                          className="w-48 h-auto mt-1 border"
                        />
                      )}
                      <textarea
                        placeholder="Write feedback..."
                        value={feedbacks[ans._id] || ""}
                        onChange={(e) =>
                          handleFeedbackChange(ans._id, e.target.value)
                        }
                        className="w-full p-2 mt-2 border rounded"
                      />
                      <button
                        onClick={() => submitFeedback(ans._id)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 mt-2">
                  All submissions for this question have feedback.
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TeacherAssignmentFeedback;

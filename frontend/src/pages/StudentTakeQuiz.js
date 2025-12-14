import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const StudentTakeQuiz = () => {
  const user = useSelector((state) => state?.user?.user);
  const studentId = user?._id || user?.id;

  const [courses, setCourses] = useState([]);
  const [quizzesByCourse, setQuizzesByCourse] = useState({});
  const [attemptedMap, setAttemptedMap] = useState({});

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH STUDENT COURSES ================= */
  useEffect(() => {
    if (!studentId) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await fetch(SummaryApi.getStudentCourses(studentId).url, {
          method: SummaryApi.getStudentCourses(studentId).method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setCourses(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentId]);

  /* ================= FETCH QUIZZES PER COURSE ================= */
  useEffect(() => {
    if (courses.length === 0) return;

    courses.forEach(async (course) => {
      try {
        const res = await fetch(SummaryApi.getQuizzesByCourse(course._id).url, {
          method: SummaryApi.getQuizzesByCourse(course._id).method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setQuizzesByCourse((prev) => ({
            ...prev,
            [course._id]: data,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    });
  }, [courses]);

  /* ================= FETCH ATTEMPTED QUIZZES ================= */
  useEffect(() => {
    if (!studentId) return;

    const fetchAttempts = async () => {
      try {
        const res = await fetch(
          SummaryApi.getQuizAttemptsByStudent(studentId).url,
          {
            method: SummaryApi.getQuizAttemptsByStudent(studentId).method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const map = {};
        data.forEach((a) => {
          map[a.quiz] = {
            obtainedMarks: a.obtainedMarks,
            totalMarks: a.totalMarks,
          };
        });
        setAttemptedMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAttempts();
  }, [studentId]);

  /* ================= QUIZ LOGIC ================= */
  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setAnswers([]);
    setSubmitted(false);
    setScore(0);
  };

  const selectAnswer = (qi, oi) => {
    const copy = [...answers];
    copy[qi] = oi;
    setAnswers(copy);
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;

    const totalMarks = activeQuiz.questions.length;
    let obtained = 0;

    activeQuiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) obtained++;
    });

    setScore(obtained);
    setSubmitted(true);

    try {
      const res = await fetch(SummaryApi.saveQuizAttempt.url, {
        method: SummaryApi.saveQuizAttempt.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quiz: activeQuiz._id,
          student: studentId,
          answers,
          obtainedMarks: obtained,
          totalMarks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Quiz submitted");
      setAttemptedMap((prev) => ({
        ...prev,
        [activeQuiz._id]: {
          obtainedMarks: obtained,
          totalMarks,
        },
      }));
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    }
  };

  /* ================= UI ================= */
  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>

      {/* ================= QUIZ LIST ================= */}
      {!activeQuiz &&
        courses.map((course) => (
          <div key={course._id} className="mb-6 border p-3 rounded">
            <h3 className="font-semibold mb-2">
              {course.Course_Name || course.courseName}
            </h3>

            {(quizzesByCourse[course._id] || []).length === 0 ? (
              <p className="text-sm text-gray-500">No quizzes</p>
            ) : (
              quizzesByCourse[course._id].map((quiz) => (
                <div
                  key={quiz._id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{quiz.quizName}</span>

                  {attemptedMap[quiz._id] ? (
                    <span className="text-green-700 font-semibold">
                      Attempted (Score: {attemptedMap[quiz._id].obtainedMarks} /{" "}
                      {attemptedMap[quiz._id].totalMarks})
                    </span>
                  ) : (
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Take Quiz
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        ))}

      {/* ================= ACTIVE QUIZ ================= */}
      {activeQuiz && (
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-3">{activeQuiz.quizName}</h3>

          {activeQuiz.questions.map((q, qi) => (
            <div key={qi} className="mb-4">
              <p className="mb-2">
                {qi + 1}. {q.text}
              </p>

              {q.options.map((opt, oi) => (
                <label key={oi} className="block mb-1">
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    disabled={submitted}
                    checked={answers[qi] === oi}
                    onChange={() => selectAnswer(qi, oi)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={submitQuiz}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="mt-3 font-semibold">
              Score: {score} / {activeQuiz.questions.length}
            </div>
          )}

          <button
            onClick={() => setActiveQuiz(null)}
            className="ml-3 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentTakeQuiz;

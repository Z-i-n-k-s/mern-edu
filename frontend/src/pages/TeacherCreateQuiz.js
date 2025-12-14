import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const TeacherCreateQuiz = () => {
  const user = useSelector((state) => state?.user?.user);
  const teacherId = user?._id || user?.id;

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quizName, setQuizName] = useState("");
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([
    {
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    },
  ]);

  /* ================= FETCH TEACHER COURSES ================= */
  const fetchCourses = async () => {
    try {
      const res = await fetch(SummaryApi.getAllCourses.url, {
        method: SummaryApi.getAllCourses.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) throw new Error(data.message);

      const teacherCourses = data.filter(
        (c) =>
          c.instructor?.toString() === teacherId?.toString() ||
          c.instructorId?.toString() === teacherId?.toString()
      );

      setCourses(teacherCourses);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    }
  };

  useEffect(() => {
    if (teacherId) fetchCourses();
  }, [teacherId]);

  /* ================= QUESTION HANDLERS ================= */
  const handleQuestionText = (qi, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, text: value } : q))
    );
  };

  const handleOptionChange = (qi, oi, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qi) return q;
        const opts = [...q.options];
        opts[oi] = value;
        return { ...q, options: opts };
      })
    );
  };

  const handleCorrectChange = (qi, oi) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi ? { ...q, correctIndex: oi } : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { text: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);
  };

  /* ================= CREATE QUIZ ================= */
  const createQuiz = async () => {
    if (!teacherId) {
      toast.error("Teacher not loaded");
      return;
    }

    if (!quizName.trim()) {
      toast.error("Quiz name is required");
      return;
    }

    if (!selectedCourse) {
      toast.error("Select a course");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim() || q.options.some((o) => !o.trim())) {
        toast.error(`Complete all fields in question ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);

      // ✅ CORRECT SummaryApi usage
      const api = SummaryApi.createQuiz(teacherId, selectedCourse);

      const res = await fetch(api.url, {
        method: api.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: quizName,
          questions,
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) throw new Error(data.message);

      toast.success("Quiz created successfully");

      // reset
      setQuizName("");
      setSelectedCourse("");
      setQuestions([
        { text: "", options: ["", "", "", ""], correctIndex: 0 },
      ]);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Quiz</h2>

      {/* Quiz Name */}
      <div className="mb-3">
        <label className="block mb-1">Quiz Name</label>
        <input
          className="w-full border p-2"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          placeholder="Enter quiz title"
        />
      </div>

      {/* Course Select */}
      <div className="mb-4">
        <label className="block mb-1">Select Course</label>
        <select
          className="w-full border p-2"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.Course_Name || c.courseName}
            </option>
          ))}
        </select>
      </div>

      {/* QUESTIONS */}
      {questions.map((q, qi) => (
        <div key={qi} className="border p-3 mb-4 rounded">
          <p className="font-semibold mb-2">Question {qi + 1}</p>

          <input
            className="w-full border p-2 mb-3"
            placeholder="Question text"
            value={q.text}
            onChange={(e) =>
              handleQuestionText(qi, e.target.value)
            }
          />

          {q.options.map((opt, oi) => (
            <div key={oi} className="flex items-center mb-2 gap-2">
              <input
                type="radio"
                name={`correct-${qi}`}
                checked={q.correctIndex === oi}
                onChange={() => handleCorrectChange(qi, oi)}
              />
              <input
                className="flex-1 border p-2"
                placeholder={`Option ${oi + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(qi, oi, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      ))}

      {/* BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Add Question
        </button>

        <button
          onClick={createQuiz}
          disabled={loading || !teacherId}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Creating..." : "Create Quiz"}
        </button>
      </div>
    </div>
  );
};

export default TeacherCreateQuiz;

import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { useSelector } from "react-redux";

const CreateLiveClassModal = ({ onClose, onSuccess }) => {
  const user = useSelector((state) => state?.user?.user);
  const teacherId = user?._id || user?.id;

  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    startTime: "",
    durationMinutes: "",
    platform: "google-meet",
    meetingLink: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch(SummaryApi.getAllCourses.url);
      const data = await res.json();
      setCourses(
        data.filter(c => c.instructorId === teacherId)
      );
    };
    fetchCourses();
  }, [teacherId]);

  const handleSubmit = async () => {
    console.log(form)
    try {
      await fetch(SummaryApi.createLiveClass.url, {
        method: SummaryApi.createLiveClass.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-4 w-96 rounded">
        <h3 className="font-bold mb-2">Create Live Class</h3>

        <select
          className="w-full mb-2 border"
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
        >
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.Course_Name}</option>
          ))}
        </select>

        <input placeholder="Title" className="w-full mb-2 border"
          onChange={e => setForm({ ...form, title: e.target.value })} />

        <input type="datetime-local" className="w-full mb-2 border"
          onChange={e => setForm({ ...form, startTime: e.target.value })} />

        <input placeholder="Duration (minutes)" className="w-full mb-2 border"
          onChange={e => setForm({ ...form, durationMinutes: e.target.value })} />

        <input placeholder="Meeting Link" className="w-full mb-2 border"
          onChange={e => setForm({ ...form, meetingLink: e.target.value })} />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLiveClassModal;

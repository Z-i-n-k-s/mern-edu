import React, { useState } from "react";
import SummaryApi from "../common";

const EditLiveClassModal = ({ liveClass, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: liveClass.title,
    startTime: liveClass.startTime.slice(0, 16),
    durationMinutes: liveClass.durationMinutes,
  });

  const handleUpdate = async () => {
    try {
      await fetch(
        SummaryApi.updateLiveClass(liveClass._id).url,
        {
          method: SummaryApi.updateLiveClass(liveClass._id).method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-4 w-96 rounded">
        <h3 className="font-bold mb-2">Edit Live Class</h3>

        <input className="w-full mb-2 border"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />

        <input type="datetime-local" className="w-full mb-2 border"
          value={form.startTime}
          onChange={e => setForm({ ...form, startTime: e.target.value })} />

        <input className="w-full mb-2 border"
          value={form.durationMinutes}
          onChange={e => setForm({ ...form, durationMinutes: e.target.value })} />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleUpdate} className="bg-green-600 text-white px-3 py-1">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLiveClassModal;

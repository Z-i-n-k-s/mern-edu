import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import CreateLiveClassModal from "../components/CreateLiveClassModal";
import EditLiveClassModal from "../components/EditLiveClassModal";

const TeacherCreateLiveClass = () => {
  const user = useSelector((state) => state?.user?.user);
  const teacherId = user?._id || user?.id;

  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Fetch teacher live class history
  const fetchLiveClasses = async () => {
    try {
      const res = await fetch(
        SummaryApi.teacherLiveClassHistory.url,
        {
          method: SummaryApi.teacherLiveClassHistory.method,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setLiveClasses(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load live classes", err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel live class
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this live class?")) return;

    try {
      await fetch(
        SummaryApi.cancelLiveClass(id).url,
        {
          method: SummaryApi.cancelLiveClass(id).method,
          credentials: "include",
        }
      );
      fetchLiveClasses();
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  useEffect(() => {
    if (teacherId) fetchLiveClasses();
  }, [teacherId]);

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Live Classes</h2>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create Live Class
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : liveClasses.length === 0 ? (
          <p>No live classes created yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-2">Title</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {liveClasses.map((cls) => {
                const isCancelled = cls.status === "cancelled";

                return (
                  <tr key={cls._id} className="border-t text-center">
                    <td className="p-2">{cls.title}</td>
                    <td>{new Date(cls.startTime).toLocaleString()}</td>
                    <td>{cls.durationMinutes} min</td>
                    <td
                      className={
                        isCancelled ? "text-red-600 font-semibold" : ""
                      }
                    >
                      {cls.status}
                    </td>

                    <td className="space-x-2">
                      {!isCancelled && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedClass(cls);
                              setOpenEditModal(true);
                            }}
                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleCancel(cls._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {isCancelled && (
                        <span className="text-gray-400 italic">
                          No actions available
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {openCreateModal && (
        <CreateLiveClassModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={fetchLiveClasses}
        />
      )}

      {openEditModal && selectedClass && (
        <EditLiveClassModal
          liveClass={selectedClass}
          onClose={() => setOpenEditModal(false)}
          onSuccess={fetchLiveClasses}
        />
      )}
    </>
  );
};

export default TeacherCreateLiveClass;

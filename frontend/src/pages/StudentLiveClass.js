import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

const StudentLiveClass = () => {
  const user = useSelector((state) => state?.user?.user);
  const studentId = user?._id || user?.id;

  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Ensure meeting link is always valid
  const getValidMeetingLink = (link) => {
    if (!link) return null;
    if (link.startsWith("http://") || link.startsWith("https://")) {
      return link;
    }
    return `https://${link}`;
  };

  const fetchLiveClasses = async () => {
    try {
      const res = await fetch(
        SummaryApi.studentAllLiveClasses.url,
        {
          method: SummaryApi.studentAllLiveClasses.method,
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

  useEffect(() => {
    if (studentId) fetchLiveClasses();
  }, [studentId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Live Classes</h2>

      {loading ? (
        <p>Loading live classes...</p>
      ) : liveClasses.length === 0 ? (
        <p>No live classes available right now.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-2">Title</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {liveClasses.map((cls) => {
              const isLive = cls.status === "live";
              const isUpcoming = cls.status === "scheduled";
              const canJoin =
                (isLive || isUpcoming) &&
                cls.status !== "cancelled" &&
                cls.meetingLink;

              return (
                <tr key={cls._id} className="border-t text-center">
                  <td className="p-2">{cls.title}</td>

                  <td>
                    {new Date(cls.startTime).toLocaleString()}
                  </td>

                  <td>{cls.durationMinutes} min</td>

                  <td
                    className={
                      cls.status === "live"
                        ? "text-green-600 font-semibold"
                        : cls.status === "scheduled"
                        ? "text-blue-600"
                        : cls.status === "cancelled"
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {cls.status}
                  </td>

                  <td>
                    {canJoin ? (
                      <a
                        href={getValidMeetingLink(cls.meetingLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white rounded inline-block"
                      >
                        Join
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">
                        Not available
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
  );
};

export default StudentLiveClass;

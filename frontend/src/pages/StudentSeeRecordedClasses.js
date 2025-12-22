import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Play, Clock, Calendar, BookOpen, Video } from "lucide-react";
import SummaryApi from "../common";

const StudentSeeRecordedClasses = () => {
  const user = useSelector((state) => state?.user?.user);
  const studentId = user?._id || user?.id;

  const [courses, setCourses] = useState([]);
  const [recordedClasses, setRecordedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1️⃣ Fetch courses enrolled by student
        const courseRes = await fetch(
          SummaryApi.getStudentCourses(studentId).url,
          {
            method: SummaryApi.getStudentCourses(studentId).method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const courseData = await courseRes.json();
        if (!courseRes.ok) throw new Error(courseData.message || "Failed to fetch courses");

        setCourses(courseData);

        // 2️⃣ Fetch all recorded classes
        const recRes = await fetch(SummaryApi.getRecordedClasses.url, {
          method: SummaryApi.getRecordedClasses.method,
          credentials: "include",
        });
        const recData = await recRes.json();
        if (!recRes.ok) throw new Error(recData.message || "Failed to fetch recordings");

        setRecordedClasses(recData.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-red-100">
          <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Oops! Something went wrong</h2>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Recorded Classes</h1>
          </div>
          <p className="text-gray-600 ml-16">Access your course recordings anytime, anywhere</p>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Courses Yet</h2>
            <p className="text-gray-600">You are not enrolled in any courses. Start exploring to begin your learning journey!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => {
              const courseRecordings = recordedClasses.filter(
                (rec) => String(rec.courseId) === String(course._id)
              );

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {course.Course_Name}
                        </h2>
                        <div className="flex items-center gap-4 text-indigo-100">
                          <span className="flex items-center gap-1.5 text-sm font-medium">
                            <BookOpen className="w-4 h-4" />
                            {course.Course_Initial}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm font-medium">
                            <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></span>
                            {course.Credit} Credit
                          </span>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="text-white text-sm font-semibold">
                          {courseRecordings.length} Recording{courseRecordings.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recordings List */}
                  <div className="p-6">
                    {courseRecordings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No recorded classes available yet</p>
                        <p className="text-gray-400 text-sm mt-1">Check back later for new recordings</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {courseRecordings.map((rec) => (
                          <a
                            key={rec._id}
                            href={rec.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-gray-200 hover:border-indigo-300 hover:shadow-md"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:bg-indigo-600 transition-colors duration-300">
                                <Play className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                              </div>
                            </div>
                            
                            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {rec.title}
                            </h3>
                            
                            {rec.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {rec.description}
                              </p>
                            )}
                            
                            <div className="flex flex-col gap-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{rec.duration} minutes</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                                Watch Now →
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSeeRecordedClasses;
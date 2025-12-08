import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  TrendingUp,
  Calendar,
  Clock,
  Award,
  FileText,
  Video,
  Bell,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';

const TeacherDashboard = () => {
  const [stats] = useState({
    totalCourses: 8,
    activeStudents: 247,
    pendingAssignments: 23,
    avgRating: 4.7
  });

  const [recentActivity] = useState([
    { id: 1, type: 'submission', student: 'Sarah Ahmed', course: 'Web Development', time: '5 min ago', status: 'pending' },
    { id: 2, type: 'question', student: 'John Doe', course: 'Data Structures', time: '15 min ago', status: 'new' },
    { id: 3, type: 'completion', student: 'Emma Wilson', course: 'React Basics', time: '1 hour ago', status: 'completed' },
    { id: 4, type: 'submission', student: 'Michael Brown', course: 'Python Programming', time: '2 hours ago', status: 'pending' }
  ]);

  const [upcomingClasses] = useState([
    { id: 1, title: 'Advanced JavaScript', time: 'Today, 2:00 PM', students: 45, platform: 'Zoom' },
    { id: 2, title: 'React Hooks Deep Dive', time: 'Tomorrow, 10:00 AM', students: 38, platform: 'Google Meet' },
    { id: 3, title: 'Database Design', time: 'Dec 10, 3:00 PM', students: 52, platform: 'Zoom' }
  ]);

  const [topCourses] = useState([
    { name: 'Web Development Bootcamp', students: 89, completion: 78, rating: 4.8 },
    { name: 'Data Structures & Algorithms', students: 67, completion: 65, rating: 4.6 },
    { name: 'React Masterclass', students: 54, completion: 82, rating: 4.9 },
    { name: 'Python for Beginners', students: 37, completion: 71, rating: 4.5 }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome back, Professor! 👋</h1>
        <p className="text-slate-600">Here's what's happening with your courses today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+2 this month</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.totalCourses}</h3>
          <p className="text-slate-600 text-sm">Total Courses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="text-purple-600" size={24} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+18 today</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.activeStudents}</h3>
          <p className="text-slate-600 text-sm">Active Students</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <ClipboardCheck className="text-orange-600" size={24} />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Needs review</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.pendingAssignments}</h3>
          <p className="text-slate-600 text-sm">Pending Submissions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Award className="text-amber-600" size={24} />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">★ Excellent</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.avgRating}</h3>
          <p className="text-slate-600 text-sm">Average Rating</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Upcoming Classes</h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
              <Plus size={16} />
              Schedule Class
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow duration-200 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Video className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{classItem.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {classItem.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {classItem.students} students
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white text-indigo-600 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-sm font-medium">
                  Join {classItem.platform}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <Plus size={20} />
                <span className="font-medium">Create New Course</span>
              </div>
              <ArrowUpRight size={18} />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <FileText size={20} />
                <span className="font-medium">New Assignment</span>
              </div>
              <ArrowUpRight size={18} />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <ClipboardCheck size={20} />
                <span className="font-medium">Create Quiz</span>
              </div>
              <ArrowUpRight size={18} />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} />
                <span className="font-medium">View Analytics</span>
              </div>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="text-green-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'pending' ? 'bg-orange-100' :
                  activity.status === 'new' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  {activity.status === 'pending' && <AlertCircle className="text-orange-600" size={18} />}
                  {activity.status === 'new' && <FileText className="text-blue-600" size={18} />}
                  {activity.status === 'completed' && <CheckCircle className="text-green-600" size={18} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 mb-1">
                    <span className="text-indigo-600">{activity.student}</span>
                    {activity.type === 'submission' && ' submitted an assignment'}
                    {activity.type === 'question' && ' asked a question'}
                    {activity.type === 'completion' && ' completed a course'}
                  </p>
                  <p className="text-xs text-slate-600">{activity.course} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="text-amber-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Top Courses</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">{course.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Award size={14} />
                    <span className="text-sm font-semibold">{course.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={14} />
                    {course.students} students
                  </span>
                  <span>{course.completion}% completion</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${course.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
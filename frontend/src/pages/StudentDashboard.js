import React, { useState } from 'react';
import { 
  BookOpen, 
  TrendingUp,
  Clock,
  Award,
  Target,
  Calendar,
  Play,
  CheckCircle,
  Star,
  ArrowRight,
  Video,
  FileText,
  Users,
  Trophy,
  Zap,
  BookMarked,
  GraduationCap,
  BarChart3,
  Brain,
  Flame
} from 'lucide-react';

const StudentDashboard = () => {
  const [stats] = useState({
    enrolledCourses: 5,
    completedCourses: 12,
    learningHours: 47,
    averageScore: 87
  });

  const [enrolledCourses] = useState([
    { 
      id: 1, 
      title: 'Web Development Bootcamp', 
      instructor: 'Prof. Sarah Ahmed',
      progress: 65, 
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      nextLesson: 'React Hooks Deep Dive',
      totalLessons: 48,
      completedLessons: 31,
      category: 'Web Development',
      deadline: '2 days left'
    },
    { 
      id: 2, 
      title: 'Data Structures & Algorithms', 
      instructor: 'Dr. Michael Chen',
      progress: 42, 
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
      nextLesson: 'Binary Search Trees',
      totalLessons: 35,
      completedLessons: 15,
      category: 'Computer Science',
      deadline: '5 days left'
    },
    { 
      id: 3, 
      title: 'Python for Data Science', 
      instructor: 'Prof. Emma Wilson',
      progress: 88, 
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
      nextLesson: 'Machine Learning Basics',
      totalLessons: 30,
      completedLessons: 26,
      category: 'Data Science',
      deadline: '1 week left'
    }
  ]);

  const [upcomingClasses] = useState([
    { 
      id: 1, 
      title: 'Live Q&A Session', 
      course: 'Web Development',
      instructor: 'Prof. Sarah Ahmed',
      time: 'Today, 3:00 PM', 
      duration: '1 hour',
      type: 'live'
    },
    { 
      id: 2, 
      title: 'Algorithm Workshop', 
      course: 'Data Structures',
      instructor: 'Dr. Michael Chen',
      time: 'Tomorrow, 10:00 AM', 
      duration: '2 hours',
      type: 'live'
    },
    { 
      id: 3, 
      title: 'Project Review', 
      course: 'Python Programming',
      instructor: 'Prof. Emma Wilson',
      time: 'Dec 10, 2:00 PM', 
      duration: '1.5 hours',
      type: 'recorded'
    }
  ]);

  const [recentActivity] = useState([
    { id: 1, type: 'completed', course: 'Web Development', item: 'React Fundamentals Quiz', score: 92, time: '2 hours ago' },
    { id: 2, type: 'submitted', course: 'Data Structures', item: 'Binary Tree Assignment', time: '5 hours ago' },
    { id: 3, type: 'earned', course: 'Python Programming', item: 'Course Completion Certificate', time: '1 day ago' },
    { id: 4, type: 'started', course: 'Web Development', item: 'Advanced JavaScript Module', time: '2 days ago' }
  ]);

  const [achievements] = useState([
    { title: 'Fast Learner', description: 'Completed 5 courses in a month', icon: <Zap className="text-yellow-500" size={24} />, earned: true },
    { title: 'Perfect Score', description: 'Scored 100% in 3 quizzes', icon: <Trophy className="text-amber-500" size={24} />, earned: true },
    { title: 'Streak Master', description: '30-day learning streak', icon: <Flame className="text-orange-500" size={24} />, earned: false },
    { title: 'Team Player', description: 'Helped 10 fellow students', icon: <Users className="text-blue-500" size={24} />, earned: false }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome back, Student! 🎓</h1>
        <p className="text-slate-600">Continue your learning journey today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BookOpen className="text-purple-600" size={24} />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.enrolledCourses}</h3>
          <p className="text-slate-600 text-sm">Enrolled Courses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+3 this month</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.completedCourses}</h3>
          <p className="text-slate-600 text-sm">Completed Courses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="text-blue-600" size={24} />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">This week</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.learningHours}h</h3>
          <p className="text-slate-600 text-sm">Learning Hours</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <TrendingUp className="text-amber-600" size={24} />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">★ Excellent</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.averageScore}%</h3>
          <p className="text-slate-600 text-sm">Average Score</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Continue Learning Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Play className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-200 border border-slate-100">
                <div className="relative w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
                    {course.category}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 mb-1 truncate">{course.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">by {course.instructor}</p>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      <span className="font-semibold text-purple-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={14} />
                      <span>{course.deadline}</span>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium flex items-center gap-2">
                      <Play size={14} />
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Upcoming Classes</h2>
          </div>
          
          <div className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {classItem.type === 'live' ? (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    ) : (
                      <Video size={14} className="text-slate-400" />
                    )}
                    <span className="text-xs font-semibold text-blue-600">{classItem.type === 'live' ? 'LIVE' : 'RECORDED'}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{classItem.title}</h3>
                <p className="text-xs text-slate-600 mb-2">{classItem.course}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {classItem.time}
                  </span>
                  <span>{classItem.duration}</span>
                </div>
                <button className="w-full mt-3 px-3 py-2 bg-white text-blue-600 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium">
                  {classItem.type === 'live' ? 'Join Class' : 'Watch Recording'}
                </button>
              </div>
            ))}
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
                <BarChart3 className="text-green-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'completed' ? 'bg-green-100' :
                  activity.type === 'submitted' ? 'bg-blue-100' :
                  activity.type === 'earned' ? 'bg-amber-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'completed' && <CheckCircle className="text-green-600" size={18} />}
                  {activity.type === 'submitted' && <FileText className="text-blue-600" size={18} />}
                  {activity.type === 'earned' && <Award className="text-amber-600" size={18} />}
                  {activity.type === 'started' && <Play className="text-purple-600" size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 mb-1 truncate">
                    {activity.type === 'completed' && 'Completed: '}
                    {activity.type === 'submitted' && 'Submitted: '}
                    {activity.type === 'earned' && 'Earned: '}
                    {activity.type === 'started' && 'Started: '}
                    <span className="text-purple-600">{activity.item}</span>
                  </p>
                  <p className="text-xs text-slate-600">{activity.course} • {activity.time}</p>
                  {activity.score && (
                    <div className="mt-1">
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Score: {activity.score}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Trophy className="text-amber-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Achievements</h2>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  achievement.earned 
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:shadow-md' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    achievement.earned ? 'bg-white shadow-lg' : 'bg-slate-200'
                  }`}>
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">{achievement.title}</h3>
                  <p className="text-xs text-slate-600">{achievement.description}</p>
                  {achievement.earned && (
                    <div className="mt-2">
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
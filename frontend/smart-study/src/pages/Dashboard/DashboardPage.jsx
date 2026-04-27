import { useEffect, useState } from "react";
import Spinner from "../../components/common/Spinner.jsx";
import progressService from "../../services/progressService.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  FileText,
  BookOpen,
  BrainCircuit,
  Clock,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await progressService.getDashboardData();
        console.log("Dashboard API Response:", response);

        // Safe data handling
        setDashboardData(response?.data || {});
      } catch (error) {
        toast.error(error.message || "Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading State
  if (loading) return <Spinner />;

  // Safety fallback
  if (!dashboardData) {
    return (
      <p className="text-center mt-10 text-slate-500">
        No data available
      </p>
    );
  }

  // Stats Data
  const stats = [
    {
      label: "Total Documents",
      value: dashboardData?.overview?.totalDocuments || 0,
      icon: FileText,
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      label: "Total Flashcards",
      value: dashboardData?.overview?.totalFlashcards || 0,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
    },
    {
      label: "Total Quizzes",
      value: dashboardData?.overview?.totalQuizzes || 0,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-500",
    },
  ];

  // Activity Data
  const activities = [
    ...(dashboardData?.recentActivity?.documents || []).map((doc) => ({
      id: doc._id,
      description: doc.title,
      timestamp: doc.lastAccessed || doc.createdAt,
      link: `/documents/${doc._id}`,
      type: "document",
    })),

    ...(dashboardData?.recentActivity?.quizzes || []).map((quiz) => ({
      id: quiz._id,
      description: quiz.title,
      timestamp: quiz.completedAt || quiz.createdAt,
      link: `/quizzes/${quiz._id}`,
      type: "quiz",
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm">
            Track your learning progress and activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  {stat.label}
                </span>

                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="text-3xl font-semibold text-slate-900">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-slate-600" />
            <h3 className="text-xl font-medium text-slate-900">
              Recent Activity
            </h3>
          </div>

          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {activity.type === "document"
                        ? "Accessed Document:"
                        : "Attempted Quiz:"}{" "}
                      {activity.description}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {activity.link && (
                    <Link
                      to={activity.link}
                      className="px-4 py-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                    >
                      View
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Empty State (matches screenshot)
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>

              <p className="text-sm text-slate-600 font-medium">
                No recent activity yet.
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Start learning to see your progress here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
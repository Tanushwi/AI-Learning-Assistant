import { useEffect, useState } from "react";

import progressService from "../../services/progressService";
import flashcardService from "../../services/flashcardService";
import authService from "../../services/authService";

import {
  FileText,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  Trophy,
  TrendingUp,
  Clock3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Link } from "react-router-dom";

const DashboardPage = () => {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [flashcards, setFlashcards] =
    useState([]);

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const dashboardRes =
          await progressService.getDashboardData();

        const flashcardRes =
          await flashcardService.getAllFlashcardSets();

        const activityRes =
          await authService.getActivities();

        setDashboardData(
          dashboardRes.data
        );

        setFlashcards(
          flashcardRes.data || []
        );

        setActivities(
          activityRes.data || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-2xl font-bold text-emerald-500">

          Loading Dashboard...

        </div>

      </div>
    );
  }

  const overview =
    dashboardData?.overview || {};

  // =====================================================
  // CHART DATA
  // =====================================================

  const quizData = [
    { day: "Mon", quizzes: 2 },
    { day: "Tue", quizzes: 4 },
    { day: "Wed", quizzes: 3 },
    { day: "Thu", quizzes: 5 },
    { day: "Fri", quizzes: 6 },
    { day: "Sat", quizzes: 4 },
    { day: "Sun", quizzes: 7 },
  ];

  const flashcardPieData = [

    {
      name: "Reviewed",

      value:
        overview.reviewedFlashcards || 0,
    },

    {
      name: "Remaining",

      value: Math.max(
        (
          overview.totalFlashcardSets || 0
        ) * 10 -
          (
            overview.reviewedFlashcards || 0
          ),
        0
      ),
    },
  ];

  const COLORS = [
    "#10B981",
    "#E5E7EB",
  ];

  return (

    <div className="max-w-7xl mx-auto px-2 md:px-4 pb-14">

      {/* HERO */}

      <div
        className="
        bg-gradient-to-r
        from-emerald-500
        to-teal-500
        rounded-[32px]
        p-8
        text-white
        mb-10
        shadow-lg
        "
      >

        <div
          className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-8
          "
        >

          <div>

            <div
              className="
              flex
              items-center
              gap-3
              mb-4
              "
            >

              <Sparkles size={28} />

              <p
                className="
                text-lg
                font-semibold
                "
              >
                Smart Study AI
              </p>

            </div>

            <h1
              className="
              text-4xl
              md:text-5xl
              font-black
              leading-tight
              "
            >
              Keep Learning <br />
              Every Day 🚀
            </h1>

            <p
              className="
              text-emerald-50
              mt-4
              text-lg
              max-w-2xl
              "
            >
              Track your study progress,
              quizzes, flashcards and
              documents from one powerful
              dashboard.
            </p>

          </div>

          <div
            className="
            bg-white/10
            backdrop-blur-md
            rounded-3xl
            p-6
            border
            border-white/20
            min-w-[260px]
            "
          >

            <div
              className="
              flex
              items-center
              gap-3
              mb-5
              "
            >

              <TrendingUp size={24} />

              <h3
                className="
                text-xl
                font-bold
                "
              >
                Productivity
              </h3>

            </div>

            <div className="space-y-4">

              <div>

                <div
                  className="
                  flex
                  justify-between
                  text-sm
                  mb-1
                  "
                >

                  <span>Flashcards</span>

                  <span>
                    {
                      overview.totalFlashcardSets || 0
                    }
                  </span>

                </div>

                <div
                  className="
                  h-2
                  bg-white/20
                  rounded-full
                  "
                >

                  <div
                    className="
                    h-full
                    bg-white
                    rounded-full
                    w-[85%]
                    "
                  />

                </div>

              </div>

              <div>

                <div
                  className="
                  flex
                  justify-between
                  text-sm
                  mb-1
                  "
                >

                  <span>Quizzes</span>

                  <span>
                    {
                      overview.completedQuizzes || 0
                    }
                  </span>

                </div>

                <div
                  className="
                  h-2
                  bg-white/20
                  rounded-full
                  "
                >

                  <div
                    className="
                    h-full
                    bg-white
                    rounded-full
                    w-[70%]
                    "
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10
        "
      >

        {/* DOCUMENTS */}

        <div
          className="
          bg-white
          rounded-3xl
          p-6
          border
          shadow-sm
          "
        >

          <div
            className="
            flex
            items-center
            justify-between
            "
          >

            <div>

              <p className="text-gray-500">
                Total Documents
              </p>

              <h2
                className="
                text-5xl
                font-black
                mt-3
                "
              >
                {
                  overview.totalDocuments || 0
                }
              </h2>

            </div>

            <div
              className="
              w-16
              h-16
              rounded-3xl
              bg-blue-500
              flex
              items-center
              justify-center
              "
            >

              <FileText
                className="text-white"
                size={28}
              />

            </div>

          </div>

        </div>

        {/* FLASHCARDS */}

        <div
          className="
          bg-white
          rounded-3xl
          p-6
          border
          shadow-sm
          "
        >

          <div
            className="
            flex
            items-center
            justify-between
            "
          >

            <div>

              <p className="text-gray-500">
                Flashcard Sets
              </p>

              <h2
                className="
                text-5xl
                font-black
                mt-3
                "
              >
                {
                  overview.totalFlashcardSets || 0
                }
              </h2>

            </div>

            <div
              className="
              w-16
              h-16
              rounded-3xl
              bg-pink-500
              flex
              items-center
              justify-center
              "
            >

              <BookOpen
                className="text-white"
                size={28}
              />

            </div>

          </div>

        </div>

        {/* REVIEWED */}

        <div
          className="
          bg-white
          rounded-3xl
          p-6
          border
          shadow-sm
          "
        >

          <div
            className="
            flex
            items-center
            justify-between
            "
          >

            <div>

              <p className="text-gray-500">
                Reviewed Cards
              </p>

              <h2
                className="
                text-5xl
                font-black
                mt-3
                "
              >
                {
                  overview.reviewedFlashcards || 0
                }
              </h2>

            </div>

            <div
              className="
              w-16
              h-16
              rounded-3xl
              bg-emerald-500
              flex
              items-center
              justify-center
              "
            >

              <CheckCircle2
                className="text-white"
                size={28}
              />

            </div>

          </div>

        </div>

        {/* QUIZZES */}

        <div
          className="
          bg-white
          rounded-3xl
          p-6
          border
          shadow-sm
          "
        >

          <div
            className="
            flex
            items-center
            justify-between
            "
          >

            <div>

              <p className="text-gray-500">
                Completed Quizzes
              </p>

              <h2
                className="
                text-5xl
                font-black
                mt-3
                "
              >
                {
                  overview.completedQuizzes || 0
                }
              </h2>

            </div>

            <div
              className="
              w-16
              h-16
              rounded-3xl
              bg-orange-500
              flex
              items-center
              justify-center
              "
            >

              <BrainCircuit
                className="text-white"
                size={28}
              />

            </div>

          </div>

        </div>

      </div>

      {/* CHARTS */}

      <div className="mb-10">

        <h2
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          Analytics Overview
        </h2>

        <div
          className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          "
        >

          {/* LINE CHART */}

          <div
            className="
            bg-white
            rounded-3xl
            border
            p-6
            shadow-sm
            "
          >

            <div className="mb-6">

              <h3
                className="
                text-2xl
                font-bold
                "
              >
                Weekly Quiz Activity
              </h3>

              <p className="text-gray-500">
                Learning consistency
              </p>

            </div>

            <div className="h-[300px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={quizData}>

                  <XAxis dataKey="day" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="quizzes"
                    stroke="#10B981"
                    strokeWidth={4}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* PIE CHART */}

          <div
            className="
            bg-white
            rounded-3xl
            border
            p-6
            shadow-sm
            "
          >

            <div className="mb-6">

              <h3
                className="
                text-2xl
                font-bold
                "
              >
                Flashcard Progress
              </h3>

              <p className="text-gray-500">
                Reviewed vs Remaining
              </p>

            </div>

            <div className="h-[300px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={
                      flashcardPieData
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                  >

                    {flashcardPieData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[index]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
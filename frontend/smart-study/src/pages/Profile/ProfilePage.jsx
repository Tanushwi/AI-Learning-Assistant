import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import authService from "../../services/authService";

const ProfilePage = () => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    activities,
    setActivities,
  ] = useState([]);

  // =========================================
  // PASSWORD RESET
  // =========================================

  const handlePasswordReset =
    async () => {

      try {

        if (
          !currentPassword ||
          !newPassword ||
          !confirmPassword
        ) {

          alert(
            "Please fill all fields"
          );

          return;
        }

        if (
          newPassword !==
          confirmPassword
        ) {

          alert(
            "Passwords do not match"
          );

          return;
        }

        const response =
          await authService.changePassword({

            currentPassword,

            newPassword,
          });

        if (
          response.success
        ) {

          alert(
            "Password changed successfully"
          );

          setCurrentPassword("");

          setNewPassword("");

          setConfirmPassword("");

          fetchActivities();
        }

      } catch (error) {

        alert(
          error.message ||
          "Failed to change password"
        );
      }
    };

  // =========================================
  // FETCH PROFILE
  // =========================================

  const fetchProfile =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {

          setError(
            "User not logged in"
          );

          setLoading(false);

          return;
        }

        const response =
          await axios.get(

            "http://localhost:8000/api/auth/me",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          response.data.success
        ) {

          setUser(
            response.data.user
          );

        } else {

          setError(
            "Failed to load profile"
          );
        }

      } catch (error) {

        console.log(
          "PROFILE ERROR:",
          error
        );

        setError(
          "Failed to load profile"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================================
  // FETCH ACTIVITIES
  // =========================================

  const fetchActivities =
    async () => {

      try {

        const response =
          await authService.getActivities();

        if (
          response.success
        ) {

          setActivities(
            response.data
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  // =========================================
  // USE EFFECT
  // =========================================

  useEffect(() => {

    fetchProfile();

    fetchActivities();

  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="flex items-center justify-center h-screen bg-gray-50">

        <div className="text-2xl font-semibold text-emerald-500">

          Loading Profile...

        </div>

      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <div className="flex items-center justify-center h-screen bg-gray-50">

        <div className="bg-white p-8 rounded-3xl shadow border text-center">

          <h2 className="text-2xl font-bold text-red-500">

            {error}

          </h2>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* PROFILE HEADER */}

        <div className="bg-white rounded-3xl shadow-sm border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-5">

            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center text-4xl font-bold shadow">

              {
                user?.username
                  ?.charAt(0)
                  ?.toUpperCase()
              }

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-800">

                {user?.username}

              </h1>

              <p className="text-gray-500 mt-1">

                {user?.email}

              </p>

              <p className="text-sm text-gray-400 mt-2">

                Welcome to Smart Study 🚀

              </p>

            </div>

          </div>

          <button className="bg-emerald-500 hover:bg-emerald-600 transition-all text-white px-6 py-3 rounded-2xl font-medium shadow">

            Active User

          </button>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <p className="text-sm text-gray-500 font-medium">

              Total Documents

            </p>

            <h2 className="text-4xl font-bold mt-3 text-blue-500">

              {user?.documentsCount || 0}

            </h2>

          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <p className="text-sm text-gray-500 font-medium">

              Flashcard Sets

            </p>

            <h2 className="text-4xl font-bold mt-3 text-pink-500">

              {user?.flashcardsCount || 0}

            </h2>

          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <p className="text-sm text-gray-500 font-medium">

              Quizzes Sets

            </p>

            <h2 className="text-4xl font-bold mt-3 text-cyan-500">

              {user?.quizCount || 0}

            </h2>

          </div>

        </div>

        {/* PROFILE INFO + SECURITY */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PROFILE INFO */}

          <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-5">

            <h2 className="text-2xl font-bold text-gray-800">

              Profile Information

            </h2>

            <div>

              <label className="text-sm text-gray-500 font-medium">

                Username

              </label>

              <input
                type="text"
                value={user?.username || ""}
                readOnly
                className="w-full mt-2 border rounded-2xl px-4 py-3 outline-none bg-gray-50"
              />

            </div>

            <div>

              <label className="text-sm text-gray-500 font-medium">

                Email Address

              </label>

              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full mt-2 border rounded-2xl px-4 py-3 outline-none bg-gray-50"
              />

            </div>

          </div>

          {/* SECURITY */}

          <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-5">

            <h2 className="text-2xl font-bold text-gray-800">

              Security Settings

            </h2>

            <div>

              <label className="text-sm text-gray-500 font-medium">

                Current Password

              </label>

              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                className="w-full mt-2 border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
              />

            </div>

            <div>

              <label className="text-sm text-gray-500 font-medium">

                New Password

              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full mt-2 border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
              />

            </div>

            <div>

              <label className="text-sm text-gray-500 font-medium">

                Confirm Password

              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full mt-2 border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
              />

            </div>

            <button
              onClick={
                handlePasswordReset
              }
              className="bg-black hover:bg-gray-800 transition-all text-white px-6 py-3 rounded-2xl font-medium shadow"
            >

              Reset Password

            </button>

          </div>

        </div>

        {/* RECENT ACTIVITY */}

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-gray-800">

              Recent Activity

            </h2>

          </div>

          <div className="space-y-4">

            {activities.length === 0 ? (

              <div className="border rounded-2xl p-4">

                <p className="text-gray-500">

                  No recent activities found

                </p>

              </div>

            ) : (

              activities.map(
                (activity) => (

                  <div
                    key={activity._id}
                    className="border rounded-2xl p-4 hover:bg-gray-50 transition-all"
                  >

                    <p className="font-medium text-gray-800">

                      {activity.message}

                    </p>

                    <p className="text-sm text-gray-400 mt-1">

                      {
                        new Date(
                          activity.createdAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
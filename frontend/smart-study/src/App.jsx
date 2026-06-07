import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import DashboardPage from "./pages/Dashboard/DashboardPage";

import FlashcardPage from "./pages/Flashcards/FlashcardPage";

import FlashcardListPage from "./pages/Flashcards/FlashcardListPage";

import DocumentDetailPage from "./pages/Documents/DocumentDetailPage";

import DocumentListPage from "./pages/Documents/DocumentListPage";

import QuizTakePage from "./pages/Quizzes/QuizTakePage";

import QuizResultPage from "./pages/Quizzes/QuizResultPage";

import ProfilePage from "./pages/Profile/ProfilePage";

import FlashcardView from "./pages/Flashcards/FlashcardView";

import { useAuth } from "./context/AuthContext";

const App = () => {

  const {
    isAuthenticated,
    loading,
  } = useAuth();

  console.log(
    "🔄 App Render - Loading:",
    loading,
    "Authenticated:",
    isAuthenticated
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    console.log(
      "⏳ App - Showing loading state"
    );

    return (

      <div
        className="
        flex
        items-center
        justify-center
        h-screen
        "
      >

        <p>Loading...</p>

      </div>
    );
  }

  console.log(
    "✅ App - Authentication state determined, rendering routes"
  );

  return (

    <Router>

      <Routes>

        {/* HOME REDIRECT */}

        <Route

          path="/"

          element={

            isAuthenticated

              ?

              <Navigate
                to="/dashboard"
                replace
              />

              :

              <Navigate
                to="/login"
                replace
              />
          }
        />

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          element={<ProtectedRoute />}
        >

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/documents"
            element={<DocumentListPage />}
          />

          <Route
            path="/documents/:id"
            element={<DocumentDetailPage />}
          />

          <Route
            path="/flashcards"
            element={<FlashcardListPage />}
          />

          {/* FLASHCARD VIEW */}

          <Route
            path="/flashcards/:id"
            element={<FlashcardView />}
          />

          {/* QUIZ TAKE PAGE */}

          <Route
            path="/quizzes/:quizId"
            element={<QuizTakePage />}
          />

          {/* QUIZ RESULT PAGE */}

          <Route
            path="/quizzes/:quizId/results"
            element={<QuizResultPage />}
          />

          {/* PROFILE */}

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

        </Route>

        {/* 404 */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>

    </Router>
  );
};

export default App;
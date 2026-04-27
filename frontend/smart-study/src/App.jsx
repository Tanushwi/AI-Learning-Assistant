import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  console.log("🔄 App Render - Loading:", loading, "Authenticated:", isAuthenticated);

  if (loading) {
    console.log("⏳ App - Showing loading state");
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  console.log("✅ App - Authentication state determined, rendering routes");

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardListPage />} />
          <Route path="/flashcards/:id" element={<FlashcardPage />} />
          <Route path="/quizzes" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
};

export default App;
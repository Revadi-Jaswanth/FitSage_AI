import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import AppSkeleton from "./components/ui/AppSkeleton";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Workout = lazy(() => import("./pages/Workout"));
const Meal = lazy(() => import("./pages/Meal"));
const Progress = lazy(() => import("./pages/Progress"));
const Coach = lazy(() => import("./pages/Coach"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Profile = lazy(() => import("./pages/Profile"));

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<AppSkeleton />}>
          <Routes>
            {/* Guest/Auth routes: Redirect to dashboard if logged in */}
            <Route path="/" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } />

            {/* Protected app routes: Redirect to login if not logged in */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuth={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/workout" element={
              <ProtectedRoute requireAuth={true}>
                <Workout />
              </ProtectedRoute>
            } />
            <Route path="/meal" element={
              <ProtectedRoute requireAuth={true}>
                <Meal />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute requireAuth={true}>
                <Progress />
              </ProtectedRoute>
            } />
            <Route path="/coach" element={
              <ProtectedRoute requireAuth={true}>
                <Coach />
              </ProtectedRoute>
            } />
            <Route path="/recommendations" element={
              <ProtectedRoute requireAuth={true}>
                <Recommendations />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requireAuth={true}>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
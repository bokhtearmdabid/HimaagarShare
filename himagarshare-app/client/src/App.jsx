import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import HostDashboard from './pages/HostDashboard';
import RenterDashboard from './pages/RenterDashboard';
import AddListing from './pages/AddListing';
import ListingDetail from './pages/ListingDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/listing/:id" element={<ListingDetail />} />

            {/* Protected Routes - Host */}
            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute requiredRole="host">
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/add-listing"
              element={
                <ProtectedRoute requiredRole="host">
                  <AddListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/edit-listing/:id"
              element={
                <ProtectedRoute requiredRole="host">
                  <AddListing />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Renter */}
            <Route
              path="/renter/dashboard"
              element={
                <ProtectedRoute requiredRole="renter">
                  <RenterDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Common */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
              },
              success: {
                iconTheme: {
                  primary: '#800000',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

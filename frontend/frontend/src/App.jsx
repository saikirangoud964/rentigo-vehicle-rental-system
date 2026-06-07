import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import VehiclesList from "./pages/VehiclesList";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";

// Route Protection
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import EditVehicle from "./pages/admin/EditVehicle";
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddVehicle from "./pages/admin/AddVehicle";
import ManageVehicles from "./pages/admin/ManageVehicles";
import ManageBookings from "./pages/admin/ManageBookings";

import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/vehicles" element={<VehiclesList />} />
        <Route path="/vehicles/:id" element={<Vehicles />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/edit-vehicle/:id" element={<EditVehicle />} />

        {/* User Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-vehicle"
          element={
            <AdminRoute>
              <AddVehicle />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vehicles"
          element={
            <AdminRoute>
              <ManageVehicles />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <ManageBookings />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

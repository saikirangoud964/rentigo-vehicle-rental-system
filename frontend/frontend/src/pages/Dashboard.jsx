import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo?.token) return;

      const { data } = await axios.get(
        "https://rentigo-vehicle-rental-system.onrender.com/api/owner/dashboard",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setStats({
        totalVehicles: data.totalVehicles || 0,
        totalBookings: data.totalBookings || 0,
        totalUsers: data.totalUsers || 0,
        totalRevenue: data.totalRevenue || 0,
      });
    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Admin Dashboard</h1>

      <div style={statsGrid}>
        <div style={cardStyle}>
          <h3>Total Vehicles</h3>
          <h2>{stats.totalVehicles}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Bookings</h3>
          <h2>{stats.totalBookings}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Users</h3>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <h2>₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      <div style={actionBox}>
        <Link to="/admin/add-vehicle" style={linkStyle}>
          <button style={btnStyle}>Add Vehicle</button>
        </Link>

        <Link to="/admin/vehicles" style={linkStyle}>
          <button style={btnStyle}>Manage Vehicles</button>
        </Link>

        <Link to="/admin/bookings" style={linkStyle}>
          <button style={btnStyle}>Manage Bookings</button>
        </Link>

        <Link to="/admin/users" style={linkStyle}>
          <button style={btnStyle}>Manage Users</button>
        </Link>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "clamp(16px, 4vw, 30px)",
  background: "#f9fafb",
  minHeight: "100vh",
  boxSizing: "border-box",
};

const titleStyle = {
  fontSize: "clamp(30px, 5vw, 42px)",
  color: "#111827",
  marginBottom: "25px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const actionBox = {
  marginTop: "40px",
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
};

const linkStyle = {
  textDecoration: "none",
  flex: "1 1 180px",
};

const btnStyle = {
  width: "100%",
  padding: "13px 16px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Dashboard;

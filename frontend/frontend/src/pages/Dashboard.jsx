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
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div className="card">
          <h3>Total Vehicles</h3>
          <h2>{stats.totalVehicles}</h2>
        </div>

        <div className="card">
          <h3>Total Bookings</h3>
          <h2>{stats.totalBookings}</h2>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <h2>₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "15px",
        }}
      >
        <Link to="/admin/add-vehicle">
          <button>Add Vehicle</button>
        </Link>

        <Link to="/admin/vehicles">
          <button>Manage Vehicles</button>
        </Link>

        <Link to="/admin/bookings">
          <button>Manage Bookings</button>
        </Link>

        <Link to="/admin/users">
          <button>Manage Users</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

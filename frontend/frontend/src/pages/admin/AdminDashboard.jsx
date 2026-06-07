import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getUserInfo = () => {
    return JSON.parse(localStorage.getItem("userInfo"));
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const userInfo = getUserInfo();

      if (!userInfo?.token) {
        console.log("No token found");
        return;
      }

      if (userInfo.role !== "admin") {
        console.log("Only admin can access dashboard");
        return;
      }

      const analyticsRes = await axios.get(
        "https://rentigo-vehicle-rental-system.onrender.com/api/analytics/admin",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      const bookingRes = await axios.get(
        "https://rentigo-vehicle-rental-system.onrender.com/api/bookings/all",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setAnalytics(analyticsRes.data);
      setBookings(bookingRes.data.bookings || []);
    } catch (error) {
      console.log("DASHBOARD ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
  };

  const statusCounts = {
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };

  const bookingStatusData = [
    { name: "Pending", value: statusCounts.pending },
    { name: "Approved", value: statusCounts.approved },
    { name: "Cancelled", value: statusCounts.cancelled },
    { name: "Completed", value: statusCounts.completed },
    { name: "Rejected", value: statusCounts.rejected },
  ].filter((item) => item.value > 0);

  const recentBookings = bookings.slice(0, 5);

  const COLORS = ["#f59e0b", "#10b981", "#6b7280", "#2563eb", "#ef4444"];

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading dashboard...</h2>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={{ marginBottom: "8px" }}>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: "30px" }}>
        Advanced analytics for users, vehicles, bookings, revenue and growth.
      </p>

      <div style={gridStyle}>
        <Card title="👥 Total Users" value={analytics?.usersCount || 0} />
        <Card title="🚗 Total Vehicles" value={analytics?.vehiclesCount || 0} />
        <Card title="📘 Total Bookings" value={analytics?.bookingsCount || 0} />
        <Card
          title="💳 Paid Bookings"
          value={analytics?.paidBookingsCount || 0}
        />
        <Card
          title="💰 Total Revenue"
          value={`₹${Number(analytics?.totalRevenue || 0).toLocaleString()}`}
        />
        <Card
          title="📈 Booking Growth"
          value={`${analytics?.bookingGrowth || 0}%`}
        />
        <Card
          title="💹 Revenue Growth"
          value={`${analytics?.revenueGrowth || 0}%`}
        />
      </div>

      <div style={gridStyle}>
        <div style={{ ...cardStyle, borderTop: "5px solid orange" }}>
          <h3>⏳ Pending</h3>
          <h1>{statusCounts.pending}</h1>
        </div>

        <div style={{ ...cardStyle, borderTop: "5px solid green" }}>
          <h3>✅ Approved</h3>
          <h1>{statusCounts.approved}</h1>
        </div>

        <div style={{ ...cardStyle, borderTop: "5px solid red" }}>
          <h3>❌ Cancelled</h3>
          <h1>{statusCounts.cancelled}</h1>
        </div>

        <div style={{ ...cardStyle, borderTop: "5px solid #2563eb" }}>
          <h3>🏁 Completed</h3>
          <h1>{statusCounts.completed}</h1>
        </div>
      </div>

      <div style={highlightGrid}>
        <div style={highlightCard}>
          <h2>🏆 Most Booked Vehicle</h2>
          {analytics?.mostBookedVehicle ? (
            <>
              <h3>{analytics.mostBookedVehicle.vehicleName}</h3>
              <p>{analytics.mostBookedVehicle.brand}</p>
              <strong>{analytics.mostBookedVehicle.bookings} bookings</strong>
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div style={highlightCard}>
          <h2>⭐ Most Active User</h2>
          {analytics?.mostActiveUser ? (
            <>
              <h3>{analytics.mostActiveUser.userName}</h3>
              <p>{analytics.mostActiveUser.email}</p>
              <strong>{analytics.mostActiveUser.bookings} bookings</strong>
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

      <div style={chartGridStyle}>
        <div style={tableBoxStyle}>
          <h2>Monthly Revenue</h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={analytics?.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={tableBoxStyle}>
          <h2>Booking Status</h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={chartGridStyle}>
        <div style={tableBoxStyle}>
          <h2>Top 5 Vehicles</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics?.topVehicles || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicleName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={tableBoxStyle}>
          <h2>Top 5 Customers</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics?.topCustomers || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="userName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={chartGridStyle}>
        <div style={tableBoxStyle}>
          <h2>Top 5 Vehicles Table</h2>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Brand</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Bookings</th>
              </tr>
            </thead>

            <tbody>
              {(analytics?.topVehicles || []).length === 0 ? (
                <tr>
                  <td colSpan="4" style={tdStyle}>
                    No data available
                  </td>
                </tr>
              ) : (
                analytics.topVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{vehicle.vehicleName}</td>
                    <td style={tdStyle}>{vehicle.brand}</td>
                    <td style={tdStyle}>
                      {vehicle.type === "2W" ? "2 Wheeler" : "4 Wheeler"}
                    </td>
                    <td style={tdStyle}>{vehicle.bookings}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={tableBoxStyle}>
          <h2>Top 5 Customers Table</h2>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Bookings</th>
                <th style={thStyle}>Revenue</th>
              </tr>
            </thead>

            <tbody>
              {(analytics?.topCustomers || []).length === 0 ? (
                <tr>
                  <td colSpan="4" style={tdStyle}>
                    No data available
                  </td>
                </tr>
              ) : (
                analytics.topCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{customer.userName}</td>
                    <td style={tdStyle}>{customer.email}</td>
                    <td style={tdStyle}>{customer.bookings}</td>
                    <td style={tdStyle}>₹{customer.revenue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={tableBoxStyle}>
        <h2 style={{ marginBottom: "15px" }}>Recent Bookings</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Vehicle</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Payment</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>

          <tbody>
            {recentBookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={tdStyle}>
                  No recent bookings
                </td>
              </tr>
            ) : (
              recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td style={tdStyle}>{booking.user?.name || "N/A"}</td>
                  <td style={tdStyle}>{booking.vehicle?.name || "N/A"}</td>

                  <td style={tdStyle}>
                    ₹{booking.amountPaid || booking.totalPrice || 0}
                  </td>

                  <td style={tdStyle}>
                    <span style={paymentStyle(booking.paymentStatus)}>
                      {booking.paymentStatus || "Pending"}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <span style={statusStyle(booking.status)}>
                      {booking.status}
                    </span>
                  </td>

                  <td style={tdStyle}>{formatDate(booking.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={quickActions}>
        <Link to="/admin/add-vehicle">
          <button style={btnStyle}>Add Vehicle</button>
        </Link>

        <Link to="/admin/vehicles">
          <button style={btnStyle}>Manage Vehicles</button>
        </Link>

        <Link to="/admin/bookings">
          <button style={btnStyle}>Manage Bookings</button>
        </Link>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

const pageStyle = {
  padding: "40px",
  background: "#f9fafb",
  minHeight: "100vh",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "35px",
};

const highlightGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
  marginBottom: "35px",
};

const highlightCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  borderLeft: "6px solid #2563eb",
};

const chartGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "20px",
  marginBottom: "35px",
};

const cardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const tableBoxStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  marginBottom: "35px",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "700px",
};

const thStyle = {
  padding: "14px",
  border: "1px solid #ddd",
  background: "#f3f4f6",
};

const tdStyle = {
  padding: "14px",
  border: "1px solid #ddd",
  textAlign: "center",
};

const statusStyle = (status) => ({
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  textTransform: "capitalize",
  background:
    status === "pending"
      ? "orange"
      : status === "approved"
        ? "green"
        : status === "cancelled"
          ? "gray"
          : status === "completed"
            ? "#2563eb"
            : "red",
});

const paymentStyle = (status) => ({
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  background:
    status === "Paid" ? "green" : status === "Failed" ? "red" : "orange",
});

const quickActions = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
  marginTop: "30px",
};

const btnStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

export default AdminDashboard;

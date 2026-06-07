import { useEffect, useState } from "react";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchBookings();
  }, []);

  const getUserInfo = () => {
    return JSON.parse(localStorage.getItem("userInfo"));
  };

  const fetchBookings = async () => {
    try {
      const userInfo = getUserInfo();

      if (!userInfo?.token) {
        showNotification("Please login again", "error");
        return;
      }

      if (userInfo.role !== "admin") {
        showNotification("Only admin can view bookings", "error");
        return;
      }

      const { data } = await axios.get(
        "https://rentigo-vehicle-rental-system.onrender.com/api/bookings/all",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setBookings(data.bookings || []);
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to fetch bookings",
        "error",
      );
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const userInfo = getUserInfo();

      await axios.put(
        `https://rentigo-vehicle-rental-system.onrender.com/api/bookings/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      if (status === "approved") showNotification("✅ Booking Approved");
      if (status === "rejected")
        showNotification("❌ Booking Rejected", "error");
      if (status === "completed") showNotification("🏁 Booking Completed");

      fetchBookings();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to update status",
        "error",
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setFromDate("");
    setToDate("");
  };

  const filteredBookings = bookings.filter((booking) => {
    const userName = booking.user?.name?.toLowerCase() || "";
    const userEmail = booking.user?.email?.toLowerCase() || "";
    const vehicleName = booking.vehicle?.name?.toLowerCase() || "";
    const vehicleBrand = booking.vehicle?.brand?.toLowerCase() || "";
    const paymentId = booking.paymentId?.toLowerCase() || "";

    const searchText = search.toLowerCase();

    const matchesSearch =
      userName.includes(searchText) ||
      userEmail.includes(searchText) ||
      vehicleName.includes(searchText) ||
      vehicleBrand.includes(searchText) ||
      paymentId.includes(searchText);

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    const matchesPayment =
      paymentFilter === "all" ||
      (booking.paymentStatus || "Pending") === paymentFilter;

    const bookingDate = new Date(booking.createdAt);

    const matchesFromDate =
      !fromDate || bookingDate >= new Date(`${fromDate}T00:00:00`);

    const matchesToDate =
      !toDate || bookingDate <= new Date(`${toDate}T23:59:59`);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPayment &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
  };

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const exportCSV = () => {
    if (filteredBookings.length === 0) {
      showNotification("No bookings available to export", "error");
      return;
    }

    const headers = [
      "Customer Name",
      "Customer Email",
      "Vehicle",
      "Brand",
      "Amount",
      "Payment Status",
      "Payment ID",
      "Booking Date",
      "Pickup Date",
      "Return Date",
      "Booking Status",
    ];

    const rows = filteredBookings.map((booking) => [
      booking.user?.name || "N/A",
      booking.user?.email || "N/A",
      booking.vehicle?.name || "N/A",
      booking.vehicle?.brand || "N/A",
      booking.amountPaid || booking.totalPrice || 0,
      booking.paymentStatus || "Pending",
      booking.paymentId || "N/A",
      formatDate(booking.createdAt),
      formatDate(booking.startDate),
      formatDate(booking.endDate),
      booking.status || "N/A",
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `rentigo-bookings-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showNotification("📊 CSV report downloaded");
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const approvedBookings = bookings.filter(
    (b) => b.status === "approved",
  ).length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const paidBookings = bookings.filter(
    (b) => b.paymentStatus === "Paid",
  ).length;

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Manage Bookings</h1>

      <p style={subtitleStyle}>
        View, filter, approve, reject, complete and export booking records.
      </p>

      <div style={summaryContainer}>
        <div style={summaryCard}>
          <h2>{totalBookings}</h2>
          <p>Total Bookings</p>
        </div>

        <div style={summaryCard}>
          <h2>{pendingBookings}</h2>
          <p>Pending</p>
        </div>

        <div style={summaryCard}>
          <h2>{approvedBookings}</h2>
          <p>Approved</p>
        </div>

        <div style={summaryCard}>
          <h2>{completedBookings}</h2>
          <p>Completed</p>
        </div>

        <div style={summaryCard}>
          <h2>{paidBookings}</h2>
          <p>Paid Bookings</p>
        </div>
      </div>

      <div style={filterBoxStyle}>
        <input
          type="text"
          placeholder="Search customer, vehicle, email, payment ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Booking Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={inputStyle}
        />

        <button onClick={clearFilters} style={clearBtn}>
          Clear Filters
        </button>

        <button onClick={exportCSV} style={exportBtn}>
          📊 Export CSV
        </button>
      </div>

      <p style={resultTextStyle}>
        Showing {filteredBookings.length} of {bookings.length} bookings
      </p>

      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Vehicle</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Payment</th>
              <th style={thStyle}>Payment ID</th>
              <th style={thStyle}>Booking Date</th>
              <th style={thStyle}>Pickup</th>
              <th style={thStyle}>Return</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="10" style={tdStyle}>
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td style={tdStyle}>
                    <strong>{booking.user?.name || "N/A"}</strong>
                    <br />
                    <small>{booking.user?.email || ""}</small>
                  </td>

                  <td style={tdStyle}>
                    <strong>{booking.vehicle?.name || "N/A"}</strong>
                    <br />
                    <small>{booking.vehicle?.brand || ""}</small>
                  </td>

                  <td style={tdStyle}>
                    ₹{booking.amountPaid || booking.totalPrice || 0}
                  </td>

                  <td style={tdStyle}>
                    <span style={paymentStyle(booking.paymentStatus)}>
                      {booking.paymentStatus || "Pending"}
                    </span>
                  </td>

                  <td style={tdStyle}>{booking.paymentId || "N/A"}</td>

                  <td style={tdStyle}>{formatDate(booking.createdAt)}</td>

                  <td style={tdStyle}>{formatDate(booking.startDate)}</td>

                  <td style={tdStyle}>{formatDate(booking.endDate)}</td>

                  <td style={tdStyle}>
                    <span style={statusStyle(booking.status)}>
                      {booking.status}
                    </span>
                  </td>

                  <td style={{ ...tdStyle, minWidth: "160px" }}>
                    {booking.status === "pending" && (
                      <div style={actionBtnBox}>
                        <button
                          style={approveBtn}
                          onClick={() => updateStatus(booking._id, "approved")}
                        >
                          Approve
                        </button>

                        <button
                          style={rejectBtn}
                          onClick={() => updateStatus(booking._id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {booking.status === "approved" && (
                      <button
                        style={completeBtn}
                        onClick={() => updateStatus(booking._id, "completed")}
                      >
                        Complete
                      </button>
                    )}

                    {["rejected", "completed", "cancelled"].includes(
                      booking.status,
                    ) && <span>No Action</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "clamp(15px, 4vw, 30px)",
  backgroundColor: "#f9fafb",
  minHeight: "80vh",
  boxSizing: "border-box",
};

const titleStyle = {
  marginBottom: "8px",
  fontSize: "clamp(30px, 5vw, 42px)",
  color: "#111827",
};

const subtitleStyle = {
  color: "#6b7280",
  marginBottom: "25px",
  fontSize: "clamp(15px, 2vw, 17px)",
};

const summaryContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "15px",
  marginBottom: "25px",
};

const summaryCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const filterBoxStyle = {
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
  flexWrap: "wrap",
  background: "#fff",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const inputStyle = {
  flex: "1 1 220px",
  minWidth: "180px",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
};

const resultTextStyle = {
  marginBottom: "15px",
  fontWeight: "bold",
};

const tableWrapperStyle = {
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  borderRadius: "12px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  minWidth: "1100px",
};

const thStyle = {
  padding: "14px",
  border: "1px solid #ddd",
  backgroundColor: "#f3f4f6",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px",
  border: "1px solid #ddd",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const statusStyle = (status) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  color: "white",
  textTransform: "capitalize",
  display: "inline-block",
  backgroundColor:
    status === "pending"
      ? "orange"
      : status === "approved"
        ? "green"
        : status === "rejected"
          ? "red"
          : status === "completed"
            ? "#2563eb"
            : "gray",
});

const paymentStyle = (status) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  color: "white",
  display: "inline-block",
  backgroundColor:
    status === "Paid" ? "green" : status === "Failed" ? "red" : "orange",
});

const actionBtnBox = {
  display: "flex",
  gap: "8px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const approveBtn = {
  backgroundColor: "green",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const rejectBtn = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const completeBtn = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const clearBtn = {
  flex: "1 1 150px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const exportBtn = {
  flex: "1 1 150px",
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default ManageBookings;

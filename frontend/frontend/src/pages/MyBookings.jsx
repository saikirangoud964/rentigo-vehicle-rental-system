import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo || !userInfo.token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        "https://rentigo-vehicle-rental-system.onrender.com/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setBookings(data.bookings || []);
    } catch (error) {
      console.log("FETCH BOOKINGS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await axios.put(
        `https://rentigo-vehicle-rental-system.onrender.com/api/bookings/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
  };

  const downloadInvoice = (booking) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("RentiGo Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking._id}`, 20, 40);
    doc.text(`Customer: ${userInfo?.name || "Customer"}`, 20, 50);
    doc.text(`Email: ${userInfo?.email || "N/A"}`, 20, 60);

    doc.text(`Vehicle: ${booking.vehicle?.name || "Vehicle"}`, 20, 80);
    doc.text(`Brand: ${booking.vehicle?.brand || "N/A"}`, 20, 90);
    doc.text(`Pickup Date: ${formatDate(booking.startDate)}`, 20, 110);
    doc.text(`Return Date: ${formatDate(booking.endDate)}`, 20, 120);

    doc.text(`Booking Status: ${booking.status}`, 20, 135);
    doc.text(`Payment Status: ${booking.paymentStatus || "Pending"}`, 20, 145);
    doc.text(`Payment ID: ${booking.paymentId || "N/A"}`, 20, 155);
    doc.text(
      `Amount Paid: Rs. ${booking.amountPaid || booking.totalPrice || 0}`,
      20,
      165,
    );

    doc.line(20, 175, 190, 175);

    doc.setFontSize(14);
    doc.text("Thank you for choosing RentiGo!", 20, 190);

    doc.save(`invoice-${booking._id}.pdf`);
  };

  const bookingStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#16a34a";
      case "pending":
        return "#f59e0b";
      case "completed":
        return "#2563eb";
      case "cancelled":
      case "rejected":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const paymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#16a34a";
      case "Failed":
        return "#dc2626";
      default:
        return "#f59e0b";
    }
  };

  const totalAmount = bookings.reduce(
    (sum, booking) =>
      sum + Number(booking.amountPaid || booking.totalPrice || 0),
    0,
  );

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading bookings...</h2>;
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ marginBottom: "6px" }}>My Bookings</h1>
          <p style={{ color: "#6b7280" }}>
            View your bookings, payment details, and invoices.
          </p>
        </div>

        <div style={summaryCard}>
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>

        <div style={summaryCard}>
          <h3>₹{totalAmount.toLocaleString()}</h3>
          <p>Total Paid</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div style={emptyBox}>
          <h2>No bookings found</h2>
          <p>You have not booked any vehicle yet.</p>
        </div>
      ) : (
        <div style={bookingGrid}>
          {bookings.map((booking) => (
            <div key={booking._id} style={cardStyle}>
              <div style={cardHeader}>
                <div>
                  <h2 style={{ marginBottom: "5px" }}>
                    {booking.vehicle?.name || "Vehicle"}
                  </h2>
                  <p style={{ color: "#6b7280" }}>
                    {booking.vehicle?.brand || "RentiGo Vehicle"}
                  </p>
                </div>

                <span
                  style={{
                    ...badgeStyle,
                    backgroundColor: bookingStatusColor(booking.status),
                  }}
                >
                  {booking.status}
                </span>
              </div>

              <div style={detailsGrid}>
                <div>
                  <small>Pickup Date</small>
                  <strong>{formatDate(booking.startDate)}</strong>
                </div>

                <div>
                  <small>Return Date</small>
                  <strong>{formatDate(booking.endDate)}</strong>
                </div>

                <div>
                  <small>Total Price</small>
                  <strong>₹{booking.totalPrice || 0}</strong>
                </div>

                <div>
                  <small>Amount Paid</small>
                  <strong>
                    ₹{booking.amountPaid || booking.totalPrice || 0}
                  </strong>
                </div>
              </div>

              <div style={paymentBox}>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span
                    style={{
                      color: paymentStatusColor(booking.paymentStatus),
                      fontWeight: "bold",
                    }}
                  >
                    {booking.paymentStatus || "Pending"}
                  </span>
                </p>

                <p>
                  <strong>Payment ID:</strong>{" "}
                  <span>{booking.paymentId || "N/A"}</span>
                </p>

                <p>
                  <strong>Booking ID:</strong>{" "}
                  <span style={{ fontSize: "13px" }}>{booking._id}</span>
                </p>
              </div>

              <div style={actionBox}>
                <button
                  onClick={() => downloadInvoice(booking)}
                  style={invoiceBtn}
                >
                  Download Invoice
                </button>

                {!["cancelled", "completed", "rejected"].includes(
                  booking.status,
                ) && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    style={cancelBtn}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  backgroundColor: "#f9fafb",
  minHeight: "80vh",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "30px",
};

const summaryCard = {
  background: "#fff",
  padding: "18px 25px",
  borderRadius: "14px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  minWidth: "160px",
  textAlign: "center",
};

const emptyBox = {
  background: "#fff",
  padding: "40px",
  textAlign: "center",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const bookingGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "22px",
  borderRadius: "16px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "15px",
  marginBottom: "20px",
};

const badgeStyle = {
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  textTransform: "capitalize",
  fontSize: "13px",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "14px",
  marginBottom: "18px",
};

const paymentBox = {
  background: "#f3f4f6",
  padding: "14px",
  borderRadius: "12px",
  marginBottom: "18px",
  lineHeight: "1.8",
};

const actionBox = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const invoiceBtn = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const cancelBtn = {
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default MyBookings;

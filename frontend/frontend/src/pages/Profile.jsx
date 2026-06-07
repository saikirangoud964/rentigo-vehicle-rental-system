import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo);
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo?.token) return;

      const { data } = await axios.get(
        "https://rentigo-vehicle-rental-system.onrender.com/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      const bookings = data.bookings || [];

      setBookingCount(bookings.length);

      const amount = bookings.reduce(
        (sum, booking) =>
          sum + Number(booking.amountPaid || booking.totalPrice || 0),
        0,
      );

      setTotalSpent(amount);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <h2 style={loadingStyle}>Loading...</h2>;
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={profileHeaderStyle}>
          <div style={avatarStyle}>{user.name?.charAt(0)?.toUpperCase()}</div>

          <div>
            <h1 style={titleStyle}>👤 My Profile</h1>
            <p style={subtitleStyle}>Manage your account information</p>
          </div>
        </div>

        <hr style={dividerStyle} />

        <div style={infoGridStyle}>
          <div style={infoBoxStyle}>
            <span style={labelStyle}>Name</span>
            <strong style={valueStyle}>{user.name}</strong>
          </div>

          <div style={infoBoxStyle}>
            <span style={labelStyle}>Email</span>
            <strong style={valueStyle}>{user.email}</strong>
          </div>

          <div style={infoBoxStyle}>
            <span style={labelStyle}>Role</span>
            <strong style={valueStyle}>{user.role}</strong>
          </div>
        </div>

        <hr style={dividerStyle} />

        <h2 style={sectionTitleStyle}>📊 Booking Statistics</h2>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <h3>{bookingCount}</h3>
            <p>Total Bookings</p>
          </div>

          <div style={statCardStyle}>
            <h3>₹{totalSpent.toLocaleString()}</h3>
            <p>Total Amount Spent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const loadingStyle = {
  padding: "30px",
  textAlign: "center",
};

const pageStyle = {
  minHeight: "80vh",
  background: "#f9fafb",
  padding: "clamp(16px, 4vw, 40px)",
  boxSizing: "border-box",
};

const cardStyle = {
  maxWidth: "850px",
  margin: "0 auto",
  padding: "clamp(22px, 4vw, 35px)",
  background: "#fff",
  borderRadius: "18px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
  boxSizing: "border-box",
};

const profileHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  flexWrap: "wrap",
};

const avatarStyle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "#111827",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  fontWeight: "bold",
};

const titleStyle = {
  margin: 0,
  fontSize: "clamp(28px, 5vw, 40px)",
  color: "#111827",
};

const subtitleStyle = {
  marginTop: "6px",
  color: "#6b7280",
};

const dividerStyle = {
  margin: "25px 0",
  border: "none",
  borderTop: "1px solid #e5e7eb",
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const infoBoxStyle = {
  background: "#f3f4f6",
  padding: "18px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  overflowWrap: "break-word",
};

const labelStyle = {
  color: "#6b7280",
  fontSize: "14px",
};

const valueStyle = {
  color: "#111827",
  fontSize: "16px",
  wordBreak: "break-word",
};

const sectionTitleStyle = {
  fontSize: "clamp(24px, 4vw, 30px)",
  marginBottom: "18px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "18px",
};

const statCardStyle = {
  background: "#eef2ff",
  color: "#111827",
  padding: "22px",
  borderRadius: "14px",
  textAlign: "center",
};

export default Profile;

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
        (sum, booking) => sum + (booking.totalPrice || 0),
        0,
      );

      setTotalSpent(amount);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1>👤 My Profile</h1>

      <hr />

      <p>
        <strong>Name:</strong> {user.name}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <hr />

      <h2>📊 Booking Statistics</h2>

      <p>
        <strong>Total Bookings:</strong> {bookingCount}
      </p>

      <p>
        <strong>Total Amount Spent:</strong> ₹{totalSpent}
      </p>
    </div>
  );
}

export default Profile;

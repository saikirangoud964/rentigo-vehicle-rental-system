import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";

function Vehicles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [vehicle, setVehicle] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [bookedDates, setBookedDates] = useState([]);
  const [paying, setPaying] = useState(false);

  const API_URL = "https://rentigo-vehicle-rental-system.onrender.com/api";

  useEffect(() => {
    fetchVehicle();
    fetchBookedDates();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/vehicles/${id}`);
      setVehicle(data.vehicle);
    } catch (error) {
      console.error(error);
      showNotification("Failed to load vehicle details", "error");
    }
  };

  const fetchBookedDates = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/bookings/vehicle/${id}/booked-dates`,
      );
      setBookedDates(data.bookedDates || []);
    } catch (error) {
      console.error("BOOKED DATES ERROR:", error);
    }
  };

  const getUserInfo = () => JSON.parse(localStorage.getItem("userInfo"));

  const getToken = () => {
    const userInfo = getUserInfo();
    return userInfo?.token;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const isDateBooked = (date) => {
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);

    return bookedDates.some((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return current >= start && current <= end;
    });
  };

  const isSelectedRangeBooked = () => {
    if (!pickupDate || !returnDate) return false;

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      if (isDateBooked(date)) return true;
    }

    return false;
  };

  const getNext14Days = () => {
    const days = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(new Date(date));
    }

    return days;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * (vehicle?.pricePerDay || 0);
  const selectedRangeBooked = isSelectedRangeBooked();

  const handleBooking = async () => {
    if (!vehicle.available) {
      showNotification("Vehicle is currently unavailable", "error");
      return;
    }

    if (!pickupDate || !returnDate) {
      showNotification("Please select pickup and return dates", "error");
      return;
    }

    if (totalDays <= 0) {
      showNotification("Return date must be after pickup date", "error");
      return;
    }

    if (selectedRangeBooked) {
      showNotification("Selected dates include booked dates", "error");
      return;
    }

    try {
      setPaying(true);

      const token = getToken();
      const userInfo = getUserInfo();

      if (!token) {
        showNotification("Please login first", "error");
        navigate("/login");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        showNotification("Razorpay failed to load", "error");
        return;
      }

      const orderRes = await axios.post(`${API_URL}/payments/create-order`, {
        amount: totalPrice,
      });

      const { order, key } = orderRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "RentiGo",
        description: `Booking for ${vehicle.name}`,
        order_id: order.id,

        handler: async function (response) {
          try {
            await axios.post(`${API_URL}/payments/verify`, response);

            await axios.post(
              `${API_URL}/bookings`,
              {
                vehicleId: vehicle._id,
                startDate: pickupDate,
                endDate: returnDate,
                paymentStatus: "Paid",
                paymentId: response.razorpay_payment_id,
                amountPaid: totalPrice,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            showNotification("💳 Payment Successful & Booking Confirmed");
            navigate("/my-bookings");
          } catch (error) {
            console.error(error);
            showNotification("Payment verification failed", "error");
          }
        },

        prefill: {
          name: userInfo?.name || "",
          email: userInfo?.email || "",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      showNotification(
        error.response?.data?.message || "Payment failed",
        "error",
      );
    } finally {
      setPaying(false);
    }
  };

  if (!vehicle) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Loading vehicle details...</h2>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      <div style={layoutStyle}>
        <div>
          <img
            src={
              vehicle.image?.startsWith("http")
                ? vehicle.image
                : "https://via.placeholder.com/900x450?text=Vehicle"
            }
            alt={vehicle.name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/900x450?text=Vehicle";
            }}
            style={imageStyle}
          />

          <div style={infoBox}>
            <h2>About this vehicle</h2>
            <p style={descriptionStyle}>
              {vehicle.description ||
                "Well maintained rental vehicle with excellent comfort, safety, and performance. Ideal for city rides, trips, and daily travel."}
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={titleRow}>
            <div>
              <h1 style={vehicleTitleStyle}>{vehicle.name}</h1>
              <h3 style={{ color: "#6b7280", marginTop: 0 }}>
                {vehicle.brand}
              </h3>
            </div>

            <span
              style={{
                ...availabilityBadge,
                background: vehicle.available ? "#16a34a" : "#dc2626",
              }}
            >
              {vehicle.available ? "Available" : "Booked"}
            </span>
          </div>

          <div style={featureGrid}>
            <span style={featureBadge}>🚗 Self Drive</span>
            <span style={featureBadge}>⛽ {vehicle.fuelType}</span>
            <span style={featureBadge}>⚙️ {vehicle.transmission}</span>
            <span style={featureBadge}>
              {vehicle.type === "2W" ? "🏍️ 2 Wheeler" : "🚘 4 Wheeler"}
            </span>
          </div>

          <div style={detailBox}>
            <p>
              <strong>Vehicle Number:</strong> {vehicle.vehicleNumber}
            </p>
            <p>
              <strong>Type:</strong>{" "}
              {vehicle.type === "2W" ? "2 Wheeler" : "4 Wheeler"}
            </p>
            <p>
              <strong>Fuel Type:</strong> {vehicle.fuelType}
            </p>
            <p>
              <strong>Transmission:</strong> {vehicle.transmission}
            </p>
          </div>

          <h2 style={priceStyle}>₹{vehicle.pricePerDay}/day</h2>

          <hr />

          <h3>Availability Calendar</h3>

          <div style={calendarGrid}>
            {getNext14Days().map((date) => {
              const booked = isDateBooked(date);

              return (
                <div
                  key={date.toISOString()}
                  style={{
                    ...dateBox,
                    background: booked ? "#fee2e2" : "#dcfce7",
                    border: booked ? "1px solid #ef4444" : "1px solid #22c55e",
                  }}
                >
                  <strong>
                    {date.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </strong>
                  <br />
                  <span
                    style={{
                      color: booked ? "#dc2626" : "#16a34a",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {booked ? "Booked" : "Available"}
                  </span>
                </div>
              );
            })}
          </div>

          <hr />

          <h3>Booking Details</h3>

          <div style={bookingGrid}>
            <div>
              <label>Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Return Date</label>
              <input
                type="date"
                value={returnDate}
                min={pickupDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setReturnDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {pickupDate && returnDate && (
            <div
              style={{
                ...summaryBox,
                background: selectedRangeBooked ? "#fee2e2" : "#f3f4f6",
              }}
            >
              <p>
                <strong>Total Days:</strong> {totalDays}
              </p>

              <p>
                <strong>Total Price:</strong>
                <span style={totalPriceText}> ₹{totalPrice}</span>
              </p>

              <p>
                <strong>Payment Mode:</strong> Razorpay
              </p>

              {selectedRangeBooked && (
                <p style={{ color: "#dc2626", fontWeight: "bold" }}>
                  ❌ Selected dates include booked dates.
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={!vehicle.available || selectedRangeBooked || paying}
            style={{
              ...bookBtn,
              background:
                vehicle.available && !selectedRangeBooked ? "#2563eb" : "#999",
              cursor:
                vehicle.available && !selectedRangeBooked && !paying
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            {paying
              ? "Opening Payment..."
              : vehicle.available
                ? selectedRangeBooked
                  ? "❌ Dates Not Available"
                  : `💳 Pay ₹${totalPrice || vehicle.pricePerDay} & Book`
                : "🚫 Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "clamp(15px, 4vw, 30px)",
  boxSizing: "border-box",
};

const backBtn = {
  marginBottom: "20px",
  background: "#111827",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "30px",
  alignItems: "start",
};

const imageStyle = {
  width: "100%",
  height: "auto",
  minHeight: "240px",
  maxHeight: "450px",
  objectFit: "cover",
  borderRadius: "15px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
};

const infoBox = {
  background: "#fff",
  marginTop: "20px",
  padding: "clamp(18px, 3vw, 22px)",
  borderRadius: "15px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};

const descriptionStyle = {
  color: "#4b5563",
  lineHeight: "1.7",
};

const cardStyle = {
  background: "#fff",
  padding: "clamp(18px, 3vw, 25px)",
  borderRadius: "15px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  width: "100%",
  boxSizing: "border-box",
};

const titleRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const vehicleTitleStyle = {
  marginBottom: "5px",
  fontSize: "clamp(28px, 4vw, 40px)",
  lineHeight: "1.2",
};

const availabilityBadge = {
  color: "white",
  padding: "7px 13px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold",
};

const featureGrid = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
  marginBottom: "18px",
};

const featureBadge = {
  background: "#eef2ff",
  color: "#2563eb",
  padding: "8px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
};

const detailBox = {
  background: "#f9fafb",
  padding: "15px",
  borderRadius: "12px",
  lineHeight: "1.8",
};

const priceStyle = {
  color: "#2563eb",
  marginTop: "18px",
};

const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
  gap: "10px",
  marginTop: "15px",
  marginBottom: "20px",
};

const dateBox = {
  padding: "10px",
  borderRadius: "10px",
  textAlign: "center",
};

const bookingGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
};

const summaryBox = {
  marginTop: "20px",
  padding: "15px",
  borderRadius: "10px",
};

const totalPriceText = {
  color: "#2563eb",
  fontSize: "20px",
  fontWeight: "bold",
  marginLeft: "8px",
};

const bookBtn = {
  marginTop: "25px",
  color: "white",
  border: "none",
  padding: "13px 24px",
  borderRadius: "8px",
  width: "100%",
  fontWeight: "bold",
};

export default Vehicles;

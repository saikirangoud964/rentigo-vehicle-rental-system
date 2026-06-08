import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("Hyderabad");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await axios.get(
        "https://rentigo-vehicle-rental-system.onrender.com/api/vehicles",
      );

      setVehicles(data.vehicles || data.data || data || []);
    } catch (error) {
      console.log("HOME VEHICLES ERROR:", error);
    }
  };

  const handleSearch = () => {
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates");
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      alert("Return date must be after pickup date");
      return;
    }

    navigate(
      `/vehicles?location=${location}&pickup=${pickupDate}&return=${returnDate}`,
    );
  };

  const latestVehicles = vehicles.slice(0, 6);
  const twoWheelers = vehicles.filter((v) => v.type === "2W").length;
  const fourWheelers = vehicles.filter((v) => v.type === "4W").length;

  return (
    <div>
      <section style={heroSectionStyle}>
        <div style={heroContentStyle}>
          <h4 style={smallTitleStyle}>Vehicle Rentals</h4>

          <h1 style={heroTitleStyle}>Best Vehicle Rentals in Hyderabad</h1>

          <p style={heroTextStyle}>
            Rent bikes, scooters, cars and SUVs with secure Razorpay payments,
            invoices and easy booking management.
          </p>

          <div style={searchBoxStyle}>
            <div style={inputRowStyle}>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                style={inputStyle}
              />

              <input
                type="date"
                value={pickupDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                style={inputStyle}
              />

              <input
                type="date"
                value={returnDate}
                min={pickupDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setReturnDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button onClick={handleSearch} style={buttonStyle}>
              Search Vehicles
            </button>
          </div>
        </div>

        <div style={imageBoxStyle}>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200"
            alt="Vehicle Rental"
            style={imageStyle}
          />
        </div>
      </section>

      <section style={statsSectionStyle}>
        <div style={statCardStyle}>
          <h2>{vehicles.length}+</h2>
          <p>Total Vehicles</p>
        </div>

        <div style={statCardStyle}>
          <h2>{twoWheelers}+</h2>
          <p>Two Wheelers</p>
        </div>

        <div style={statCardStyle}>
          <h2>{fourWheelers}+</h2>
          <p>Four Wheelers</p>
        </div>

        <div style={statCardStyle}>
          <h2>24/7</h2>
          <p>Support</p>
        </div>
      </section>

      <section style={latestSectionStyle}>
        <h2 style={sectionTitleStyle}>Latest Vehicles</h2>
        <p style={sectionSubTextStyle}>
          Explore newly added vehicles available for rent.
        </p>

        <div style={vehicleGridStyle}>
          {latestVehicles.map((vehicle) => (
            <div key={vehicle._id} style={vehicleCardStyle}>
              <img
                src={
                  vehicle.image?.startsWith("http")
                    ? vehicle.image
                    : "https://via.placeholder.com/400x250?text=Vehicle"
                }
                alt={vehicle.name}
                style={vehicleImageStyle}
              />

              <div style={vehicleContentStyle}>
                <h3>{vehicle.name}</h3>
                <p>{vehicle.brand}</p>
                <strong style={priceStyle}>₹{vehicle.pricePerDay}/day</strong>

                <button
                  onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                  style={viewBtnStyle}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/vehicles")} style={exploreBtnStyle}>
          View All Vehicles
        </button>
      </section>

      <section style={whySectionStyle}>
        <h2 style={whyTitleStyle}>Why Choose RentiGo?</h2>

        <div style={featuresStyle}>
          <div style={featureCardStyle}>
            <h3>💰 Affordable Prices</h3>
            <p>Best rental prices for bikes, scooters, cars and SUVs.</p>
          </div>

          <div style={featureCardStyle}>
            <h3>💳 Razorpay Payments</h3>
            <p>Secure online payment with real-time confirmation.</p>
          </div>

          <div style={featureCardStyle}>
            <h3>📄 Invoice Download</h3>
            <p>Download booking invoices directly from your account.</p>
          </div>

          <div style={featureCardStyle}>
            <h3>📅 Availability Calendar</h3>
            <p>Check booked and available dates before booking.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const heroSectionStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "40px",
  alignItems: "center",
  padding: "clamp(25px, 5vw, 60px)",
  background: "transparent",
};
const pageStyle = {
  minHeight: "100vh",
  background: `
    radial-gradient(circle at top left, #60a5fa33, transparent 30%),
    radial-gradient(circle at bottom right, #2563eb33, transparent 30%),
    linear-gradient(135deg, #f8fafc, #e0f2fe)
  `,
};
const heroContentStyle = {
  width: "100%",
};

const smallTitleStyle = {
  color: "#555",
  fontWeight: "700",
};

const heroTitleStyle = {
  fontSize: "clamp(32px, 5vw, 52px)",
  color: "#001b44",
  marginBottom: "20px",
  lineHeight: "1.2",
};

const heroTextStyle = {
  fontSize: "clamp(16px, 2vw, 18px)",
  color: "#555",
  lineHeight: "1.7",
};

const searchBoxStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "20px",
  marginTop: "30px",
  width: "100%",
  maxWidth: "650px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  boxSizing: "border-box",
};

const inputRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  marginTop: "15px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
};

const imageBoxStyle = {
  width: "100%",
  textAlign: "center",
};

const imageStyle = {
  width: "100%",
  maxWidth: "650px",
  borderRadius: "20px",
};

const statsSectionStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "20px",
  padding: "clamp(25px, 5vw, 50px)",
  background: "#fff",
};

const statCardStyle = {
  textAlign: "center",
  background: "#f8fafc",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const latestSectionStyle = {
  padding: "clamp(30px, 5vw, 60px)",
  background: "#f9fafb",
  textAlign: "center",
};

const sectionTitleStyle = {
  fontSize: "clamp(28px, 4vw, 38px)",
  marginBottom: "8px",
  color: "#111827",
};

const sectionSubTextStyle = {
  color: "#6b7280",
  marginBottom: "30px",
};

const vehicleGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "25px",
};

const vehicleCardStyle = {
  background: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
  textAlign: "left",
};

const vehicleImageStyle = {
  width: "100%",
  height: "210px",
  objectFit: "cover",
};

const vehicleContentStyle = {
  padding: "20px",
};

const priceStyle = {
  color: "#2563eb",
};

const viewBtnStyle = {
  width: "100%",
  marginTop: "15px",
  padding: "11px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const exploreBtnStyle = {
  marginTop: "30px",
  padding: "13px 22px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const whySectionStyle = {
  background: "#fff",
  padding: "clamp(30px, 5vw, 60px)",
  textAlign: "center",
};

const whyTitleStyle = {
  fontSize: "clamp(28px, 4vw, 36px)",
};

const featuresStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "25px",
  marginTop: "30px",
};

const featureCardStyle = {
  background: "#f8fafc",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
};

export default Home;

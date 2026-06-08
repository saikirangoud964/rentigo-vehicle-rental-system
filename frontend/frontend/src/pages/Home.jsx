import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("Hyderabad");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = () => {
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates");
      return;
    }

    navigate("/vehicles");
  };

  return (
    <div>
      <section style={heroSectionStyle}>
        <div style={heroContentStyle}>
          <h4 style={smallTitleStyle}>Vehicle Rentals</h4>

          <h1 style={heroTitleStyle}>Best Vehicle Rentals in Hyderabad</h1>

          <p style={heroTextStyle}>
            Rent Bikes, Scooters, Cars and SUVs at affordable prices.
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
                onChange={(e) => setPickupDate(e.target.value)}
                style={inputStyle}
              />

              <input
                type="date"
                value={returnDate}
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

      <section style={whySectionStyle}>
        <h2 style={whyTitleStyle}>Why Choose RentiGo?</h2>

        <div style={featuresStyle}>
          <div style={featureCardStyle}>
            <h3>Affordable Prices</h3>
            <p>Best rental prices in Hyderabad.</p>
          </div>

          <div style={featureCardStyle}>
            <h3>24/7 Support</h3>
            <p>Always available for assistance.</p>
          </div>

          <div style={featureCardStyle}>
            <h3>Wide Vehicle Range</h3>
            <p>Bikes, Cars and SUVs.</p>
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
  background: "#eef7f7",
};

const heroContentStyle = {
  width: "100%",
};

const smallTitleStyle = {
  color: "#555",
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
};

const searchBoxStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "20px",
  marginTop: "30px",
  width: "100%",
  maxWidth: "650px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
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

const whySectionStyle = {
  background: "#f8fafc",
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
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
};

export default Home;

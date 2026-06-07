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
      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "60px",
          background: "#eef7f7",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <h4 style={{ color: "#555" }}>Vehicle Rentals</h4>

          <h1
            style={{
              fontSize: "52px",
              color: "#001b44",
              marginBottom: "20px",
            }}
          >
            Best Vehicle Rentals in Hyderabad
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
            }}
          >
            Rent Bikes, Scooters, Cars and SUVs at affordable prices.
          </p>

          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "20px",
              marginTop: "30px",
              width: "100%",
              maxWidth: "650px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                style={{
                  flex: 1,
                  padding: "12px",
                }}
              />

              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                }}
              />

              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                }}
              />
            </div>

            <button
              onClick={handleSearch}
              style={{
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
              }}
            >
              Search Vehicles
            </button>
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200"
            alt="Vehicle Rental"
            style={{
              width: "100%",
              maxWidth: "650px",
              borderRadius: "20px",
            }}
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        style={{
          background: "#f8fafc",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <h2>Why Choose RentiGo?</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3>Affordable Prices</h3>
            <p>Best rental prices in Hyderabad.</p>
          </div>

          <div>
            <h3>24/7 Support</h3>
            <p>Always available for assistance.</p>
          </div>

          <div>
            <h3>Wide Vehicle Range</h3>
            <p>Bikes, Cars and SUVs.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

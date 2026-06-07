import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fuelFilter, setFuelFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const navigate = useNavigate();

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
      console.error("FETCH VEHICLES ERROR:", error);
      setVehicles([]);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name?.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;

    const matchesFuel = fuelFilter === "all" || vehicle.fuelType === fuelFilter;

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && vehicle.pricePerDay <= 1000) ||
      (priceFilter === "mid" &&
        vehicle.pricePerDay > 1000 &&
        vehicle.pricePerDay <= 3000) ||
      (priceFilter === "high" && vehicle.pricePerDay > 3000);

    return matchesSearch && matchesType && matchesFuel && matchesPrice;
  });

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Available Vehicles</h1>
        <p style={subtitleStyle}>
          Search and choose from bikes, scooters, cars and SUVs.
        </p>
      </div>

      <div style={filterBox}>
        <input
          type="text"
          placeholder="Search by name or brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Types</option>
          <option value="2W">2 Wheeler</option>
          <option value="4W">4 Wheeler</option>
        </select>

        <select
          value={fuelFilter}
          onChange={(e) => setFuelFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Fuel</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="CNG">CNG</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Prices</option>
          <option value="low">Under ₹1000/day</option>
          <option value="mid">₹1000 - ₹3000/day</option>
          <option value="high">Above ₹3000/day</option>
        </select>
      </div>

      {filteredVehicles.length === 0 ? (
        <div style={emptyBox}>
          <h2>No vehicles found</h2>
          <p>Try changing your search or filters.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle._id} style={cardStyle}>
              <img
                src={
                  vehicle.image?.startsWith("http")
                    ? vehicle.image
                    : "https://via.placeholder.com/400x250?text=Vehicle"
                }
                alt={vehicle.name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x250?text=Vehicle";
                }}
                style={imageStyle}
              />

              <div style={contentStyle}>
                <div style={topRow}>
                  <h3 style={vehicleNameStyle}>{vehicle.name}</h3>

                  <span
                    style={{
                      ...badgeStyle,
                      backgroundColor: vehicle.available ? "green" : "red",
                    }}
                  >
                    {vehicle.available ? "Available" : "Booked"}
                  </span>
                </div>

                <p style={brandStyle}>{vehicle.brand}</p>

                <div style={infoGrid}>
                  <p>
                    <strong>Type:</strong>{" "}
                    {vehicle.type === "2W" ? "2 Wheeler" : "4 Wheeler"}
                  </p>
                  <p>
                    <strong>Fuel:</strong> {vehicle.fuelType}
                  </p>
                </div>

                <h3 style={priceStyle}>₹{vehicle.pricePerDay}/day</h3>

                <button
                  onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                  disabled={!vehicle.available}
                  style={{
                    ...buttonStyle,
                    background: vehicle.available ? "#2563eb" : "#999",
                    cursor: vehicle.available ? "pointer" : "not-allowed",
                  }}
                >
                  {vehicle.available ? "View Details" : "Not Available"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  padding: "clamp(16px, 4vw, 40px)",
  background: "#f9fafb",
  minHeight: "80vh",
  boxSizing: "border-box",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "25px",
};

const titleStyle = {
  fontSize: "clamp(30px, 5vw, 44px)",
  color: "#111827",
  marginBottom: "8px",
};

const subtitleStyle = {
  color: "#6b7280",
  fontSize: "clamp(15px, 2vw, 18px)",
};

const filterBox = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "15px",
  margin: "30px auto",
  maxWidth: "1100px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "#fff",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "25px",
  marginTop: "30px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  border: "1px solid #e5e7eb",
};

const imageStyle = {
  width: "100%",
  height: "clamp(190px, 25vw, 240px)",
  objectFit: "cover",
};

const contentStyle = {
  padding: "20px",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const vehicleNameStyle = {
  margin: 0,
  fontSize: "clamp(20px, 3vw, 24px)",
};

const brandStyle = {
  color: "#6b7280",
  marginTop: "8px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "8px",
  color: "#374151",
};

const badgeStyle = {
  color: "white",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
};

const priceStyle = {
  color: "#2563eb",
  fontSize: "22px",
};

const buttonStyle = {
  width: "100%",
  color: "#fff",
  border: "none",
  padding: "12px 15px",
  borderRadius: "8px",
  fontWeight: "600",
};

const emptyBox = {
  background: "#fff",
  padding: "35px",
  textAlign: "center",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

export default VehiclesList;

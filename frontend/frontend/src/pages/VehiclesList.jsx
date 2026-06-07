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
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center" }}>Available Vehicles</h1>

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
        <p style={{ textAlign: "center" }}>No vehicles found</p>
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

              <div style={{ padding: "20px" }}>
                <div style={topRow}>
                  <h3>{vehicle.name}</h3>

                  <span
                    style={{
                      ...badgeStyle,
                      backgroundColor: vehicle.available ? "green" : "red",
                    }}
                  >
                    {vehicle.available ? "Available" : "Booked"}
                  </span>
                </div>

                <p>{vehicle.brand}</p>
                <p>Type: {vehicle.type}</p>
                <p>Fuel: {vehicle.fuelType}</p>

                <h3 style={{ color: "#2563eb" }}>₹{vehicle.pricePerDay}/day</h3>

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

const filterBox = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
  margin: "30px 0",
  justifyContent: "center",
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  minWidth: "200px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
  gap: "25px",
  marginTop: "30px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "center",
};

const badgeStyle = {
  color: "white",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
};

const buttonStyle = {
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
};

export default VehiclesList;

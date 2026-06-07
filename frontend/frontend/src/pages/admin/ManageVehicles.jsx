import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo?.token;
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://rentigo-vehicle-rental-system.onrender.com/api/vehicles",
      );

      setVehicles(data.vehicles || []);
    } catch (error) {
      console.log("FETCH VEHICLES ERROR:", error);
      alert("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmDelete) return;

    try {
      const token = getToken();

      await axios.delete(
        `https://rentigo-vehicle-rental-system.onrender.com/api/vehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Vehicle deleted successfully");
      fetchVehicles();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      `${vehicle.name} ${vehicle.brand} ${vehicle.vehicleNumber}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading vehicles...</h2>;
  }

  return (
    <div style={pageStyle}>
      <h1>🚗 Manage Vehicles</h1>
      <p style={{ color: "#6b7280", marginBottom: "25px" }}>
        View, search, edit and delete vehicles from the system.
      </p>

      <div style={statsContainer}>
        <div style={statsCard}>
          <h2>{vehicles.length}</h2>
          <p>Total Vehicles</p>
        </div>

        <div style={statsCard}>
          <h2>
            {
              vehicles.filter(
                (v) => v.available === true || v.available === undefined,
              ).length
            }
          </h2>
          <p>Available</p>
        </div>

        <div style={statsCard}>
          <h2>{vehicles.filter((v) => v.available === false).length}</h2>
          <p>Unavailable</p>
        </div>

        <div style={statsCard}>
          <h2>{vehicles.filter((v) => v.type === "2W").length}</h2>
          <p>2 Wheelers</p>
        </div>

        <div style={statsCard}>
          <h2>{vehicles.filter((v) => v.type === "4W").length}</h2>
          <p>4 Wheelers</p>
        </div>
      </div>

      <div style={filterBox}>
        <input
          type="text"
          placeholder="🔍 Search by name, brand, vehicle number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={selectInput}
        >
          <option value="all">All Types</option>
          <option value="2W">2 Wheeler</option>
          <option value="4W">4 Wheeler</option>
        </select>

        <Link to="/admin/add-vehicle">
          <button style={addBtn}>+ Add Vehicle</button>
        </Link>
      </div>

      {filteredVehicles.length === 0 ? (
        <div style={emptyCard}>
          <h3>No Vehicles Found</h3>
        </div>
      ) : (
        <div style={vehicleGrid}>
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle._id} style={cardStyle}>
              <img
                src={
                  vehicle.image ||
                  "https://via.placeholder.com/400x250?text=Vehicle"
                }
                alt={vehicle.name}
                style={imageStyle}
              />

              <div style={{ padding: "15px" }}>
                <h3>{vehicle.name}</h3>

                <p style={{ color: "#666" }}>
                  {vehicle.brand} {vehicle.model}
                </p>

                <p>
                  <strong>Vehicle No:</strong> {vehicle.vehicleNumber}
                </p>

                <p>
                  <strong>₹{vehicle.pricePerDay}</strong>/day
                </p>

                <div style={badgeBox}>
                  <span style={typeBadge}>
                    {vehicle.type === "2W" ? "2 Wheeler" : "4 Wheeler"}
                  </span>

                  <span style={typeBadge}>{vehicle.fuelType}</span>

                  <span style={typeBadge}>{vehicle.transmission}</span>
                </div>

                <span
                  style={{
                    ...statusBadge,
                    backgroundColor:
                      vehicle.available === false ? "#ef4444" : "#16a34a",
                  }}
                >
                  {vehicle.available === false ? "Unavailable" : "Available"}
                </span>

                <div style={{ marginTop: "15px" }}>
                  <Link to={`/admin/edit-vehicle/${vehicle._id}`}>
                    <button style={editBtn}>Edit Vehicle</button>
                  </Link>

                  <button
                    onClick={() => deleteVehicle(vehicle._id)}
                    style={deleteBtn}
                  >
                    Delete Vehicle
                  </button>
                </div>
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
  minHeight: "100vh",
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginTop: "20px",
  marginBottom: "25px",
};

const statsCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const filterBox = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "25px",
};

const searchInput = {
  width: "100%",
  maxWidth: "480px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const selectInput = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const addBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

const vehicleGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const imageStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
};

const badgeBox = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "12px",
};

const typeBadge = {
  background: "#eef2ff",
  color: "#2563eb",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
};

const statusBadge = {
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold",
};

const editBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
  marginBottom: "10px",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
};

const emptyCard = {
  background: "#fff",
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
};

export default ManageVehicles;

import { useNavigate } from "react-router-dom";

function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={vehicle.image}
        alt={vehicle.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />

      <h2>{vehicle.name}</h2>
      <p>{vehicle.type}</p>
      <h3>₹{vehicle.price}/day</h3>

      <button
        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        View Details
      </button>
    </div>
  );
}

export default VehicleCard;

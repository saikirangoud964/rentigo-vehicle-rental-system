import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    name: "",
    type: "4W",
    brand: "",
    model: "",
    fuelType: "Petrol",
    transmission: "Manual",
    pricePerDay: "",
    available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo?.token;
  };

  const fetchVehicle = async () => {
    try {
      const { data } = await axios.get(
        `https://rentigo-vehicle-rental-system.onrender.com/api/vehicles/${id}`,
      );

      const v = data.vehicle;

      setVehicle({
        vehicleNumber: v.vehicleNumber || "",
        name: v.name || "",
        type: v.type || "4W",
        brand: v.brand || "",
        model: v.model || "",
        fuelType: v.fuelType || "Petrol",
        transmission: v.transmission || "Manual",
        pricePerDay: v.pricePerDay || "",
        available: v.available ?? true,
      });

      setPreview(v.image || "");
    } catch (error) {
      console.error(error);
      alert("Failed to load vehicle");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setVehicle({
      ...vehicle,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be below 2MB");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      const formData = new FormData();

      Object.keys(vehicle).forEach((key) => {
        formData.append(key, vehicle[key]);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(
        `https://rentigo-vehicle-rental-system.onrender.com/api/vehicles/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Vehicle updated successfully");
      navigate("/admin/vehicles");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <h1>Edit Vehicle</h1>
      <p style={{ color: "#6b7280", marginBottom: "25px" }}>
        Update vehicle details, price, availability and image.
      </p>

      <div style={layoutStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            style={inputStyle}
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={vehicle.vehicleNumber}
            onChange={handleChange}
            required
          />

          <input
            style={inputStyle}
            type="text"
            name="name"
            placeholder="Vehicle Name"
            value={vehicle.name}
            onChange={handleChange}
            required
          />

          <select
            style={inputStyle}
            name="type"
            value={vehicle.type}
            onChange={handleChange}
          >
            <option value="2W">2 Wheeler</option>
            <option value="4W">4 Wheeler</option>
          </select>

          <input
            style={inputStyle}
            type="text"
            name="brand"
            placeholder="Brand"
            value={vehicle.brand}
            onChange={handleChange}
            required
          />

          <input
            style={inputStyle}
            type="text"
            name="model"
            placeholder="Model"
            value={vehicle.model}
            onChange={handleChange}
          />

          <select
            style={inputStyle}
            name="fuelType"
            value={vehicle.fuelType}
            onChange={handleChange}
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="CNG">CNG</option>
          </select>

          <select
            style={inputStyle}
            name="transmission"
            value={vehicle.transmission}
            onChange={handleChange}
          >
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <input
            style={inputStyle}
            type="number"
            name="pricePerDay"
            placeholder="Price Per Day"
            value={vehicle.pricePerDay}
            onChange={handleChange}
            required
          />

          <label style={checkboxBox}>
            <input
              type="checkbox"
              name="available"
              checked={vehicle.available}
              onChange={handleChange}
            />
            Vehicle Available
          </label>

          <input
            style={inputStyle}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Updating..." : "Update Vehicle"}
          </button>
        </form>

        <div style={previewCard}>
          <h3>Vehicle Preview</h3>

          <img
            src={
              preview ||
              "https://via.placeholder.com/500x300?text=Vehicle+Preview"
            }
            alt="Preview"
            style={previewImage}
          />

          <h2>{vehicle.name || "Vehicle Name"}</h2>
          <p>
            {vehicle.brand || "Brand"} {vehicle.model || ""}
          </p>

          <div style={badgeBox}>
            <span style={badge}>
              {vehicle.type === "2W" ? "2 Wheeler" : "4 Wheeler"}
            </span>
            <span style={badge}>{vehicle.fuelType}</span>
            <span style={badge}>{vehicle.transmission}</span>
            <span
              style={{
                ...badge,
                background: vehicle.available ? "#dcfce7" : "#fee2e2",
                color: vehicle.available ? "#16a34a" : "#dc2626",
              }}
            >
              {vehicle.available ? "Available" : "Unavailable"}
            </span>
          </div>

          <h2 style={{ color: "#2563eb" }}>₹{vehicle.pricePerDay || 0}/day</h2>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  background: "#f9fafb",
  minHeight: "100vh",
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "30px",
  alignItems: "start",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const checkboxBox = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  background: "#f3f4f6",
  padding: "12px",
  borderRadius: "8px",
};

const buttonStyle = {
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const previewCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const previewImage = {
  width: "100%",
  height: "300px",
  objectFit: "cover",
  borderRadius: "14px",
  marginBottom: "15px",
};

const badgeBox = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  margin: "15px 0",
};

const badge = {
  background: "#eef2ff",
  color: "#2563eb",
  padding: "8px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
};

export default EditVehicle;

import { useState } from "react";
import axios from "axios";

function AddVehicle() {
  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    name: "",
    type: "4W",
    brand: "",
    model: "",
    fuelType: "Petrol",
    transmission: "Manual",
    pricePerDay: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value,
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

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo?.token;
  };

  const resetForm = () => {
    setVehicle({
      vehicleNumber: "",
      name: "",
      type: "4W",
      brand: "",
      model: "",
      fuelType: "Petrol",
      transmission: "Manual",
      pricePerDay: "",
    });

    setImageFile(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        alert("Please login again");
        return;
      }

      const formData = new FormData();

      Object.keys(vehicle).forEach((key) => {
        formData.append(key, vehicle[key]);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post(
        "https://rentigo-vehicle-rental-system.onrender.com/api/vehicles",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Vehicle Added Successfully");
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Add Vehicle</h1>

      <p style={subtitleStyle}>
        Add a new vehicle with details and image upload.
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

          <input
            style={inputStyle}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Adding Vehicle..." : "Add Vehicle"}
          </button>
        </form>

        <div style={previewCard}>
          <h3 style={previewTitleStyle}>Vehicle Preview</h3>

          <img
            src={
              preview ||
              "https://via.placeholder.com/500x300?text=Vehicle+Preview"
            }
            alt="Preview"
            style={previewImage}
          />

          <h2 style={vehicleNameStyle}>{vehicle.name || "Vehicle Name"}</h2>

          <p style={brandStyle}>
            {vehicle.brand || "Brand"} {vehicle.model || ""}
          </p>

          <div style={badgeBox}>
            <span style={badge}>
              {vehicle.type === "2W" ? "2 Wheeler" : "4 Wheeler"}
            </span>

            <span style={badge}>{vehicle.fuelType}</span>

            <span style={badge}>{vehicle.transmission}</span>
          </div>

          <h2 style={priceStyle}>₹{vehicle.pricePerDay || 0}/day</h2>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "clamp(16px, 4vw, 30px)",
  background: "#f9fafb",
  minHeight: "100vh",
  boxSizing: "border-box",
};

const titleStyle = {
  fontSize: "clamp(30px, 5vw, 42px)",
  color: "#111827",
  marginBottom: "8px",
};

const subtitleStyle = {
  color: "#6b7280",
  marginBottom: "25px",
  fontSize: "clamp(15px, 2vw, 17px)",
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "30px",
  alignItems: "start",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  background: "#fff",
  padding: "clamp(18px, 3vw, 25px)",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  boxSizing: "border-box",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "13px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

const previewCard = {
  background: "#fff",
  padding: "clamp(18px, 3vw, 25px)",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  boxSizing: "border-box",
};

const previewTitleStyle = {
  marginTop: 0,
};

const previewImage = {
  width: "100%",
  height: "clamp(220px, 35vw, 300px)",
  objectFit: "cover",
  borderRadius: "14px",
  marginBottom: "15px",
};

const vehicleNameStyle = {
  fontSize: "clamp(24px, 4vw, 32px)",
  marginBottom: "8px",
  color: "#111827",
  wordBreak: "break-word",
};

const brandStyle = {
  color: "#6b7280",
  wordBreak: "break-word",
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

const priceStyle = {
  color: "#2563eb",
  fontSize: "clamp(24px, 4vw, 32px)",
};

export default AddVehicle;

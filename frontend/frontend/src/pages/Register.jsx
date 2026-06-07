import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 5) {
      alert("Password must be at least 5 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://rentigo-vehicle-rental-system.onrender.com/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      );

      const userInfo = {
        _id: data._id || data.user?._id,
        name: data.name || data.user?.name,
        email: data.email || data.user?.email,
        role: data.role || data.user?.role,
        token: data.token,
      };

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("token", data.token);

      if (login) {
        login(userInfo);
      }

      alert("Registration successful 🎉");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={leftBoxStyle}>
        <h1 style={heroTitle}>Join RentiGo 🚗</h1>

        <p style={heroText}>
          Create your account and book bikes, scooters, cars, and SUVs easily.
        </p>

        <div style={featureBox}>
          <p>✅ Easy vehicle booking</p>
          <p>✅ Dummy payment support</p>
          <p>✅ Invoice download</p>
          <p>✅ Track your bookings</p>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={titleStyle}>Create Account</h2>

        <p style={subtitleStyle}>Register to start your rental journey</p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>

          <div style={passwordBoxStyle}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
              style={passwordInputStyle}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={showBtnStyle}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label style={labelStyle}>Confirm Password</label>

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={loginTextStyle}>
          Already have an account?{" "}
          <Link to="/login" style={loginLinkStyle}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "calc(100vh - 90px)",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "clamp(25px, 5vw, 40px)",
  alignItems: "center",
  padding: "clamp(20px, 5vw, 50px)",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
  boxSizing: "border-box",
};

const leftBoxStyle = {
  padding: "clamp(10px, 3vw, 30px)",
};

const heroTitle = {
  fontSize: "clamp(32px, 5vw, 48px)",
  color: "#111827",
  marginBottom: "15px",
  lineHeight: "1.2",
};

const heroText = {
  fontSize: "clamp(16px, 2vw, 20px)",
  color: "#4b5563",
  lineHeight: "1.6",
  maxWidth: "520px",
};

const featureBox = {
  marginTop: "30px",
  background: "white",
  padding: "clamp(18px, 3vw, 25px)",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  fontSize: "clamp(15px, 2vw, 17px)",
  color: "#111827",
  maxWidth: "420px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "440px",
  background: "#fff",
  padding: "clamp(24px, 4vw, 35px)",
  borderRadius: "20px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  justifySelf: "center",
  boxSizing: "border-box",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "clamp(26px, 4vw, 30px)",
  marginBottom: "8px",
  color: "#111827",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#6b7280",
  marginBottom: "25px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "16px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const passwordBoxStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  marginBottom: "16px",
  overflow: "hidden",
};

const passwordInputStyle = {
  flex: 1,
  padding: "13px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  minWidth: 0,
};

const showBtnStyle = {
  padding: "13px",
  border: "none",
  background: "#f3f4f6",
  cursor: "pointer",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "5px",
};

const loginTextStyle = {
  textAlign: "center",
  marginTop: "20px",
  color: "#6b7280",
};

const loginLinkStyle = {
  color: "#2563eb",
  fontWeight: "bold",
  textDecoration: "none",
};

export default Register;

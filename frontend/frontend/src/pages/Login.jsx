import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://rentigo-vehicle-rental-system.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      const userInfo = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
      };

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("token", data.token);

      if (login) {
        login(userInfo);
      }

      alert("Login Successful 🎉");

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* Left Section */}
      <div style={leftBoxStyle}>
        <h1 style={heroTitle}>Welcome Back 👋</h1>

        <p style={heroText}>
          Login to your RentiGo account and continue booking your favorite
          vehicles.
        </p>

        <div style={featureBox}>
          <p>🚗 Book cars, bikes, scooters, and SUVs</p>
          <p>💳 Secure payment experience</p>
          <p>📄 Download booking invoices</p>
          <p>📊 Track all your bookings easily</p>
        </div>
      </div>

      {/* Login Card */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>Login 🔐</h2>

        <p style={subtitleStyle}>Access your RentiGo account</p>

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div style={forgotContainerStyle}>
            <Link to="/forgot-password" style={forgotLinkStyle}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={registerTextStyle}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={registerLinkStyle}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "calc(100vh - 90px)",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "40px",
  alignItems: "center",
  padding: "50px",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
};

const leftBoxStyle = {
  padding: "30px",
};

const heroTitle = {
  fontSize: "48px",
  color: "#111827",
  marginBottom: "15px",
};

const heroText = {
  fontSize: "20px",
  color: "#4b5563",
  lineHeight: "1.6",
  maxWidth: "520px",
};

const featureBox = {
  marginTop: "30px",
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  fontSize: "17px",
  color: "#111827",
  maxWidth: "420px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "440px",
  background: "#fff",
  padding: "35px",
  borderRadius: "20px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  justifySelf: "center",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "30px",
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
  overflow: "hidden",
};

const passwordInputStyle = {
  flex: 1,
  padding: "13px",
  border: "none",
  outline: "none",
  fontSize: "15px",
};

const showBtnStyle = {
  padding: "13px",
  border: "none",
  background: "#f3f4f6",
  cursor: "pointer",
  fontWeight: "600",
};

const forgotContainerStyle = {
  textAlign: "right",
  marginTop: "10px",
  marginBottom: "20px",
};

const forgotLinkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "600",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};

const registerTextStyle = {
  textAlign: "center",
  marginTop: "20px",
  color: "#6b7280",
};

const registerLinkStyle = {
  color: "#2563eb",
  fontWeight: "bold",
  textDecoration: "none",
};

export default Login;

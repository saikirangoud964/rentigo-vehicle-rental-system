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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      if (login) login(userInfo);

      alert("Login Successful 🎉");

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={leftBoxStyle}>
        <span style={badgeStyle}>🚗 RentiGo Rental Platform</span>

        <h1 style={heroTitle}>
          Welcome Back to <br />
          <span style={highlightText}>RentiGo</span>
        </h1>

        <p style={heroText}>
          Continue your journey with smart vehicle rentals, secure payments,
          booking tracking and instant invoices.
        </p>

        <div style={statsGrid}>
          <div style={statCard}>
            <h2>500+</h2>
            <p>Vehicles</p>
          </div>

          <div style={statCard}>
            <h2>10K+</h2>
            <p>Bookings</p>
          </div>

          <div style={statCard}>
            <h2>4.9★</h2>
            <p>Rating</p>
          </div>

          <div style={statCard}>
            <h2>24/7</h2>
            <p>Support</p>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={iconStyle}>🔐</div>

        <h2 style={titleStyle}>Login</h2>
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

const pageStyle = {
  minHeight: "calc(100vh - 70px)",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "35px",
  alignItems: "center",
  padding: "35px 60px",
  background: "linear-gradient(135deg, #020617, #0f172a 45%, #1e3a8a)",
  boxSizing: "border-box",
};

const leftBoxStyle = {
  color: "#fff",
};

const badgeStyle = {
  display: "inline-block",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.22)",
  color: "#dbeafe",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "700",
  marginBottom: "18px",
};

const heroTitle = {
  fontSize: "clamp(38px, 5vw, 62px)",
  color: "#fff",
  marginBottom: "16px",
  lineHeight: "1.05",
};

const highlightText = {
  color: "#60a5fa",
};

const heroText = {
  fontSize: "18px",
  color: "#cbd5e1",
  lineHeight: "1.6",
  maxWidth: "620px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px",
  marginTop: "30px",
  maxWidth: "560px",
};

const statCard = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.18)",
  padding: "20px",
  borderRadius: "18px",
  textAlign: "center",
  boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
};

const cardStyle = {
  width: "100%",
  maxWidth: "460px",
  background: "rgba(255,255,255,0.96)",
  padding: "34px",
  borderRadius: "26px",
  boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
  justifySelf: "center",
  boxSizing: "border-box",
};

const iconStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #2563eb, #06b6d4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  margin: "0 auto 15px",
  color: "#fff",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "32px",
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
  fontWeight: "700",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  background: "#f8fafc",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const passwordBoxStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  overflow: "hidden",
  background: "#f8fafc",
};

const passwordInputStyle = {
  flex: 1,
  padding: "14px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  minWidth: 0,
  background: "transparent",
};

const showBtnStyle = {
  padding: "14px",
  border: "none",
  background: "#e5e7eb",
  cursor: "pointer",
  fontWeight: "700",
};

const forgotContainerStyle = {
  textAlign: "right",
  marginTop: "10px",
  marginBottom: "20px",
};

const forgotLinkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "700",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  background: "linear-gradient(135deg, #2563eb, #111827)",
  color: "#fff",
};

const registerTextStyle = {
  textAlign: "center",
  marginTop: "22px",
  color: "#6b7280",
};

const registerLinkStyle = {
  color: "#2563eb",
  fontWeight: "bold",
  textDecoration: "none",
};

export default Login;

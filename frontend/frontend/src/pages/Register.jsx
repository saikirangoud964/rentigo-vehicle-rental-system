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

  const passwordStrength =
    formData.password.length >= 8
      ? "Strong"
      : formData.password.length >= 5
        ? "Medium"
        : "Weak";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      if (login) login(userInfo);

      alert("Registration successful 🎉");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={leftBoxStyle}>
        <span style={badgeStyle}>🚗 RentiGo Rental Platform</span>

        <h1 style={heroTitle}>Start your rental journey today</h1>

        <p style={heroText}>
          Create your RentiGo account to book bikes, scooters, cars and SUVs
          with secure payments, invoices and real-time booking tracking.
        </p>

        <div style={featureGrid}>
          <div style={featureCard}>
            <h3>🚘 Easy Booking</h3>
            <p>Book your favourite vehicle in a few clicks.</p>
          </div>

          <div style={featureCard}>
            <h3>💳 Razorpay Payment</h3>
            <p>Fast and secure online payment support.</p>
          </div>

          <div style={featureCard}>
            <h3>📄 Invoice Ready</h3>
            <p>Download invoices anytime.</p>
          </div>

          <div style={featureCard}>
            <h3>📊 Track Trips</h3>
            <p>Manage all bookings from your dashboard.</p>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={cardTopIcon}>R</div>

        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Register to access RentiGo</p>

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

          {formData.password && (
            <div style={strengthBox}>
              <span>Password Strength:</span>
              <strong
                style={{
                  color:
                    passwordStrength === "Strong"
                      ? "#16a34a"
                      : passwordStrength === "Medium"
                        ? "#f59e0b"
                        : "#dc2626",
                }}
              >
                {passwordStrength}
              </strong>
            </div>
          )}

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
  minHeight: "calc(100vh - 70px)",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "35px",
  alignItems: "center",
  padding: "28px 60px",
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
  fontSize: "clamp(34px, 4vw, 54px)",
  color: "#fff",
  marginBottom: "14px",
  lineHeight: "1.05",
  maxWidth: "620px",
};

const heroText = {
  fontSize: "17px",
  color: "#cbd5e1",
  lineHeight: "1.5",
  maxWidth: "600px",
};

const featureGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "14px",
  marginTop: "24px",
  maxWidth: "620px",
};

const featureCard = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.18)",
  padding: "14px 16px",
  borderRadius: "16px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
};

const cardStyle = {
  width: "100%",
  maxWidth: "430px",
  background: "rgba(255,255,255,0.96)",
  padding: "24px 34px",
  borderRadius: "24px",
  boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
  justifySelf: "center",
  boxSizing: "border-box",
};

const cardTopIcon = {
  width: "46px",
  height: "46px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #2563eb, #06b6d4)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  fontSize: "22px",
  margin: "0 auto 12px",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "30px",
  marginBottom: "6px",
  color: "#111827",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#6b7280",
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "700",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "11px 13px",
  marginBottom: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  background: "#f9fafb",
};

const passwordBoxStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  marginBottom: "10px",
  overflow: "hidden",
  background: "#f9fafb",
};

const passwordInputStyle = {
  flex: 1,
  padding: "11px 13px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  minWidth: 0,
  background: "transparent",
};

const showBtnStyle = {
  padding: "11px 13px",
  border: "none",
  background: "#e5e7eb",
  cursor: "pointer",
  fontWeight: "700",
};

const strengthBox = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  fontSize: "14px",
  color: "#6b7280",
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "linear-gradient(135deg, #2563eb, #111827)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "3px",
};

const loginTextStyle = {
  textAlign: "center",
  marginTop: "16px",
  color: "#6b7280",
};

const loginLinkStyle = {
  color: "#2563eb",
  fontWeight: "bold",
  textDecoration: "none",
};

export default Register;

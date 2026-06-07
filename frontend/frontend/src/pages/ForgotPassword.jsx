import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://rentigo-vehicle-rental-system.onrender.com/api/auth/forgot-password",
        { email },
      );

      console.log("SUCCESS:", data);

      localStorage.setItem("resetEmail", email);

      alert("OTP sent to your email");
      navigate("/verify-otp");
    } catch (error) {
      console.log("OTP ERROR:", error.response?.data || error.message || error);

      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Forgot Password 🔐</h2>

        <p style={subtitleStyle}>Enter your registered email to receive OTP.</p>

        <form onSubmit={sendOTP}>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p style={backTextStyle}>
          Remember password?{" "}
          <Link to="/login" style={linkStyle}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "calc(100vh - 90px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
  padding: "30px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "35px",
  background: "#fff",
  borderRadius: "18px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "30px",
  marginBottom: "10px",
  color: "#111827",
};

const subtitleStyle = {
  color: "#6b7280",
  marginBottom: "25px",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};

const backTextStyle = {
  marginTop: "20px",
  color: "#6b7280",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "bold",
};

export default ForgotPassword;

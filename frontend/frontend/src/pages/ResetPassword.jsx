import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("resetEmail");
  const otp = localStorage.getItem("resetOTP");

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      alert("Reset session expired. Please try again.");
      navigate("/forgot-password");
      return;
    }

    if (newPassword.length < 5) {
      alert("Password must be at least 5 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://rentigo-vehicle-rental-system.onrender.com/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        },
      );

      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOTP");

      alert("Password reset successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Reset Password 🔑</h2>

        <p style={subtitleStyle}>Create a new password for your account.</p>

        <form onSubmit={resetPassword}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button disabled={loading} style={btnStyle}>
            {loading ? "Resetting..." : "Reset Password"}
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
  padding: "clamp(16px, 5vw, 30px)",
  boxSizing: "border-box",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "clamp(24px, 5vw, 35px)",
  background: "#fff",
  borderRadius: "18px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  textAlign: "center",
  boxSizing: "border-box",
};

const titleStyle = {
  fontSize: "clamp(26px, 5vw, 30px)",
  marginBottom: "10px",
  color: "#111827",
};

const subtitleStyle = {
  color: "#6b7280",
  marginBottom: "25px",
  fontSize: "clamp(15px, 2vw, 16px)",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "16px",
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
  fontSize: "15px",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "bold",
};

export default ResetPassword;

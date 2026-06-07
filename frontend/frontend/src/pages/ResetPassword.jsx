import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div style={cardStyle}>
      <h2>Reset Password 🔑</h2>

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
    </div>
  );
}

const cardStyle = {
  maxWidth: "420px",
  margin: "80px auto",
  padding: "30px",
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "12px 0",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default ResetPassword;

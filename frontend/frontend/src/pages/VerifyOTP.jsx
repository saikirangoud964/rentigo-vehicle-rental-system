import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("resetEmail");

  const verifyOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email not found. Please try again.");
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://rentigo-vehicle-rental-system.onrender.com/api/auth/verify-otp",
        { email, otp },
      );

      localStorage.setItem("resetOTP", otp);

      alert("OTP verified successfully");
      navigate("/reset-password");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2>Verify OTP 📩</h2>
      <p>OTP sent to: {email}</p>

      <form onSubmit={verifyOTP}>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={inputStyle}
        />

        <button disabled={loading} style={btnStyle}>
          {loading ? "Verifying..." : "Verify OTP"}
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
  margin: "20px 0",
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

export default VerifyOTP;

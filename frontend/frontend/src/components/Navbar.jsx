import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <h2>RentiGo 🚗</h2>

      <div style={linkBoxStyle}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/vehicles" style={linkStyle}>
          Vehicles
        </Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" style={linkStyle}>
                Admin
              </Link>
            )}

            <Link to="/my-bookings" style={linkStyle}>
              My Bookings
            </Link>
            <Link to="/profile" style={linkStyle}>
              Profile
            </Link>

            <button onClick={handleLogout} style={logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navStyle = {
  padding: "15px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#111827",
  color: "white",
};

const linkBoxStyle = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
};

const logoutBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Navbar;

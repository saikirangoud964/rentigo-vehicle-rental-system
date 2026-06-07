import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);

      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  const closeMenu = () => setOpen(false);

  return (
    <nav style={navStyle}>
      <div style={topBarStyle}>
        <h2 style={logoStyle}>RentiGo 🚗</h2>

        {isMobile && (
          <button onClick={() => setOpen(!open)} style={menuBtnStyle}>
            {open ? "✖" : "☰"}
          </button>
        )}
      </div>

      {(!isMobile || open) && (
        <div style={isMobile ? mobileLinkBoxStyle : linkBoxStyle}>
          <Link to="/" style={linkStyle} onClick={closeMenu}>
            Home
          </Link>

          <Link to="/vehicles" style={linkStyle} onClick={closeMenu}>
            Vehicles
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" style={linkStyle} onClick={closeMenu}>
                  Admin
                </Link>
              )}

              <Link to="/my-bookings" style={linkStyle} onClick={closeMenu}>
                My Bookings
              </Link>

              <Link to="/profile" style={linkStyle} onClick={closeMenu}>
                Profile
              </Link>

              <button onClick={handleLogout} style={logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle} onClick={closeMenu}>
                Login
              </Link>

              <Link to="/register" style={linkStyle} onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const navStyle = {
  padding: "15px 30px",
  background: "#111827",
  color: "white",
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle = {
  margin: 0,
};

const linkBoxStyle = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
  justifyContent: "flex-end",
  marginTop: "-25px",
};

const mobileLinkBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  alignItems: "center",
  marginTop: "20px",
  paddingBottom: "10px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
};

const menuBtnStyle = {
  background: "transparent",
  color: "white",
  border: "none",
  fontSize: "28px",
  cursor: "pointer",
};

const logoutBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "9px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Navbar;

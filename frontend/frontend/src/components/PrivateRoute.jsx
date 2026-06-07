import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return userInfo ? children : <Navigate to="/login" />;
}

export default PrivateRoute;

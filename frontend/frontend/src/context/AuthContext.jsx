import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let storedUser = null;

  try {
    storedUser = JSON.parse(localStorage.getItem("userInfo"));
  } catch (error) {
    storedUser = null;
  }

  const [user, setUser] = useState(storedUser);

  const login = (data) => {
    setUser(data);

    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("userInfo");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

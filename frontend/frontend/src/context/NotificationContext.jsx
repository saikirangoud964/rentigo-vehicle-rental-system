import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background:
              notification.type === "success"
                ? "#16a34a"
                : notification.type === "error"
                  ? "#dc2626"
                  : "#2563eb",
            color: "white",
            padding: "12px 18px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

import { createContext, useContext, useEffect, useState } from "react";
import NotificationPopup from "../components/NotificationPopup";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => {
            setNotification(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification]);

    const showNotification = (data) => {
        setNotification(data);
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            <NotificationPopup
                notification={notification}
                onClose={closeNotification}
            />
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
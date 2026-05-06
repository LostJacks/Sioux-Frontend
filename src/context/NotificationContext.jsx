import { createContext, useContext, useEffect, useState } from "react";
import NotificationPopup from "../components/NotificationPopup";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [notificationHistory, setNotificationHistory] = useState([]);

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => {
            setNotification(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification]);

    const showNotification = (data) => {
        const newNotification = {
            ...data,
            id: Date.now(),
            createdAt: data.createdAt || new Date().toISOString()
        };

        setNotification(newNotification);

        setNotificationHistory((prev) => [
            newNotification,
            ...prev
        ]);
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider
            value={{ showNotification, notificationHistory }}
        >
            <NotificationPopup
                notification={notification}
                onClose={closeNotification}
            />
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
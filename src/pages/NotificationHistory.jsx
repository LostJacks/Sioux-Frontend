import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/NotificationHistory.css";

const NotificationHistory = ({ currentRole, setCurrentRole }) => {
    const notifications = [
        {
            id: 1,
            title: "Package ready for pickup",
            message: "Your package is ready at the reception desk.",
            date: "17 Apr 2026",
            time: "10:30",
            type: "info"
        },
        {
            id: 2,
            title: "Package received",
            message: "A new package has been registered for you.",
            date: "16 Apr 2026",
            time: "14:10",
            type: "success"
        },
        {
            id: 3,
            title: "Reminder",
            message: "Please pick up your package before the end of the day.",
            date: "15 Apr 2026",
            time: "09:00",
            type: "warning"
        },
        {
            id: 4,
            title: "Package delayed",
            message: "Your package delivery has been delayed by one day.",
            date: "14 Apr 2026",
            time: "11:20",
            type: "warning"
        },
        {
            id: 5,
            title: "Pickup confirmed",
            message: "Your package pickup has been confirmed successfully.",
            date: "13 Apr 2026",
            time: "16:45",
            type: "success"
        }
    ];

    const [selectedFilter, setSelectedFilter] = useState("all");

    const filteredNotifications =
        selectedFilter === "all"
            ? notifications
            : notifications.filter(
                (notification) => notification.type === selectedFilter
            );

    return (
        <div className="dashboard">
            <Sidebar
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
            />

            <main className="notification-history-page">
                <div className="notification-history-header">
                    <div>
                        <p className="notification-history-eyebrow">Employee Portal</p>
                        <h1>Notification History</h1>
                        <p className="notification-history-subtitle">
                            View all notifications you have received, sorted from latest to oldest.
                        </p>
                    </div>

                    <div className="notification-history-summary">
                        <span className="summary-label">Showing</span>
                        <span className="summary-value">{filteredNotifications.length}</span>
                    </div>
                </div>

                <div className="notification-filters">
                    <button
                        className={selectedFilter === "all" ? "filter-button active" : "filter-button"}
                        onClick={() => setSelectedFilter("all")}
                    >
                        All
                    </button>
                    <button
                        className={selectedFilter === "info" ? "filter-button active" : "filter-button"}
                        onClick={() => setSelectedFilter("info")}
                    >
                        Info
                    </button>
                    <button
                        className={selectedFilter === "success" ? "filter-button active" : "filter-button"}
                        onClick={() => setSelectedFilter("success")}
                    >
                        Success
                    </button>
                    <button
                        className={selectedFilter === "warning" ? "filter-button active" : "filter-button"}
                        onClick={() => setSelectedFilter("warning")}
                    >
                        Warning
                    </button>
                </div>

                <div className="notification-history-list">
                    {filteredNotifications.length === 0 ? (
                        <div className="empty-state">
                            <h3>No notifications found</h3>
                            <p>There are no notifications for this filter yet.</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-history-card ${notification.type}`}
                            >
                                <div className="notification-accent"></div>

                                <div className="notification-card-content">
                                    <div className="notification-history-card-top">
                                        <div className="notification-title-group">
                                            <h3>{notification.title}</h3>
                                            <span className={`notification-badge ${notification.type}`}>
                                                {notification.type}
                                            </span>
                                        </div>

                                        <div className="notification-date-group">
                                            <span className="notification-date">{notification.date}</span>
                                            <span className="notification-time">{notification.time}</span>
                                        </div>
                                    </div>

                                    <p>{notification.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default NotificationHistory;
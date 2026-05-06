import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNotification } from "../context/NotificationContext";
import "../styles/NotificationHistory.css";

const NotificationHistory = ({ currentRole, setCurrentRole }) => {
    const { notificationHistory } = useNotification();
    const [selectedFilter, setSelectedFilter] = useState("all");

    const formatDate = (dateString) => {
        if (!dateString) return "";

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date(dateString));
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";

        return new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(dateString));
    };

    const filteredNotifications =
        selectedFilter === "all"
            ? notificationHistory
            : notificationHistory.filter(
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
                                className={`notification-history-card ${notification.type || "info"}`}
                            >
                                <div className="notification-accent"></div>

                                <div className="notification-card-content">
                                    <div className="notification-history-card-top">
                                        <div className="notification-title-group">
                                            <h3>{notification.title}</h3>
                                            <span className={`notification-badge ${notification.type || "info"}`}>
                                                {notification.type || "info"}
                                            </span>
                                        </div>

                                        <div className="notification-date-group">
                                            <span className="notification-date">
                                                {formatDate(notification.createdAt)}
                                            </span>
                                            <span className="notification-time">
                                                {formatTime(notification.createdAt)}
                                            </span>
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
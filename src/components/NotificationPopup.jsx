const NotificationPopup = ({ notification, onClose }) => {
    if (!notification) return null;

    const formatDateTime = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    };

    return (
        <div className="notification-popup">
            <button className="notification-close" onClick={onClose}>
                ×
            </button>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <small>{formatDateTime(notification.createdAt)}</small>
        </div>
    );
};

export default NotificationPopup;
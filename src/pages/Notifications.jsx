import { useEffect, useMemo, useState } from "react";
import "../styles/notifications.css";
import Sidebar from "../components/Sidebar";
import { useNotification } from "../hooks/useNotification";
import { listGlobalForManager } from "../services/NotificationApi";

const TABS = {
    MINE: "mine",
    GLOBAL: "global"
};

const INITIAL_GLOBAL_STATE = { status: "idle", list: [], error: null };

const formatDateTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
};

const NotificationRow = ({ notification, onSelect }) => {
    const isGlobal = notification.scope === "GLOBAL";
    const isUnread = !notification.read;

    return (
        <div
            className={`notification-row${isUnread ? " unread" : ""}`}
            onClick={() => onSelect(notification)}
        >
            <div className="notification-row-top">
                <h3 className="notification-row-title">{notification.title}</h3>
                <span className="notification-row-time">
                    {formatDateTime(notification.createdAt)}
                </span>
            </div>

            <p className="notification-row-message">{notification.message}</p>

            <div className="notification-row-meta">
                <span className={`notification-tag ${isGlobal ? "global" : "personal"}`}>
                    {isGlobal ? "Global" : "Personal"}
                </span>
                {notification.type && (
                    <span className="notification-tag">
                        {notification.type.replace(/_/g, " ").toLowerCase()}
                    </span>
                )}
                {isUnread && (
                    <span className="notification-tag unread-dot">unread</span>
                )}
            </div>
        </div>
    );
};

const Notifications = ({ currentRole, setCurrentRole }) => {
    const { notifications, refresh, markRead, userId } = useNotification();

    const [activeTab, setActiveTab] = useState(TABS.MINE);
    const [globalState, setGlobalState] = useState(INITIAL_GLOBAL_STATE);

    const isManager = currentRole === "manager";

    const effectiveTab =
        !isManager && activeTab === TABS.GLOBAL ? TABS.MINE : activeTab;

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (effectiveTab !== TABS.GLOBAL || !isManager) return undefined;

        let cancelled = false;
        listGlobalForManager(userId)
            .then((list) => {
                if (cancelled) return;
                setGlobalState({
                    status: "ready",
                    list: Array.isArray(list) ? list : [],
                    error: null
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setGlobalState({
                    status: "error",
                    list: [],
                    error: err.message || "Failed to load"
                });
            });

        return () => {
            cancelled = true;
        };
    }, [effectiveTab, isManager, userId]);

    const personalList = useMemo(
        () => (Array.isArray(notifications) ? notifications : []),
        [notifications]
    );

    const handleSelect = (notification) => {
        if (!notification || !notification.id || notification.read) return;
        markRead(notification.id);
    };

    const loadingGlobal =
        effectiveTab === TABS.GLOBAL && globalState.status === "idle";
    const globalError = globalState.error;

    const visible =
        effectiveTab === TABS.GLOBAL ? globalState.list : personalList;

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} />

            <main className="notifications-content">
                <div className="notifications-header">
                    <h1>Notifications</h1>
                    <span className="notifications-meta">
                        {personalList.length} in your feed
                    </span>
                </div>

                <div className="notifications-tabs">
                    <button
                        type="button"
                        className={`notifications-tab${effectiveTab === TABS.MINE ? " active" : ""}`}
                        onClick={() => setActiveTab(TABS.MINE)}
                    >
                        Mine
                    </button>

                    {isManager && (
                        <button
                            type="button"
                            className={`notifications-tab${effectiveTab === TABS.GLOBAL ? " active" : ""}`}
                            onClick={() => {
                                setActiveTab(TABS.GLOBAL);
                                setGlobalState(INITIAL_GLOBAL_STATE);
                            }}
                        >
                            Global (Sioux)
                        </button>
                    )}
                </div>

                {effectiveTab === TABS.GLOBAL && globalError && (
                    <div className="notifications-error">
                        Could not load global feed: {globalError}
                    </div>
                )}

                {effectiveTab === TABS.GLOBAL && loadingGlobal && (
                    <div className="notifications-empty">Loading...</div>
                )}

                {visible.length === 0 ? (
                    <div className="notifications-empty">
                        {effectiveTab === TABS.GLOBAL
                            ? "No company-addressed packages right now."
                            : "You have no notifications yet."}
                    </div>
                ) : (
                    <div className="notifications-list">
                        {visible.map((n) => (
                            <NotificationRow
                                key={n.id}
                                notification={n}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Notifications;

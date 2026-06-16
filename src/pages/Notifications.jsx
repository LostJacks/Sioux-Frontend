import { useEffect, useMemo, useState } from "react";
import "../styles/NotificationHistory.css";
import Sidebar from "../components/Sidebar";
import { useNotification } from "../hooks/useNotification";
import { listGlobalForManager } from "../services/NotificationApi";

const SCOPE_FILTERS = {
    ALL: "all",
    MINE: "mine",
    GLOBAL: "global"
};

const TYPE_FILTERS = {
    ALL: "all",
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning"
};

const INITIAL_GLOBAL_STATE = { status: "idle", list: [], error: null };

const TYPE_CATEGORY = {
    ORDER_ARRIVED: "info",
    PICKUP_REMINDER: "warning",
    PICKUP_CONFIRMED: "success",
    COMPANY_PACKAGE: "success",
    UNADDRESSED_PACKAGE: "warning"
};

const categoryFor = (n) => TYPE_CATEGORY[n.type] || "info";

const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
};

const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
};

const Notifications = ({ currentRole, setCurrentRole, setCurrentUser, currentUser }) => {
    const { notifications, refresh, markRead, deleteNotification, userId } = useNotification();

    const [scopeFilter, setScopeFilter] = useState(SCOPE_FILTERS.ALL);
    const [typeFilter, setTypeFilter] = useState(TYPE_FILTERS.ALL);
    const [globalState, setGlobalState] = useState(INITIAL_GLOBAL_STATE);

    const isManager = currentRole === "manager";

    const effectiveScope =
        !isManager && scopeFilter === SCOPE_FILTERS.GLOBAL
            ? SCOPE_FILTERS.ALL
            : scopeFilter;

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (!isManager) return undefined;
        if (effectiveScope !== SCOPE_FILTERS.GLOBAL && effectiveScope !== SCOPE_FILTERS.ALL) {
            return undefined;
        }
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
    }, [effectiveScope, isManager, userId]);

    const personalList = useMemo(
        () => (Array.isArray(notifications) ? notifications : []),
        [notifications]
    );

    const merged = useMemo(() => {
        if (!isManager) return personalList;
        if (effectiveScope === SCOPE_FILTERS.MINE) {
            return personalList.filter((n) => n.scope !== "GLOBAL");
        }
        if (effectiveScope === SCOPE_FILTERS.GLOBAL) {
            return globalState.list;
        }
        const seen = new Set();
        const combined = [];
        for (const n of [...personalList, ...globalState.list]) {
            if (!n || seen.has(n.id)) continue;
            seen.add(n.id);
            combined.push(n);
        }
        combined.sort((a, b) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return tb - ta;
        });
        return combined;
    }, [isManager, effectiveScope, personalList, globalState.list]);

    const filtered = useMemo(() => {
        if (typeFilter === TYPE_FILTERS.ALL) return merged;
        return merged.filter((n) => categoryFor(n) === typeFilter);
    }, [merged, typeFilter]);

    const handleSelect = (n) => {
        if (!n || !n.id || n.read) return;
        markRead(n.id);
    };

    const eyebrow =
        currentRole === "manager"
            ? "Manager portal"
            : currentRole === "receptionist"
                ? "Receptionist portal"
                : "Employee portal";

    return (
        <div className="dashboard">
            <Sidebar
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                setCurrentUser={setCurrentUser}
                currentUser={currentUser}
            />

            <main className="notification-history-page">
                <div className="notification-history-header">
                    <div>
                        <p className="notification-history-eyebrow">{eyebrow}</p>
                        <h1>Notification history</h1>
                        <p className="notification-history-subtitle">
                            All notifications addressed to you, sorted from newest to oldest.
                            Click an unread row to mark it as read, or use the delete button to remove it.
                        </p>
                    </div>

                    <div className="notification-history-summary">
                        <span className="summary-label">Showing</span>
                        <span className="summary-value">{filtered.length}</span>
                    </div>
                </div>

                {isManager && (
                    <div className="notification-filters">
                        <button
                            type="button"
                            className={effectiveScope === SCOPE_FILTERS.ALL ? "filter-button active" : "filter-button"}
                            onClick={() => setScopeFilter(SCOPE_FILTERS.ALL)}
                        >
                            Everything
                        </button>
                        <button
                            type="button"
                            className={effectiveScope === SCOPE_FILTERS.MINE ? "filter-button active" : "filter-button"}
                            onClick={() => setScopeFilter(SCOPE_FILTERS.MINE)}
                        >
                            Mine
                        </button>
                        <button
                            type="button"
                            className={effectiveScope === SCOPE_FILTERS.GLOBAL ? "filter-button active" : "filter-button"}
                            onClick={() => {
                                setScopeFilter(SCOPE_FILTERS.GLOBAL);
                                setGlobalState(INITIAL_GLOBAL_STATE);
                            }}
                        >
                            Global (Sioux)
                        </button>
                    </div>
                )}

                <div className="notification-filters">
                    <button
                        type="button"
                        className={typeFilter === TYPE_FILTERS.ALL ? "filter-button active" : "filter-button"}
                        onClick={() => setTypeFilter(TYPE_FILTERS.ALL)}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={typeFilter === TYPE_FILTERS.INFO ? "filter-button active" : "filter-button"}
                        onClick={() => setTypeFilter(TYPE_FILTERS.INFO)}
                    >
                        Info
                    </button>
                    <button
                        type="button"
                        className={typeFilter === TYPE_FILTERS.SUCCESS ? "filter-button active" : "filter-button"}
                        onClick={() => setTypeFilter(TYPE_FILTERS.SUCCESS)}
                    >
                        Success
                    </button>
                    <button
                        type="button"
                        className={typeFilter === TYPE_FILTERS.WARNING ? "filter-button active" : "filter-button"}
                        onClick={() => setTypeFilter(TYPE_FILTERS.WARNING)}
                    >
                        Warning
                    </button>
                </div>

                {globalState.error && effectiveScope !== SCOPE_FILTERS.MINE && (
                    <div className="empty-state" style={{ marginBottom: 16 }}>
                        <h3>Could not load global feed</h3>
                        <p>{globalState.error}</p>
                    </div>
                )}

                <div className="notification-history-list">
                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <h3>No notifications found</h3>
                            <p>There are no notifications for this filter yet.</p>
                        </div>
                    ) : (
                        filtered.map((n) => {
                            const cat = categoryFor(n);
                            const cardClass = `notification-history-card ${cat}${n.read ? "" : " unread"}`;
                            return (
                                <div
                                    key={`${n.scope || "P"}-${n.id}`}
                                    className={cardClass}
                                    onClick={() => handleSelect(n)}
                                    style={{
                                        cursor: n.read ? "default" : "pointer",
                                        opacity: n.read ? 0.78 : 1
                                    }}
                                >
                                    <div className="notification-accent"></div>

                                    <div className="notification-card-content">
                                        <div className="notification-history-card-top">
                                            <div className="notification-title-group">
                                                <h3>{n.title}</h3>
                                                <span className={`notification-badge ${cat}`}>
                                                    {n.scope === "GLOBAL" ? "global" : cat}
                                                </span>
                                            </div>

                                            <div className="notification-date-group">
                                                <span className="notification-date">{formatDate(n.createdAt)}</span>
                                                <span className="notification-time">{formatTime(n.createdAt)}</span>
                                                <button
                                                    type="button"
                                                    className="notification-delete-button"
                                                    title="Delete notification"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(n.id);
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>

                                        <p>{n.message}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default Notifications;

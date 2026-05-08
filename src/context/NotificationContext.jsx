import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import NotificationPopup from "../components/NotificationPopup";
import { NotificationContext } from "./NotificationContextStore";
import {
    listForEmployee,
    listSince,
    markAsRead as apiMarkAsRead
} from "../services/NotificationApi";

const DEFAULT_POLL_MS = 15000;
const TOAST_VISIBLE_MS = 5000;

const maxIdIn = (list) =>
    Array.isArray(list)
        ? list.reduce((acc, n) => (n && n.id > acc ? n.id : acc), 0)
        : 0;

/**
 * Centralised notification provider (US-03).
 *
 * Holds the user's notification history (Mine feed), polls the backend for
 * new ones, pops a toast when fresh items arrive (regardless of route),
 * and keeps the legacy `showNotification(data)` call site working so the
 * OrdersPanel "Test Arrival Notification" button still pops a toast.
 */
const NotificationProvider = ({
    children,
    userId = 1,
    pollMs = DEFAULT_POLL_MS
}) => {
    const [toast, setToast] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const lastSeenIdRef = useRef(0);

    useEffect(() => {
        let cancelled = false;
        listForEmployee(userId)
            .then((list) => {
                if (cancelled) return;
                const safe = Array.isArray(list) ? list : [];
                setNotifications(safe);
                lastSeenIdRef.current = maxIdIn(safe);
            })
            .catch((err) => {
                console.warn("[notifications] initial load failed:", err.message);
            });
        return () => {
            cancelled = true;
        };
    }, [userId]);

    useEffect(() => {
        if (!Number.isFinite(pollMs) || pollMs <= 0) return undefined;
        const interval = setInterval(async () => {
            try {
                const fresh = await listSince(userId, lastSeenIdRef.current);
                if (!Array.isArray(fresh) || fresh.length === 0) return;
                setNotifications((prev) => [...fresh, ...prev]);
                lastSeenIdRef.current = Math.max(
                    lastSeenIdRef.current,
                    maxIdIn(fresh)
                );
                setToast(fresh[0]);
            } catch (err) {
                console.debug("[notifications] poll skipped:", err.message);
            }
        }, pollMs);
        return () => clearInterval(interval);
    }, [userId, pollMs]);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(null), TOAST_VISIBLE_MS);
        return () => clearTimeout(timer);
    }, [toast]);

    const showNotification = useCallback((data) => {
        setToast(data);
        if (data && typeof data.id === "number") {
            setNotifications((prev) =>
                prev.some((n) => n.id === data.id) ? prev : [data, ...prev]
            );
            lastSeenIdRef.current = Math.max(lastSeenIdRef.current, data.id);
        }
    }, []);

    const closeToast = useCallback(() => setToast(null), []);

    const refresh = useCallback(async () => {
        try {
            const list = await listForEmployee(userId);
            const safe = Array.isArray(list) ? list : [];
            setNotifications(safe);
            lastSeenIdRef.current = maxIdIn(safe);
        } catch (err) {
            console.warn("[notifications] refresh failed:", err.message);
        }
    }, [userId]);

    const markRead = useCallback(async (id) => {
        try {
            await apiMarkAsRead(id);
        } catch (err) {
            console.warn("[notifications] markRead failed:", err.message);
        }
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id
                    ? { ...n, read: true, readAt: new Date().toISOString() }
                    : n
            )
        );
    }, []);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const value = useMemo(
        () => ({
            userId,
            notifications,
            unreadCount,
            showNotification,
            refresh,
            markRead
        }),
        [userId, notifications, unreadCount, showNotification, refresh, markRead]
    );

    return (
        <NotificationContext.Provider value={value}>
            <NotificationPopup notification={toast} onClose={closeToast} />
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
export { NotificationProvider };

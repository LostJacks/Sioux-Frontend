import { useEffect, useState } from "react";
import { listManagers } from "../services/UserApi";
import { notifyArrival } from "../services/NotificationApi";

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const modalStyle = {
    background: "#fff",
    borderRadius: 8,
    width: 420,
    maxWidth: "92%",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
};

const headerStyle = {
    padding: "18px 22px 12px",
    borderBottom: "1px solid #e6e6e6"
};

const bodyStyle = {
    padding: "14px 22px",
    overflowY: "auto",
    flex: 1
};

const footerStyle = {
    padding: "12px 22px",
    borderTop: "1px solid #e6e6e6",
    display: "flex",
    justifyContent: "flex-end",
    gap: 10
};

const buttonPrimary = {
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14
};

const buttonSecondary = {
    background: "transparent",
    color: "#333",
    border: "1px solid #ccc",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14
};

const errorStyle = {
    background: "#fdecec",
    color: "#7a1c1c",
    padding: "8px 12px",
    borderRadius: 4,
    margin: "8px 0",
    fontSize: 13
};

const labelName = (m) => {
    const first = m.firstName || "";
    const last = m.lastName || "";
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (m.email) return m.email;
    return `User #${m.id}`;
};

/**
 * Receptionist-side modal: triggered for a company / unaddressed parcel,
 * lets the user either fan out to every manager (default) or pick a subset.
 *
 * Props:
 *   orderId    – the order/package id the notification is about
 *   trackingNumber – display only
 *   onClose    – called after Cancel or successful Send
 *   onSent     – optional, called with the persisted Notification on success
 */
const NotifyManagersModal = ({ orderId, trackingNumber, onClose, onSent }) => {
    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [mode, setMode] = useState("all"); // 'all' | 'specific'
    const [selected, setSelected] = useState(new Set());

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        listManagers()
            .then((list) => {
                if (cancelled) return;
                setManagers(Array.isArray(list) ? list : []);
            })
            .catch((err) => {
                if (cancelled) return;
                setLoadError(err.message || "Failed to load managers");
            })
            .finally(() => {
                if (!cancelled) setLoadingManagers(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const toggle = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSend = async () => {
        setSubmitError(null);
        setSubmitting(true);

        const targetIds =
            mode === "specific" ? Array.from(selected.values()) : null;

        if (mode === "specific" && targetIds.length === 0) {
            setSubmitError("Please select at least one manager.");
            setSubmitting(false);
            return;
        }

        try {
            const notification = await notifyArrival(orderId, targetIds);
            if (typeof onSent === "function") onSent(notification);
            onClose();
        } catch (err) {
            setSubmitError(err.message || "Failed to send notification");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={overlayStyle} role="dialog" aria-modal="true">
            <div style={modalStyle}>
                <div style={headerStyle}>
                    <h2 style={{ margin: 0, fontSize: 18 }}>Notify managers</h2>
                    {trackingNumber && (
                        <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>
                            Package #{trackingNumber}
                        </p>
                    )}
                </div>

                <div style={bodyStyle}>
                    <p style={{ marginTop: 0, fontSize: 14, color: "#333" }}>
                        Send a global notification (in-app + email) about this
                        package.
                    </p>

                    <label style={{ display: "block", marginBottom: 8 }}>
                        <input
                            type="radio"
                            name="notify-mode"
                            value="all"
                            checked={mode === "all"}
                            onChange={() => setMode("all")}
                        />{" "}
                        All managers (default)
                    </label>

                    <label style={{ display: "block", marginBottom: 12 }}>
                        <input
                            type="radio"
                            name="notify-mode"
                            value="specific"
                            checked={mode === "specific"}
                            onChange={() => setMode("specific")}
                        />{" "}
                        Specific managers
                    </label>

                    {mode === "specific" && (
                        <div
                            style={{
                                maxHeight: 240,
                                overflowY: "auto",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                padding: 8
                            }}
                        >
                            {loadingManagers && (
                                <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                                    Loading managers…
                                </p>
                            )}
                            {loadError && (
                                <div style={errorStyle}>{loadError}</div>
                            )}
                            {!loadingManagers && managers.length === 0 && !loadError && (
                                <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                                    No managers found in the directory.
                                </p>
                            )}
                            {managers.map((m) => (
                                <label
                                    key={m.id}
                                    style={{
                                        display: "block",
                                        padding: "4px 6px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.has(m.id)}
                                        onChange={() => toggle(m.id)}
                                    />{" "}
                                    {labelName(m)}
                                    {m.building && (
                                        <span
                                            style={{
                                                marginLeft: 6,
                                                color: "#888",
                                                fontSize: 12
                                            }}
                                        >
                                            ({m.building})
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    )}

                    {submitError && <div style={errorStyle}>{submitError}</div>}
                </div>

                <div style={footerStyle}>
                    <button
                        type="button"
                        style={buttonSecondary}
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        style={buttonPrimary}
                        onClick={handleSend}
                        disabled={submitting}
                    >
                        {submitting ? "Sending…" : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotifyManagersModal;

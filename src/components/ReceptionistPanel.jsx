import { useEffect, useState } from "react";
import OrderRow from "./OrderRow";
import NotifyManagersModal from "./NotifyManagersModal";
import { useNotification } from "../hooks/useNotification";
import { getPickupReminder } from "../services/orderApi";

const ReceptionistPanel = ({ orders, onPickup }) => {
    const { showNotification } = useNotification() || {};
    const [notifyTarget, setNotifyTarget] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        setLastUpdate(new Date());
    }, [orders]);

    const openNotifyModal = (order) => setNotifyTarget(order);

    const closeNotifyModal = () => {
        setNotifyTarget(null);
    };

    const handleSent = (notification) => {
        if (notification && typeof showNotification === "function") {
            showNotification(notification);
        }
    };

    const handleSendReminder = async (order) => {
        if (!order?.pkgId) return;

        try {
            const data = await getPickupReminder(order.pkgId);

            if (typeof showNotification === "function") {
                showNotification(data);
            }
        } catch (err) {
            console.error("Failed to send reminder:", err);
        }
    };

    return (
        <section className="orders-wrapper">
            <p className="last-update">
                Last update:{" "}
                {lastUpdate
                    ? `Today, ${lastUpdate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}`
                    : "Loading..."}
            </p>

            <div className="orders-panel">
                <div className="orders-header">
                    <h2>Packages</h2>
                </div>

                <div className="orders-body">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderRow
                                key={order.pkgId || order.id}
                                order={order}
                                onPickup={onPickup}
                                onNotifyManagers={openNotifyModal}
                                onSendReminder={handleSendReminder}
                            />
                        ))
                    ) : (
                        <p className="no-orders-text">
                            No packages found.
                        </p>
                    )}
                </div>
            </div>

            {notifyTarget && (
                <NotifyManagersModal
                    orderId={notifyTarget.pkgId}
                    trackingNumber={notifyTarget.id}
                    onClose={closeNotifyModal}
                    onSent={handleSent}
                />
            )}
        </section>
    );
};

export default ReceptionistPanel;
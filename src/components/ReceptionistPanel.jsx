import { useState } from "react";
import OrderRow from "./OrderRow";
import NotifyManagersModal from "./NotifyManagersModal";
import { useNotification } from "../hooks/useNotification";

const ReceptionistPanel = ({ orders }) => {
    const { showNotification } = useNotification() || {};
    const [notifyTarget, setNotifyTarget] = useState(null);

    const openNotifyModal = (order) => setNotifyTarget(order);
    const closeNotifyModal = () => setNotifyTarget(null);

    const handleSent = (notification) => {
        if (notification && typeof showNotification === "function") {
            showNotification(notification);
        }
    };

    return (
        <section className="orders-wrapper">
            <p className="last-update">Last update: Today, 13:45</p>

            <div className="orders-panel">
                <div className="orders-header">
                    <h2>All Packages</h2>
                </div>

                <div className="orders-body">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderRow
                                key={order.id}
                                order={order}
                                onNotifyManagers={openNotifyModal}
                            />
                        ))
                    ) : (
                        <p className="no-orders-text">No packages found.</p>
                    )}
                </div>
            </div>

            {notifyTarget && (
                <NotifyManagersModal
                    orderId={notifyTarget.id}
                    trackingNumber={notifyTarget.id}
                    onClose={closeNotifyModal}
                    onSent={handleSent}
                />
            )}
        </section>
    );
};

export default ReceptionistPanel;

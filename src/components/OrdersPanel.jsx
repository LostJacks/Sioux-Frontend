import OrderRow from "./OrderRow";
import { getArrivalNotification, getPickupReminder } from "../services/orderApi";
import { useNotification } from "../hooks/useNotification";

const OrdersPanel = ({ orders }) => {
    const { showNotification } = useNotification();

    const firstOrderId = orders.length > 0 ? (orders[0].pkgId ?? orders[0].id) : null;

    const handleArrivalNotification = async () => {
        if (!firstOrderId) return;
        try {
            const data = await getArrivalNotification(firstOrderId);
            showNotification(data);
        } catch (error) {
            console.error("Arrival notification error:", error);
        }
    };

    const handleReminderNotification = async () => {
        if (!firstOrderId) return;
        try {
            const data = await getPickupReminder(firstOrderId);
            showNotification(data);
        } catch (error) {
            console.error("Reminder notification error:", error);
        }
    };

    return (
        <section className="orders-wrapper">
            <p className="last-update">Connected to backend</p>

            <div className="orders-panel">
                <div className="orders-header">
                    <h2>My Orders</h2>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button onClick={handleArrivalNotification} disabled={!firstOrderId}>
                            Test Arrival Notification
                        </button>

                        <button onClick={handleReminderNotification} disabled={!firstOrderId}>
                            Test Reminder Notification
                        </button>
                    </div>
                </div>

                <div className="orders-body">
                    {orders.length > 0 ? (
                        orders.map((order) => <OrderRow key={order.id} order={order} />)
                    ) : (
                        <p className="no-orders-text">No orders found.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrdersPanel;
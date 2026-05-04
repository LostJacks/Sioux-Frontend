import OrderRow from "./OrderRow";
import { getArrivalNotification, getPickupReminder } from "../services/orderApi";
import { useNotification } from "../hooks/useNotification";

const OrdersPanel = ({ orders }) => {
    const { showNotification } = useNotification();

    const handleArrivalNotification = async () => {
        try {
            const data = await getArrivalNotification(1);
            console.log("Arrival notification response:", data);
            showNotification(data);
        } catch (error) {
            console.error("Arrival notification error:", error);
        }
    };

    const handleReminderNotification = async () => {
        try {
            const data = await getPickupReminder(1);
            console.log("Reminder notification response:", data);
            showNotification(data);
        } catch (error) {
            console.error("Reminder notification error:", error);
        }
    };

    return (
        <section className="orders-wrapper">
            <p className="last-update">Last update: Today, 13:45</p>

            <div className="orders-panel">
                <div className="orders-header">
                    <h2>My Orders</h2>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button onClick={handleArrivalNotification}>
                            Test Arrival Notification
                        </button>

                        <button onClick={handleReminderNotification}>
                            Test Reminder Notification
                        </button>
                    </div>
                </div>

                <div className="orders-body">
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <OrderRow key={`${order.id}-${index}`} order={order} />
                        ))
                    ) : (
                        <p className="no-orders-text">No orders found.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrdersPanel;
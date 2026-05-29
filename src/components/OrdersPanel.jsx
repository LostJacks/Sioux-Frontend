import OrderRow from "./OrderRow";

const OrdersPanel = ({ orders, lastUpdate }) => {
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
                    <h2>My Orders</h2>
                </div>

                <div className="orders-body">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderRow
                                key={order.id}
                                order={order}
                            />
                        ))
                    ) : (
                        <p className="no-orders-text">
                            No orders found.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrdersPanel;
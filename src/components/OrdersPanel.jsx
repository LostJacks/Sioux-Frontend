import OrderRow from "./OrderRow";

const OrdersPanel = ({ orders }) => {
    return (
        <section className="orders-wrapper">
            <p className="last-update">Last update: Today, 13:45</p>

            <div className="orders-panel">
                <div className="orders-header">
                    <h2>My Orders</h2>
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
import OrderRow from "./OrderRow";

const OrdersPanel = ({ orders }) => {
    return (
        <section className="orders-wrapper">
            <p className="last-update">Connected to backend</p>

            <div className="orders-panel">
                <div className="orders-header">
                    <h2>My Orders</h2>
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

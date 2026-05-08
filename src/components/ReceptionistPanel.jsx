import OrderRow from "./OrderRow";

const ReceptionistPanel = ({ orders, onPickup }) => {
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
                            <OrderRow key={order.pkgId || order.id} order={order} onPickup={onPickup} />
                        ))
                    ) : (
                        <p className="no-orders-text">No packages found.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ReceptionistPanel;

const OrderRow = ({ order }) => {
    const statusText = order.status?.name || "UNKNOWN";
    const locationText = order.buildingName || order.employee?.building || "No location";

    return (
        <div className="order-row">
            <div className="order-left">
                <p className="order-id">{order.trackingNumber || order.id}</p>
            </div>

            <div className="order-middle">
                <span className="courier-label">Employee:</span>
                <span className="courier-value">
          {order.employee
              ? `${order.employee.firstName} ${order.employee.lastName}`
              : "Unassigned"}
        </span>
            </div>

            <div className="order-right">
                <div className="status-line">
                    <span className="status-label">Delivery status:</span>
                    <span className="status-value">{statusText}</span>
                </div>

                <p className="location-text">{locationText}</p>
            </div>
        </div>
    );
};

export default OrderRow;
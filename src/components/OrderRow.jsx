const OrderRow = ({ order, onPickup, onNotifyManagers, onSendReminder }) => {
    const trackingId = order.id || order.trackingNumber;
    const statusText = (typeof order.status === "object" ? order.status?.name : order.status) || "UNKNOWN";
    const isPickedUp = statusText?.toUpperCase() === "PICKED_UP" || order.pickedUp === true;
    const isStored = statusText?.toUpperCase() === "STORED";
    const locationText = order.location || order.buildingName || order.employee?.building || "";

    const handleTrack = () => {
        const courierName = order.courier?.trim().toLowerCase();

        const trackingUrls = {
            dhl: `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${trackingId}`,
            ups: `https://www.ups.com/track?tracknum=${trackingId}`,
            fedex: `https://www.fedex.com/fedextrack/?trknbr=${trackingId}`,
            postnl: `https://jouw.postnl.nl/track-and-trace/${trackingId}`,
            dpd: `https://tracking.dpd.de/status/en_US/parcel/${trackingId}`,
            gls: `https://gls-group.com/track/${trackingId}`,
            hermes: `https://new.myhermes.co.uk/track.html#/parcel/${trackingId}`,
            evri: `https://www.evri.com/track/parcel/${trackingId}`,
            tnt: `https://www.tnt.com/express/en_us/site/shipping-tools/tracking.html?searchType=con&cons=${trackingId}`,
            usps: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingId}`
        };

        const trackingUrl = trackingUrls[courierName];

        if (trackingUrl) {
            window.open(trackingUrl, "_blank");
        } else {
            alert(`Tracking is not supported yet for ${order.courier}.`);
        }
    };

    return (
        <div className={`order-row ${isPickedUp ? "order-row--picked-up" : ""}`}>
            <div className="order-left">
                <p className="order-id">{trackingId}</p>

                {order.courier && (
                    <button className="courier-button" onClick={handleTrack}>
                        Courier website
                    </button>
                )}

                {/* Notify managers only for Sioux/unaddressed parcels (no employee).
                    Personal packages already trigger an arrival notification on
                    storePackage, so escalating to managers would just be noise. */}
                {typeof onNotifyManagers === "function" &&
                    order.pkgId &&
                    !order.employee && (
                        <button
                            type="button"
                            className="courier-button"
                            style={{ marginTop: 6 }}
                            onClick={() => onNotifyManagers(order)}
                        >
                            Notify managers
                        </button>
                    )}
            </div>

            <div className="order-middle">
                {order.courier && (
                    <>
                        <span className="courier-label">Courier:</span>
                        <span className="courier-value">{order.courier}</span>
                    </>
                )}

                {order.employee && (
                    <>
                        <span className="courier-label">Employee:</span>
                        <span className="courier-value">
                            {order.employee.firstName} {order.employee.lastName}
                        </span>
                    </>
                )}
            </div>

            <div className="order-right">
                <div className="status-line">
                    <span className="status-label">Status:</span>
                    <span className="status-value">{statusText}</span>
                </div>

                {locationText && (
                    <p className="location-text">{locationText}</p>
                )}

                {isPickedUp ? (
                    <span className="picked-up-badge">Picked up</span>
                ) : (
                    <>
                        {onPickup && order.pkgId && (
                            <button
                                className="pickup-button"
                                onClick={() => onPickup(order.pkgId)}
                            >
                                Mark as Picked Up
                            </button>
                        )}
                        {/* Send reminder is offered once the package is on a shelf
                            waiting for the employee — a real workflow trigger so we
                            don't need a "Test reminder" button anywhere. */}
                        {onSendReminder && order.pkgId && isStored && (
                            <button
                                className="reminder-button"
                                onClick={() => onSendReminder(order)}
                            >
                                Send reminder
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderRow;

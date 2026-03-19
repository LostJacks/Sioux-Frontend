const OrderRow = ({ order }) => {
    const handleTrack = () => {
        const courierName = order.courier.trim().toLowerCase();

        const trackingUrls = {
            dhl: `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${order.id}`,
            ups: `https://www.ups.com/track?tracknum=${order.id}`,
            fedex: `https://www.fedex.com/fedextrack/?trknbr=${order.id}`,
            postnl: `https://jouw.postnl.nl/track-and-trace/${order.id}`,
            dpd: `https://tracking.dpd.de/status/en_US/parcel/${order.id}`,
            gls: `https://gls-group.com/track/${order.id}`,
            hermes: `https://new.myhermes.co.uk/track.html#/parcel/${order.id}`,
            evri: `https://www.evri.com/track/parcel/${order.id}`,
            tnt: `https://www.tnt.com/express/en_us/site/shipping-tools/tracking.html?searchType=con&cons=${order.id}`,
            usps: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.id}`
        };

        const trackingUrl = trackingUrls[courierName];

        if (trackingUrl) {
            window.open(trackingUrl, "_blank");
        } else {
            alert(`Tracking is not supported yet for ${order.courier}.`);
        }
    };

    return (
        <div className="order-row">
            <div className="order-left">
                <p className="order-id">{order.id}</p>

                <button
                    className="courier-button"
                    onClick={handleTrack}
                >
                    Courier website
                </button>
            </div>

            <div className="order-middle">
                <span className="courier-label">Courier:</span>
                <span className="courier-value">{order.courier}</span>
            </div>

            <div className="order-right">
                <div className="status-line">
                    <span className="status-label">Delivery status:</span>
                    <span className="status-value">{order.status}</span>
                </div>

                {order.location && (
                    <p className="location-text">{order.location}</p>
                )}
            </div>
        </div>
    );
};

export default OrderRow;
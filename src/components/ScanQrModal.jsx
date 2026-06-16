import { Scanner } from "@yudiel/react-qr-scanner";

const ScanQrModal = ({ title = "Scan", onClose, onScan }) => {
    return (
        <div className="qr-overlay" onClick={onClose}>
            <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                <div className="qr-header">
                    <h3>{title}</h3>
                    <button className="qr-close" onClick={onClose}>✕</button>
                </div>

                <div className="qr-content">
                    <Scanner
                        onScan={(results) => {
                            if (results && results.length > 0) {
                                onScan(results[0].rawValue);
                            }
                        }}
                        onError={(error) => {
                            console.error(error);
                        }}
                        formats={[
                            "qr_code",
                            "code_128",
                            "code_39",
                            "ean_13",
                            "ean_8",
                            "upc_a",
                            "upc_e",
                            "itf",
                            "data_matrix",
                            "pdf417"
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScanQrModal;

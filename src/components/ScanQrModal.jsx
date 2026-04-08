import { Scanner } from "@yudiel/react-qr-scanner";

const ScanEmployeeQrModal = ({ onClose, onScan }) => {
    return (
        <div className="qr-overlay" onClick={onClose}>
            <div
                className="qr-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="qr-header">
                    <h3>Scan Employee QR</h3>
                    <button className="qr-close" onClick={onClose}>
                        ✕
                    </button>
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
                    />
                </div>
            </div>
        </div>
    );
};

export default ScanEmployeeQrModal;
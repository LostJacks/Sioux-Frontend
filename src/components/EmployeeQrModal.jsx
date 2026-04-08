import { QRCodeCanvas } from "qrcode.react";

const EmployeeQrModal = ({ employeeId, onClose }) => {
    return (
        <div className="qr-overlay" onClick={onClose}>
            <div
                className="qr-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="qr-header">
                    <h3>Your QR Code</h3>
                    <button className="qr-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="qr-content">
                    <QRCodeCanvas value={employeeId.toString()} size={200} />
                    <p>Show this to reception</p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeQrModal;
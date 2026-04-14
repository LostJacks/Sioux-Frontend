import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const EmployeeQrModal = ({ employeeId, onClose }) => {
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/qrcodes/employee/${employeeId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch employee data");
                return res.json();
            })
            .then((data) => {
                setEmployeeData(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [employeeId]);

    const qrValue = employeeData
        ? `${employeeData.employeeId} - ${employeeData.firstName} ${employeeData.lastName}`
        : "";

    return (
        <div className="qr-overlay" onClick={onClose}>
            <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                <div className="qr-header">
                    <h3>Your QR Code</h3>
                    <button className="qr-close" onClick={onClose}>✕</button>
                </div>

                <div className="qr-content">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (
                        <>
                            <QRCodeCanvas value={qrValue} size={200} />
                            <p>{employeeData.firstName} {employeeData.lastName}</p>
                            <p>Show this to reception</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeQrModal;
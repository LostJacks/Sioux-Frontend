import { useState, useEffect } from "react";
import "../styles/receptionist.css";
import Sidebar from "../components/Sidebar";
import ReceptionistTopBar from "../components/ReceptionistTopBar";
import PackageTabs from "../components/PackageTabs";
import ReceptionistPanel from "../components/ReceptionistPanel";
import ScanQrModal from "../components/ScanQrModal";
import StorePackageModal from "../components/StorePackageModal";
import ReminderSettings from "../components/ReminderSettings";

const API_BASE = "http://localhost:8080/api";

const mapOrder = (o) => ({
    pkgId: o.id,
    id: o.trackingNumber || String(o.id),
    courier: o.courier || "",
    status: o.pickedUp ? "PICKED_UP" : (o.status?.name || o.status || "REGISTERED"),
    location: o.rowLocation || o.buildingName || o.location || "",
    employee: o.employee,
});

const isStored = (status) => {
    const s = status?.toUpperCase();
    return s === "STORED" || s === "READY" || s === "READY_FOR_PICKUP";
};

const isPickedUp = (status) => status?.toUpperCase() === "PICKED_UP";

const isIncoming = (status) => !isStored(status) && !isPickedUp(status);

const Receptionist = ({ currentRole, setCurrentRole, setCurrentUser }) => {
    const [apiOrders, setApiOrders] = useState([]);
    const [displayOrders, setDisplayOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [scanType, setScanType] = useState(null);
    const [scanBanner, setScanBanner] = useState(null);
    const [scannedPackage, setScannedPackage] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE}/orders`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                const mapped = data.map(mapOrder);
                setApiOrders(mapped);
                setDisplayOrders(mapped);
            } catch {
                setDisplayOrders([]);
            }
        };

        fetchOrders();

        const interval = setInterval(fetchOrders, 20000);
        return () => clearInterval(interval);
    }, []);

    const filteredOrders = displayOrders.filter((order) => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeTab === "incoming") return matchesSearch && isIncoming(order.status);
        if (activeTab === "stored") return matchesSearch && isStored(order.status);
        return matchesSearch;
    });

    const handleEmployeeScan = async (scannedValue) => {
        const spmsMatch = scannedValue.match(/^SPMS:EMP:(\d+):(.+)$/);
        const legacyMatch = scannedValue.match(/^(\d+)\s*-\s*(.+)$/);
        const match = spmsMatch || legacyMatch;

        if (!match) {
            setScanBanner({ type: "error", message: "Invalid employee QR code" });
            return;
        }

        const employeeId = match[1];
        const employeeName = match[2];

        try {
            const res = await fetch(`${API_BASE}/orders/employee/${employeeId}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setDisplayOrders(data.map(mapOrder));
            setScanBanner({ type: "employee", message: `Packages for ${employeeName}` });
        } catch {
            setScanBanner({ type: "error", message: "Employee not found" });
        }
    };

    const handleScan = async (scannedValue) => {
        if (scanType === "employee") await handleEmployeeScan(scannedValue);
        if (scanType === "package") setScannedPackage(scannedValue);
        setScanType(null);
    };

    const handleStored = (storedOrder) => {
        const mapped = mapOrder(storedOrder);
        setApiOrders((prev) => {
            const exists = prev.find((o) => o.pkgId === mapped.pkgId);
            return exists ? prev.map((o) => (o.pkgId === mapped.pkgId ? mapped : o)) : [...prev, mapped];
        });
        setDisplayOrders((prev) => {
            const exists = prev.find((o) => o.pkgId === mapped.pkgId);
            return exists ? prev.map((o) => (o.pkgId === mapped.pkgId ? mapped : o)) : [mapped, ...prev];
        });
        setScanBanner({ type: "package", message: `Package stored: ${mapped.id}` });
    };

    const handlePickup = async (pkgId) => {
        if (!pkgId) return;
        try {
            const res = await fetch(`${API_BASE}/orders/${pkgId}/pickup`, { method: "PUT" });
            if (!res.ok) throw new Error();
            const updated = mapOrder(await res.json());
            const updater = (prev) => prev.map((o) => (o.pkgId === pkgId ? updated : o));
            setApiOrders(updater);
            setDisplayOrders(updater);
        } catch {
            /* silently ignore */
        }
    };

    const handleClearScan = () => {
        setDisplayOrders(apiOrders);
        setScanBanner(null);
        setSearchTerm("");
    };

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} setCurrentUser={setCurrentUser} />

            <main className="main-content">
                <ReceptionistTopBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onScanEmployee={() => setScanType("employee")}
                    onScanPackage={() => setScanType("package")}
                />

                {scanBanner && (
                    <div className={`scan-banner scan-banner--${scanBanner.type}`}>
                        <span>{scanBanner.message}</span>
                        <button className="scan-banner-clear" onClick={handleClearScan}>
                            Show all
                        </button>
                    </div>
                )}

                <ReminderSettings />

                <PackageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <ReceptionistPanel orders={filteredOrders} onPickup={handlePickup} />

                {scanType && (
                    <ScanQrModal
                        title={scanType === "employee" ? "Scan Employee QR" : "Scan Package Barcode"}
                        onClose={() => setScanType(null)}
                        onScan={handleScan}
                    />
                )}

                {scannedPackage && (
                    <StorePackageModal
                        trackingNumber={scannedPackage}
                        onClose={() => setScannedPackage(null)}
                        onStored={handleStored}
                    />
                )}
            </main>
        </div>
    );
};

export default Receptionist;
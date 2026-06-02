import { useState, useEffect, useMemo } from "react";
import "../styles/receptionist.css";
import Sidebar from "../components/Sidebar";
import ReceptionistTopBar from "../components/ReceptionistTopBar";
import PackageFilters from "../components/PackageFilters";
import ReceptionistPanel from "../components/ReceptionistPanel";
import ScanQrModal from "../components/ScanQrModal";
import StorePackageModal from "../components/StorePackageModal";
import ReminderSettings from "../components/ReminderSettings";
import {
    formatLocationFromParts,
    getStatusSortRank,
    matchesPackageFilters,
} from "../utils/packageFilterUtils";

const API_BASE = "http://localhost:8080/api";

const mapOrder = (o) => {
    const buildingName = o.buildingName || o.building?.name || "";
    const floorNumber = o.floorNumber ?? o.floor?.floorNumber ?? null;
    const shelfNumber = o.shelfNumber ?? o.shelf?.shelfNumber ?? null;
    const rowNumber = o.rowNumber ?? o.row?.rowNumber ?? null;

    const structuredLocation = formatLocationFromParts({
        buildingName,
        floorNumber,
        shelfNumber,
        rowNumber,
    });

    return {
        pkgId: o.id,
        id: o.trackingNumber || String(o.id),
        courier: o.courier || "",
        status: o.pickedUp ? "PICKED_UP" : (o.status?.name || o.status || "REGISTERED"),
        location: o.rowLocation || structuredLocation || buildingName || o.location || "",
        employee: o.employee,
        pickedUp: o.pickedUp === true,
        buildingName,
        buildingId: o.buildingId ?? o.building?.id ?? null,
        floorNumber,
        floorId: o.floorId ?? o.floor?.id ?? null,
        shelfNumber,
        shelfId: o.shelfId ?? o.shelf?.id ?? null,
        rowNumber,
        rowId: o.rowId ?? o.row?.id ?? null,
        deliveredAt: o.deliveredAt || null,
    };
};

const Receptionist = ({ currentRole, setCurrentRole, setCurrentUser }) => {
    const [apiOrders, setApiOrders] = useState([]);
    const [displayOrders, setDisplayOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilters, setStatusFilters] = useState([]);
    const [scanType, setScanType] = useState(null);
    const [scanBanner, setScanBanner] = useState(null);
    const [scannedPackage, setScannedPackage] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/orders`)
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data) => {
                const mapped = data.map(mapOrder);
                setApiOrders(mapped);
                setDisplayOrders(mapped);
            })
            .catch(() => {
                setDisplayOrders([]);
            });
    }, []);

    const filteredOrders = useMemo(
        () =>
            [...displayOrders]
                .filter((order) => {
                    const tracking = order.id?.toLowerCase() || "";
                    const employeeName = order.employee
                        ? `${order.employee.firstName} ${order.employee.lastName}`.toLowerCase()
                        : "";
                    const courier = order.courier?.toLowerCase() || "";
                    const location = order.location?.toLowerCase() || "";
                    const query = searchTerm.toLowerCase().trim();

                    const matchesSearch =
                        !query ||
                        tracking.includes(query) ||
                        employeeName.includes(query) ||
                        courier.includes(query) ||
                        location.includes(query);

                    if (!matchesSearch) return false;
                    return matchesPackageFilters(order, statusFilters);
                })
                .sort((a, b) => {
                    const byStatus = getStatusSortRank(a) - getStatusSortRank(b);
                    if (byStatus !== 0) return byStatus;
                    return (b.pkgId || 0) - (a.pkgId || 0);
                }),
        [displayOrders, searchTerm, statusFilters]
    );

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

                <PackageFilters
                    statusFilters={statusFilters}
                    setStatusFilters={setStatusFilters}
                    resultCount={filteredOrders.length}
                />

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
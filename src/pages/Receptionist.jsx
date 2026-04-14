import { useEffect, useState } from "react";
import "../styles/receptionist.css";
import Sidebar from "../components/Sidebar";
import ReceptionistTopBar from "../components/ReceptionistTopBar";
import PackageTabs from "../components/PackageTabs";
import ReceptionistPanel from "../components/ReceptionistPanel";
import ScanQrModal from "../components/ScanQrModal";
import { getAllOrders, getOrdersForEmployee, getOrderByTrackingNumber } from "../services/orderApi";

const Receptionist = ({ currentRole, setCurrentRole }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [scanType, setScanType] = useState(null);
    const [orders, setOrders] = useState([]);

    const loadOrders = () => {
        getAllOrders()
            .then(setOrders)
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const tracking = (order.trackingNumber || "").toLowerCase();
        const matchesSearch = tracking.includes(searchTerm.toLowerCase());

        const status = order.status?.name || "";
        const pickedUp = order.pickedUp === true;

        if (activeTab === "incoming") {
            return matchesSearch && !pickedUp && status !== "READY_FOR_PICKUP";
        }

        if (activeTab === "stored") {
            return matchesSearch && !pickedUp && status === "READY_FOR_PICKUP";
        }

        return matchesSearch;
    });

    const handleEmployeeScan = async (employeeId) => {
        try {
            const data = await getOrdersForEmployee(employeeId);
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePackageScan = async (trackingNumber) => {
        try {
            const data = await getOrderByTrackingNumber(trackingNumber);
            setOrders(data ? [data] : []);
            setSearchTerm(trackingNumber);
        } catch (error) {
            console.error(error);
        }
    };

    const handleScan = async (scannedValue) => {
        if (scanType === "employee") {
            await handleEmployeeScan(scannedValue);
        }
        if (scanType === "package") {
            await handlePackageScan(scannedValue);
        }
        setScanType(null);
    };

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} />

            <main className="main-content">
                <ReceptionistTopBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onScanEmployee={() => setScanType("employee")}
                    onScanPackage={() => setScanType("package")}
                />

                <PackageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <ReceptionistPanel orders={filteredOrders} />

                {scanType && (
                    <ScanQrModal
                        title={scanType === "employee" ? "Scan Employee QR" : "Scan Package"}
                        onClose={() => setScanType(null)}
                        onScan={handleScan}
                    />
                )}
            </main>
        </div>
    );
};

export default Receptionist;
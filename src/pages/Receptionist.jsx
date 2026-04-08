import { useState } from "react";
import "../styles/receptionist.css";
import Sidebar from "../components/Sidebar";
import ReceptionistTopBar from "../components/ReceptionistTopBar";
import PackageTabs from "../components/PackageTabs";
import ReceptionistPanel from "../components/ReceptionistPanel";
import ScanEmployeeQrModal from "../components/ScanQrModal";
import { orders } from "../data/orders";

const Receptionist = ({ currentRole, setCurrentRole }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [scanType, setScanType] = useState(null);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.id
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        if (activeTab === "incoming") {
            return matchesSearch && order.status === "Waiting";
        }

        if (activeTab === "stored") {
            return matchesSearch && order.status === "Ready";
        }

        return matchesSearch;
    });

    const handleScan = (scannedValue) => {
        if (scanType === "employee") {
            console.log("Scanned employee ID:", scannedValue);
        }

        if (scanType === "package") {
            console.log("Scanned package ID:", scannedValue);
            setSearchTerm(scannedValue);
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

                <PackageTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <ReceptionistPanel orders={filteredOrders} />

                {scanType && (
                    <ScanEmployeeQrModal
                        title={
                            scanType === "employee"
                                ? "Scan Employee QR"
                                : "Scan Package"
                        }
                        onClose={() => setScanType(null)}
                        onScan={handleScan}
                    />
                )}
            </main>
        </div>
    );
};

export default Receptionist;
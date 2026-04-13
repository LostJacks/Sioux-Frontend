import { useState } from "react";
import "../styles/receptionist.css";
import Sidebar from "../components/Sidebar";
import ReceptionistTopBar from "../components/ReceptionistTopBar";
import PackageTabs from "../components/PackageTabs";
import ReceptionistPanel from "../components/ReceptionistPanel";
import ScanQrModal from "../components/ScanQrModal";
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

    const handleEmployeeScan = async (employeeId) => {
        console.log("Scanned employee ID:", employeeId);

        // later:
        // const employee = await getEmployeeByQr(employeeId);
        // setSelectedEmployee(employee);
    };

    const handlePackageScan = async (packageId) => {
        console.log("Scanned package ID:", packageId);

        // temporary frontend behavior
        setSearchTerm(packageId);

        // later:
        // const pkg = await getPackageByCode(packageId);
        // setSelectedPackage(pkg);
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

                <PackageTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <ReceptionistPanel orders={filteredOrders} />

                {scanType && (
                    <ScanQrModal
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
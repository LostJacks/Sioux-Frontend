import { useState, useEffect } from "react";
import "../styles/employee.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import QrButton from "../components/QrButton";
import OrdersPanel from "../components/OrdersPanel";
import EmployeeQrModal from "../components/EmployeeQrModal";

const API_BASE = "http://localhost:8080/api";

const Dashboard = ({ currentRole, setCurrentUser, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [orders, setOrders] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        if (currentUser?.id) {
            setSelectedEmployeeId(String(currentUser.id));
        }
    }, [currentUser]);

    useEffect(() => {
        if (!selectedEmployeeId) return;

        fetch(`${API_BASE}/orders/employee/${selectedEmployeeId}`)
            .then((r) => r.json())
            .then((data) => {
                setOrders(
                    data.map((o) => ({
                        pkgId: o.id,
                        id: o.trackingNumber || String(o.id),
                        courier: o.courier || "",
                        status: o.status?.name || o.status || "REGISTERED",
                        location: o.rowLocation || o.buildingName || "",
                        employee: o.employee
                    }))
                );

                setLastUpdate(new Date());
            })
            .catch(() => { });
    }, [selectedEmployeeId]);

    const filteredOrders = orders.filter((o) =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar
                currentRole={currentRole}
                setCurrentUser={setCurrentUser}
            />

            <main className="main-content">
                <div className="top-bar">
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <QrButton onClick={() => setShowQrModal(true)} />
                    </div>
                </div>

                <OrdersPanel
                    orders={filteredOrders}
                    lastUpdate={lastUpdate}
                />

                {showQrModal && selectedEmployeeId && (
                    <EmployeeQrModal
                        employeeId={selectedEmployeeId}
                        onClose={() => setShowQrModal(false)}
                    />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
import { useState, useEffect } from "react";
import "../styles/employee.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import QrButton from "../components/QrButton";
import OrdersPanel from "../components/OrdersPanel";
import EmployeeQrModal from "../components/EmployeeQrModal";

const API_BASE = "http://localhost:8080/api";

const Dashboard = ({ currentRole, setCurrentRole, setCurrentUser }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showQrModal, setShowQrModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/qrcodes/employees`)
            .then((r) => r.json())
            .then((data) => {
                setEmployees(data);
                if (data.length > 0) setSelectedEmployeeId(String(data[0].employeeId));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!selectedEmployeeId) return;
        fetch(`${API_BASE}/orders/employee/${selectedEmployeeId}`)
            .then((r) => r.json())
            .then((data) => setOrders(data.map((o) => ({
                pkgId: o.id,
                id: o.trackingNumber || String(o.id),
                courier: o.courier || "",
                status: o.status?.name || o.status || "REGISTERED",
                location: o.rowLocation || o.buildingName || "",
                employee: o.employee,
            }))))
            .catch(() => {});
    }, [selectedEmployeeId]);

    const filteredOrders = orders.filter((o) =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} setCurrentUser={setCurrentUser} />

            <main className="main-content">
                <div className="top-bar">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {employees.length > 0 && (
                            <select
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                style={{ height: 40, borderRadius: 8, padding: "0 10px", border: "1px solid #ccc", fontSize: 14 }}
                            >
                                {employees.map((e) => (
                                    <option key={e.employeeId} value={e.employeeId}>
                                        {e.firstName} {e.lastName}
                                    </option>
                                ))}
                            </select>
                        )}
                        <QrButton onClick={() => setShowQrModal(true)} />
                    </div>
                </div>

                <OrdersPanel orders={filteredOrders} />

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

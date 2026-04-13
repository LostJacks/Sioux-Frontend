import { useState } from "react";
import "../styles/employee.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import QrButton from "../components/QrButton";
import OrdersPanel from "../components/OrdersPanel";
import EmployeeQrModal from "../components/EmployeeQrModal"; // 👈 ADD THIS
import { orders } from "../data/orders";

const Dashboard = ({ currentRole, setCurrentRole }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showQrModal, setShowQrModal] = useState(false); // 👈 ADD THIS

    const filteredOrders = orders.filter((order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const employeeId = 1; // 👈 replace later with real user.id

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} />

            <main className="main-content">
                <div className="top-bar">
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    {/* 👇 CONNECT BUTTON */}
                    <QrButton onClick={() => setShowQrModal(true)} />
                </div>

                <OrdersPanel orders={filteredOrders} />

                {/* 👇 MODAL */}
                {showQrModal && (
                    <EmployeeQrModal
                        employeeId={employeeId}
                        onClose={() => setShowQrModal(false)}
                    />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
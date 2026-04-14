import { useEffect, useState } from "react";
import "../styles/employee.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import QrButton from "../components/QrButton";
import OrdersPanel from "../components/OrdersPanel";
import EmployeeQrModal from "../components/EmployeeQrModal";
import { getOrdersForEmployee } from "../services/orderApi";

const Dashboard = ({ currentRole, setCurrentRole }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showQrModal, setShowQrModal] = useState(false);
    const [orders, setOrders] = useState([]);

    const employeeId = 1;

    useEffect(() => {
        getOrdersForEmployee(employeeId)
            .then(setOrders)
            .catch((err) => console.error(err));
    }, []);

    const filteredOrders = orders.filter((order) =>
        (order.trackingNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} />

            <main className="main-content">
                <div className="top-bar">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <QrButton onClick={() => setShowQrModal(true)} />
                </div>

                <OrdersPanel orders={filteredOrders} />

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
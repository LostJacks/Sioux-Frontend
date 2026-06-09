import { useState, useEffect, useMemo } from "react";
import "../styles/employee.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import QrButton from "../components/QrButton";
import OrdersPanel from "../components/OrdersPanel";
import EmployeeQrModal from "../components/EmployeeQrModal";
import PackageFilters from "../components/PackageFilters";
import { getStatusSortRank, matchesPackageFilters } from "../utils/packageFilterUtils";

const API_BASE = "http://localhost:8080/api";

const Dashboard = ({ currentRole, setCurrentUser, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [orders, setOrders] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [statusFilters, setStatusFilters] = useState([]);

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

    const filteredOrders = useMemo(
        () =>
            [...orders]
                .filter((o) => {
                    const query = searchTerm.toLowerCase();
                    const matchesSearch =
                        o.id.toLowerCase().includes(query) ||
                        (o.courier || "").toLowerCase().includes(query) ||
                        (o.location || "").toLowerCase().includes(query);
                    if (!matchesSearch) return false;
                    return matchesPackageFilters(o, statusFilters);
                })
                .sort((a, b) => {
                    const byStatus = getStatusSortRank(a) - getStatusSortRank(b);
                    if (byStatus !== 0) return byStatus;
                    return (b.pkgId || 0) - (a.pkgId || 0);
                }),
        [orders, searchTerm, statusFilters]
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
                <PackageFilters
                    statusFilters={statusFilters}
                    setStatusFilters={setStatusFilters}
                    resultCount={filteredOrders.length}
                />
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
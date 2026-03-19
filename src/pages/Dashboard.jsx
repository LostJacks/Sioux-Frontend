import { useState } from "react";
import "../styles/employee.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import QrButton from "../components/QrButton";
import OrdersPanel from "../components/OrdersPanel";
import { orders } from "../data/orders";

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOrders = orders.filter((order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">
                <div className="top-bar">
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <QrButton />
                </div>

                <OrdersPanel orders={filteredOrders} />
            </main>
        </div>
    );
};

export default Dashboard;
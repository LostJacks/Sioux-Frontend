import { useState } from "react";
import "../styles/receptionist.css";
import Sidebar from "../components/Sidebar";
import ReceptionistTopBar from "../components/ReceptionistTopBar";
import PackageTabs from "../components/PackageTabs";
import ReceptionistPanel from "../components/ReceptionistPanel";
import { orders } from "../data/orders";

const Receptionist = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

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

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">
                <ReceptionistTopBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                <PackageTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <ReceptionistPanel orders={filteredOrders} />
            </main>
        </div>
    );
};

export default Receptionist;
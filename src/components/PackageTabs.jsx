const PackageTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="tabs-wrapper">
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                >
                    All Packages
                </button>

                <button
                    className={`tab-button ${activeTab === "incoming" ? "active" : ""}`}
                    onClick={() => setActiveTab("incoming")}
                >
                    Incoming Packages
                </button>

                <button
                    className={`tab-button ${activeTab === "stored" ? "active" : ""}`}
                    onClick={() => setActiveTab("stored")}
                >
                    Stored Packages
                </button>
            </div>
        </div>
    );
};

export default PackageTabs;
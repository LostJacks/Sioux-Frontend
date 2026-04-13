import { useState } from "react";
import "../styles/manager.css";
import Sidebar from "../components/Sidebar";
import ScanQrModal from "../components/ScanQrModal";

const Manager = ({ currentRole, setCurrentRole }) => {
    const [buildingSearch, setBuildingSearch] = useState("");
    const [showScanEmployeeQrModal, setShowScanEmployeeQrModal] = useState(false);

    const [buildings, setBuildings] = useState([
        {
            id: 1,
            name: "Main building",
            address: "Addressstraat 1",
            shelves: [
                { id: 1, name: "Shelf A", rowCount: 3 },
                { id: 2, name: "Shelf B", rowCount: 2 }
            ]
        },
        {
            id: 2,
            name: "Building A",
            address: "Street A 10",
            shelves: [{ id: 1, name: "Shelf C", rowCount: 4 }]
        },
        {
            id: 3,
            name: "Building B",
            address: "Street B 20",
            shelves: [{ id: 1, name: "Shelf D", rowCount: 3 }]
        }
    ]);

    const [selectedBuilding, setSelectedBuilding] = useState("Main building");

    const [name, setName] = useState("Main building");
    const [address, setAddress] = useState("Addressstraat 1");

    const [shelfName, setShelfName] = useState("");
    const [shelfRowCount, setShelfRowCount] = useState("");
    const [shelves, setShelves] = useState([
        { id: 1, name: "Shelf A", rowCount: 3 },
        { id: 2, name: "Shelf B", rowCount: 2 }
    ]);

    const loadBuildingIntoForm = (building) => {
        setSelectedBuilding(building.name);
        setName(building.name);
        setAddress(building.address);
        setShelves(building.shelves || []);
        setShelfName("");
        setShelfRowCount("");
    };

    const handleBuildingChange = (e) => {
        const buildingName = e.target.value;
        const building = buildings.find((item) => item.name === buildingName);

        if (building) {
            loadBuildingIntoForm(building);
        }
    };

    const handleSearchBuilding = () => {
        const trimmedSearch = buildingSearch.trim().toLowerCase();

        if (!trimmedSearch) {
            return;
        }

        const foundBuilding = buildings.find((building) =>
            building.name.toLowerCase().includes(trimmedSearch)
        );

        if (!foundBuilding) {
            return;
        }

        loadBuildingIntoForm(foundBuilding);
    };

    const handleAddBuilding = () => {
        setSelectedBuilding("");
        setName("");
        setAddress("");
        setShelves([]);
        setShelfName("");
        setShelfRowCount("");
    };

    const handleAddShelf = () => {
        const trimmedShelfName = shelfName.trim();
        const parsedRowCount = Number(shelfRowCount);

        if (
            !trimmedShelfName ||
            !shelfRowCount.trim() ||
            Number.isNaN(parsedRowCount) ||
            parsedRowCount <= 0
        ) {
            return;
        }

        const newShelf = {
            id: Date.now(),
            name: trimmedShelfName,
            rowCount: parsedRowCount
        };

        setShelves((prev) => [...prev, newShelf]);
        setShelfName("");
        setShelfRowCount("");
    };

    const handleRemoveShelf = (shelfId) => {
        setShelves((prev) => prev.filter((shelf) => shelf.id !== shelfId));
    };

    const handleSaveBuilding = () => {
        const trimmedName = name.trim();
        const trimmedAddress = address.trim();

        if (!trimmedName || !trimmedAddress) {
            return;
        }

        const existingIndex = buildings.findIndex(
            (building) => building.name === selectedBuilding
        );

        const buildingData = {
            id: existingIndex >= 0 ? buildings[existingIndex].id : Date.now(),
            name: trimmedName,
            address: trimmedAddress,
            shelves: shelves.map((shelf) => ({
                id: shelf.id,
                name: shelf.name,
                rowCount: shelf.rowCount
            }))
        };

        if (existingIndex >= 0) {
            const updatedBuildings = [...buildings];
            updatedBuildings[existingIndex] = buildingData;
            setBuildings(updatedBuildings);
        } else {
            setBuildings([...buildings, buildingData]);
        }

        setSelectedBuilding(trimmedName);
        console.log("Building payload:", buildingData);
    };

    const handleEmployeeQrScan = (employeeId) => {
        console.log("Scanned employee ID:", employeeId);
        setShowScanEmployeeQrModal(false);
    };

    const filteredBuildings = buildings.filter((building) =>
        building.name.toLowerCase().includes(buildingSearch.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} />

            <main className="manager-content">
                <div className="manager-top-row">
                    <div className="manager-search-bar">
                        <input
                            type="text"
                            placeholder="Building search"
                            value={buildingSearch}
                            onChange={(e) => setBuildingSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearchBuilding();
                                }
                            }}
                        />
                        <button
                            className="manager-search-button"
                            type="button"
                            onClick={handleSearchBuilding}
                        >
                            🔍
                        </button>
                    </div>

                    <button
                        className="scan-employee-button"
                        onClick={() => setShowScanEmployeeQrModal(true)}
                    >
                        Scan Employee QR
                    </button>
                </div>

                <div className="manager-building-row">
                    <select
                        value={selectedBuilding}
                        onChange={handleBuildingChange}
                        className="building-select"
                    >
                        <option value="">Choose a building</option>

                        {filteredBuildings.map((building) => (
                            <option key={building.id} value={building.name}>
                                {building.name}
                            </option>
                        ))}
                    </select>

                    <span className="or-text">OR</span>

                    <button
                        className="add-building-button"
                        onClick={handleAddBuilding}
                        type="button"
                    >
                        Add building
                    </button>
                </div>

                <div className="building-info-header">
                    <h2>Building information</h2>
                    <button
                        className="edit-button"
                        onClick={handleSaveBuilding}
                        type="button"
                    >
                        Save
                    </button>
                </div>

                <div className="manager-form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                <div className="building-info-header">
                    <h2>Shelves</h2>
                </div>

                <div className="shelf-input-row">
                    <div className="form-group shelf-input-group">
                        <label>Shelf name</label>
                        <input
                            type="text"
                            value={shelfName}
                            onChange={(e) => setShelfName(e.target.value)}
                            placeholder="Enter shelf name"
                        />
                    </div>

                    <div className="form-group shelf-input-group">
                        <label>Amount of rows</label>
                        <input
                            type="number"
                            value={shelfRowCount}
                            onChange={(e) => setShelfRowCount(e.target.value)}
                            placeholder="Enter row amount"
                        />
                    </div>

                    <button
                        className="add-shelf-button"
                        onClick={handleAddShelf}
                        type="button"
                    >
                        Add shelf
                    </button>
                </div>

                <div className="form-group full-width-group">
                    <label>Added shelves</label>

                    <div className="floor-names-box">
                        {shelves.length > 0 ? (
                            shelves.map((shelf, index) => (
                                <div key={shelf.id} className="floor-row">
                                    <span>
                                        {index + 1}. {shelf.name} — {shelf.rowCount} rows
                                    </span>

                                    <button
                                        type="button"
                                        className="remove-shelf-button"
                                        onClick={() => handleRemoveShelf(shelf.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="floor-row empty-floor-row">
                                No shelves added
                            </div>
                        )}
                    </div>
                </div>

                {showScanEmployeeQrModal && (
                    <ScanQrModal
                        title="Scan Employee QR"
                        onClose={() => setShowScanEmployeeQrModal(false)}
                        onScan={handleEmployeeQrScan}
                    />
                )}
            </main>
        </div>
    );
};

export default Manager;
import { useState } from "react";
import "../styles/manager.css";
import Sidebar from "../components/Sidebar";
import ScanEmployeeQrModal from "../components/ScanQrModal";

const Manager = ({ currentRole, setCurrentRole }) => {
    const [buildingSearch, setBuildingSearch] = useState("");
    const [showScanEmployeeQrModal, setShowScanEmployeeQrModal] = useState(false);

    const [buildings, setBuildings] = useState([
        {
            id: 1,
            name: "Main building",
            address: "Addressstraat 1",
            floors: "2",
            floorNames: "Floor 1\nFloor 2",
            shelves: "2",
            rows: "2"
        },
        {
            id: 2,
            name: "Building A",
            address: "Street A 10",
            floors: "3",
            floorNames: "Ground floor\nFirst floor\nSecond floor",
            shelves: "4",
            rows: "6"
        },
        {
            id: 3,
            name: "Building B",
            address: "Street B 20",
            floors: "1",
            floorNames: "Main floor",
            shelves: "2",
            rows: "3"
        }
    ]);

    const [selectedBuilding, setSelectedBuilding] = useState("Main building");

    const [name, setName] = useState("Main building");
    const [address, setAddress] = useState("Addressstraat 1");
    const [floors, setFloors] = useState("2");
    const [floorNames, setFloorNames] = useState("Floor 1\nFloor 2");
    const [shelves, setShelves] = useState("2");
    const [rows, setRows] = useState("2");

    const handleBuildingChange = (e) => {
        const buildingName = e.target.value;
        setSelectedBuilding(buildingName);

        const building = buildings.find((item) => item.name === buildingName);

        if (building) {
            setName(building.name);
            setAddress(building.address);
            setFloors(building.floors);
            setFloorNames(building.floorNames);
            setShelves(building.shelves);
            setRows(building.rows);
        }
    };

    const handleAddBuilding = () => {
        setSelectedBuilding("");
        setName("");
        setAddress("");
        setFloors("");
        setFloorNames("");
        setShelves("");
        setRows("");
    };

    const handleSaveBuilding = () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        const existingIndex = buildings.findIndex(
            (building) => building.name === selectedBuilding
        );

        const buildingData = {
            id: existingIndex >= 0 ? buildings[existingIndex].id : Date.now(),
            name,
            address,
            floors,
            floorNames,
            shelves,
            rows
        };

        if (existingIndex >= 0) {
            const updatedBuildings = [...buildings];
            updatedBuildings[existingIndex] = buildingData;
            setBuildings(updatedBuildings);
            setSelectedBuilding(name);
        } else {
            setBuildings([...buildings, buildingData]);
            setSelectedBuilding(name);
        }
    };

    const handleEmployeeQrScan = (employeeId) => {
        console.log("Scanned employee ID:", employeeId);
        setShowScanEmployeeQrModal(false);

        // later:
        // fetch employee info here
    };

    const filteredBuildings = buildings.filter((building) =>
        building.name.toLowerCase().includes(buildingSearch.toLowerCase())
    );

    const floorList = floorNames
        .split("\n")
        .map((floor) => floor.trim())
        .filter((floor) => floor !== "");

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
                        />
                        <button className="manager-search-button">🔍</button>
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
                    >
                        Add building
                    </button>
                </div>

                <div className="building-info-header">
                    <h2>Building information</h2>
                    <button className="edit-button" onClick={handleSaveBuilding}>
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

                    <div className="form-group small-group">
                        <label>Amount of floors</label>
                        <input
                            type="text"
                            value={floors}
                            onChange={(e) => setFloors(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group full-width-group">
                    <label>Floor names</label>

                    <textarea
                        value={floorNames}
                        onChange={(e) => setFloorNames(e.target.value)}
                        rows={3}
                        placeholder="Type one floor per line"
                    />

                    <div className="floor-names-box">
                        {floorList.length > 0 ? (
                            floorList.map((floor, index) => (
                                <div key={index} className="floor-row">
                                    {index + 1}. {floor}
                                </div>
                            ))
                        ) : (
                            <div className="floor-row empty-floor-row">No floors added</div>
                        )}
                    </div>
                </div>

                <div className="manager-form-grid bottom-grid">
                    <div className="form-group small-group">
                        <label>Amount of shelves</label>
                        <input
                            type="text"
                            value={shelves}
                            onChange={(e) => setShelves(e.target.value)}
                        />
                    </div>

                    <div className="form-group small-group">
                        <label>Amount of rows</label>
                        <input
                            type="text"
                            value={rows}
                            onChange={(e) => setRows(e.target.value)}
                        />
                    </div>
                </div>

                {showScanEmployeeQrModal && (
                    <ScanEmployeeQrModal
                        onClose={() => setShowScanEmployeeQrModal(false)}
                        onScan={handleEmployeeQrScan}
                    />
                )}
            </main>
        </div>
    );
};

export default Manager;
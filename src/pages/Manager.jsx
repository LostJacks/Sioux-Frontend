import { useState, useEffect } from "react";
import "../styles/manager.css";
import Sidebar from "../components/Sidebar";
import ScanQrModal from "../components/ScanQrModal";

const API_BASE = "http://localhost:8080/api";

const mapApiBuilding = (b) => ({
    id: b.id,
    name: b.name,
    address: b.address || "",
    shelves: (b.floors?.[0]?.shelves || []).map((s, i) => ({
        id: s.id,
        name: `Shelf ${s.shelfNumber ?? i + 1}`,
        rowCount: s.rows?.length ?? 0,
    })),
});

const Manager = ({ currentRole, setCurrentRole, setCurrentUser }) => {
    const [buildingSearch, setBuildingSearch] = useState("");
    const [showScanEmployeeQrModal, setShowScanEmployeeQrModal] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [shelfName, setShelfName] = useState("");
    const [shelfRowCount, setShelfRowCount] = useState("");
    const [shelves, setShelves] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/buildings/full`)
            .then((r) => r.json())
            .then((data) => setBuildings(data.map(mapApiBuilding)))
            .catch(() => {});
    }, []);

    const loadBuildingIntoForm = (building) => {
        setSelectedBuilding(building);
        setName(building.name);
        setAddress(building.address);
        setShelves(building.shelves || []);
        setShelfName("");
        setShelfRowCount("");
        setSaveError(null);
    };

    const handleBuildingChange = (e) => {
        const building = buildings.find((b) => String(b.id) === e.target.value);
        if (building) loadBuildingIntoForm(building);
    };

    const handleSearchBuilding = () => {
        const term = buildingSearch.trim().toLowerCase();
        if (!term) return;
        const found = buildings.find((b) => b.name.toLowerCase().includes(term));
        if (found) loadBuildingIntoForm(found);
    };

    const handleAddBuilding = () => {
        setSelectedBuilding(null);
        setName("");
        setAddress("");
        setShelves([]);
        setShelfName("");
        setShelfRowCount("");
        setSaveError(null);
    };

    const handleAddShelf = () => {
        const trimmed = shelfName.trim();
        const count = Number(shelfRowCount);
        if (!trimmed || !shelfRowCount.trim() || isNaN(count) || count <= 0) return;
        setShelves((prev) => [...prev, { id: Date.now(), name: trimmed, rowCount: count }]);
        setShelfName("");
        setShelfRowCount("");
    };

    const handleRemoveShelf = (shelfId) => {
        setShelves((prev) => prev.filter((s) => s.id !== shelfId));
    };

    const handleSaveBuilding = async () => {
        const trimmedName = name.trim();
        const trimmedAddress = address.trim();
        if (!trimmedName || !trimmedAddress) return;

        setSaving(true);
        setSaveError(null);

        const payload = {
            name: trimmedName,
            address: trimmedAddress,
            shelves: shelves.map((s) => ({ name: s.name, rowCount: s.rowCount })),
        };

        try {
            const res = await fetch(`${API_BASE}/buildings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save building");

            const saved = await res.json();
            const mapped = mapApiBuilding(saved);
            setBuildings((prev) => {
                const exists = prev.find((b) => b.id === mapped.id);
                return exists ? prev.map((b) => (b.id === mapped.id ? mapped : b)) : [...prev, mapped];
            });
            setSelectedBuilding(mapped);
        } catch (e) {
            setSaveError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEmployeeQrScan = () => {
        setShowScanEmployeeQrModal(false);
    };

    const filteredBuildings = buildings.filter((b) =>
        b.name.toLowerCase().includes(buildingSearch.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} setCurrentUser={setCurrentUser} />

            <main className="manager-content">
                <div className="manager-top-row">
                    <div className="manager-search-bar">
                        <input
                            type="text"
                            placeholder="Building search"
                            value={buildingSearch}
                            onChange={(e) => setBuildingSearch(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSearchBuilding(); }}
                        />
                        <button className="manager-search-button" type="button" onClick={handleSearchBuilding}>
                            🔍
                        </button>
                    </div>

                    <button className="scan-employee-button" onClick={() => setShowScanEmployeeQrModal(true)}>
                        Scan Employee QR
                    </button>
                </div>

                <div className="manager-building-row">
                    <select
                        value={selectedBuilding?.id ?? ""}
                        onChange={handleBuildingChange}
                        className="building-select"
                    >
                        <option value="">Choose a building</option>
                        {filteredBuildings.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>

                    <span className="or-text">OR</span>

                    <button className="add-building-button" onClick={handleAddBuilding} type="button">
                        Add building
                    </button>
                </div>

                <div className="building-info-header">
                    <h2>Building information</h2>
                    <button className="edit-button" onClick={handleSaveBuilding} type="button" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                    {saveError && <span style={{ color: "red", fontSize: 13 }}>{saveError}</span>}
                </div>

                <div className="manager-form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
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
                            min="1"
                        />
                    </div>

                    <button className="add-shelf-button" onClick={handleAddShelf} type="button">
                        Add shelf
                    </button>
                </div>

                <div className="form-group full-width-group">
                    <label>Added shelves</label>

                    <div className="floor-names-box">
                        {shelves.length > 0 ? (
                            shelves.map((shelf, index) => (
                                <div key={shelf.id} className="floor-row">
                                    <span>{index + 1}. {shelf.name} — {shelf.rowCount} rows</span>
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
                            <div className="floor-row empty-floor-row">No shelves added</div>
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

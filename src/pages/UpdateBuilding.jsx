import { useState, useEffect } from "react";
import "../styles/manager.css";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost:8080/api";

const mapApiBuilding = (b) => ({
    id: b.id,
    name: b.name,
    address: b.address || "",
    floorNumber: b.floors?.[0]?.floorNumber ?? 1,
    shelves: (b.floors?.[0]?.shelves || []).map((s, i) => ({
        id: s.id,
        name: `Shelf ${s.shelfNumber ?? i + 1}`,
        rowCount: s.rows?.length ?? 0,
    })),
});

const UpdateBuilding = ({ currentRole, setCurrentRole, setCurrentUser, currentUser }) => {
    const [buildingSearch] = useState("");
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [floorNumber, setFloorNumber] = useState("1");
    const [shelfName, setShelfName] = useState("");
    const [shelfRowCount, setShelfRowCount] = useState("");
    const [shelves, setShelves] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [shelfDeleteModal, setShelfDeleteModal] = useState(null);

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
        setFloorNumber(String(building.floorNumber ?? 1));
        setFloorNumber(String(building.floorNumber ?? 1));
        setShelves(building.shelves || []);
        setShelfName("");
        setShelfRowCount("");
        setSaveError(null);
    };

    const handleBuildingChange = (e) => {
        const building = buildings.find((b) => String(b.id) === e.target.value);
        if (building) loadBuildingIntoForm(building);
    };

    const handleAddShelf = () => {
        const trimmed = shelfName.trim();
        const count = Number(shelfRowCount);
        if (!trimmed || !shelfRowCount.trim() || isNaN(count) || count <= 0) return;
        setShelves((prev) => [...prev, { id: Date.now(), name: trimmed, rowCount: count, isNew: true }]);
        setShelfName("");
        setShelfRowCount("");
    };

    const handleRemoveShelf = async (shelf) => {
        if (shelf.isNew) {
            setShelves((prev) => prev.filter((s) => s.id !== shelf.id));
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/buildings/shelves/${shelf.id}/check`);
            const data = await res.json();
            if (data.hasPendingPackages) {
                setShelfDeleteModal({ type: "blocked" });
            } else {
                setShelfDeleteModal({ type: "confirm", shelfId: shelf.id });
            }
        } catch {
            setShelfDeleteModal({ type: "blocked" });
        }
    };

    const confirmDeleteShelf = async () => {
        const { shelfId } = shelfDeleteModal;
        try {
            await fetch(`${API_BASE}/buildings/shelves/${shelfId}`, { method: "DELETE" });
            setShelves((prev) => prev.filter((s) => s.id !== shelfId));
        } catch {
            // deletion failed silently; leave shelf in list
        } finally {
            setShelfDeleteModal(null);
        }
    };

    const handleSaveBuilding = async () => {
        const trimmedName = name.trim();
        const trimmedAddress = address.trim();
        const parsedFloor = Number(floorNumber);
        if (!trimmedName || !trimmedAddress || !selectedBuilding || Number.isNaN(parsedFloor) || parsedFloor <= 0) return;

        setSaving(true);
        setSaveError(null);

        const payload = {
            name: trimmedName,
            address: trimmedAddress,
            floorNumber: parsedFloor,
            shelves: shelves
                .filter((s) => s.isNew)
                .map((s) => ({ name: s.name, rowCount: s.rowCount })),
        };

        try {
            const res = await fetch(`${API_BASE}/buildings/${selectedBuilding.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save building");

            const saved = await res.json();
            const mapped = mapApiBuilding(saved);
            setBuildings((prev) => prev.map((b) => (b.id === mapped.id ? mapped : b)));
            setSelectedBuilding(mapped);
            setShelves(mapped.shelves || []);
        } catch (e) {
            setSaveError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredBuildings = buildings.filter((b) =>
        b.name.toLowerCase().includes(buildingSearch.toLowerCase())
    );

    const disabled = !selectedBuilding;

    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} setCurrentUser={setCurrentUser} currentUser={currentUser} />

            <main className="manager-content">
                <div className="manager-top-row">
                    <h2 style={{ margin: 0 }}>Update building</h2>
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
                </div>

                <div className="building-info-header">
                    <h2>Building information</h2>
                </div>

                <div className="manager-form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={disabled} />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} disabled={disabled} />
                    </div>

                    <div className="form-group">
                        <label>Floor number</label>
                        <input
                            type="number"
                            min="1"
                            value={floorNumber}
                            onChange={(e) => setFloorNumber(e.target.value)}
                            disabled={disabled}
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
                            disabled={disabled}
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
                            disabled={disabled}
                        />
                    </div>

                    <button className="add-shelf-button" onClick={handleAddShelf} type="button" disabled={disabled}>
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
                                        onClick={() => handleRemoveShelf(shelf)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="floor-row empty-floor-row">
                                {selectedBuilding ? "No shelves added" : "Select a building to view shelves"}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 12, marginTop: 20 }}>
                    {saveError && <span style={{ color: "red", fontSize: 13 }}>{saveError}</span>}
                    <button className="edit-button" onClick={handleSaveBuilding} type="button" disabled={saving || disabled}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>

                {shelfDeleteModal?.type === "blocked" && (
                    <div className="qr-overlay" onClick={() => setShelfDeleteModal(null)}>
                        <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="qr-header">
                                <h3>Cannot Delete Shelf</h3>
                                <button className="qr-close" onClick={() => setShelfDeleteModal(null)}>✕</button>
                            </div>
                            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                                This shelf has packages that have not been picked up yet. Please wait until all packages are collected before deleting this shelf.
                            </p>
                            <button
                                style={{ width: "100%", height: 42, border: "none", borderRadius: 12, background: "#111111", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                                onClick={() => setShelfDeleteModal(null)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {shelfDeleteModal?.type === "confirm" && (
                    <div className="qr-overlay" onClick={() => setShelfDeleteModal(null)}>
                        <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="qr-header">
                                <h3>Delete Shelf</h3>
                                <button className="qr-close" onClick={() => setShelfDeleteModal(null)}>✕</button>
                            </div>
                            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                                Are you sure you want to delete this shelf? This action cannot be undone.
                            </p>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button
                                    style={{ flex: 1, height: 42, border: "1px solid #d9dfe7", borderRadius: 12, background: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                                    onClick={() => setShelfDeleteModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    style={{ flex: 1, height: 42, border: "none", borderRadius: 12, background: "linear-gradient(135deg,#ff6b2c,#ff8447)", color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                                    onClick={confirmDeleteShelf}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UpdateBuilding;
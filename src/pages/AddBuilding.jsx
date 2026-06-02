import { useState } from "react";
import "../styles/manager.css";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost:8080/api";

const AddBuilding = ({ currentRole, setCurrentRole, setCurrentUser }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [floorNumber, setFloorNumber] = useState("1");
    const [shelfName, setShelfName] = useState("");
    const [shelfRowCount, setShelfRowCount] = useState("");
    const [shelves, setShelves] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleAddShelf = () => {
        const trimmed = shelfName.trim();
        const count = Number(shelfRowCount);
        if (!trimmed || !shelfRowCount.trim() || isNaN(count) || count <= 0) return;
        setShelves((prev) => [...prev, { id: Date.now(), name: trimmed, rowCount: count }]);
        setShelfName("");
        setShelfRowCount("");
    };

    const handleRemoveShelf = (shelf) => {
        setShelves((prev) => prev.filter((s) => s.id !== shelf.id));
    };

    const handleSaveBuilding = async () => {
        const trimmedName = name.trim();
        const trimmedAddress = address.trim();
        const parsedFloor = Number(floorNumber);
        if (!trimmedName || !trimmedAddress || Number.isNaN(parsedFloor) || parsedFloor <= 0) return;

        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        const payload = {
            name: trimmedName,
            address: trimmedAddress,
            floorNumber: parsedFloor,
            shelves: shelves.map((s) => ({ name: s.name, rowCount: s.rowCount })),
        };

        try {
            const res = await fetch(`${API_BASE}/buildings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save building");
            await res.json();

            setName("");
            setAddress("");
            setFloorNumber("1");
            setShelves([]);
            setShelfName("");
            setShelfRowCount("");
            setSaveSuccess(true);
        } catch (e) {
            setSaveError(e.message);
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="dashboard">
            <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} setCurrentUser={setCurrentUser} />

            <main className="manager-content">

                <div className="building-info-header">
                    <h2>Building information</h2>
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

                    <div className="form-group">
                        <label>Floor number</label>
                        <input
                            type="number"
                            min="1"
                            value={floorNumber}
                            onChange={(e) => setFloorNumber(e.target.value)}
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
                                        onClick={() => handleRemoveShelf(shelf)}
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

                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 12, marginTop: 20 }}>
                    {saveError && <span style={{ color: "red", fontSize: 13 }}>{saveError}</span>}
                    {saveSuccess && <span style={{ color: "green", fontSize: 13 }}>Building added</span>}
                    <button className="edit-button" onClick={handleSaveBuilding} type="button" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AddBuilding;
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080/api";

const SPECIAL_OPTIONS = [
    {
        type: "special",
        employeeId: "__SIOUX__",
        firstName: "Sioux",
        lastName: "(Company)",
        recipientName: "Sioux",
    },
    {
        type: "special",
        employeeId: "__UNKNOWN__",
        firstName: "No Name",
        lastName: "(Unaddressed)",
        recipientName: null,
    },
];

const StorePackageModal = ({ trackingNumber, onClose, onStored }) => {
    const [employees, setEmployees] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [storedPackageId, setStoredPackageId] = useState(null);
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [broadcasting, setBroadcasting] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE}/qrcodes/employees`).then((r) => r.json()),
            fetch(`${API_BASE}/buildings/full`).then((r) => r.json()),
        ]).then(([emps, bldgs]) => {
            setEmployees(emps);
            setBuildings(bldgs);
        }).catch(() => {});
    }, []);

    const isUnknown = selectedEmployee?.employeeId === "__UNKNOWN__";
    const isSioux = selectedEmployee?.employeeId === "__SIOUX__";
    const isSpecial = isUnknown || isSioux;

    const filteredEmployees = employeeSearch && !selectedEmployee
        ? [
            ...SPECIAL_OPTIONS.filter((s) =>
                `${s.firstName} ${s.lastName}`
                    .toLowerCase()
                    .includes(employeeSearch.toLowerCase())
            ),
            ...employees.filter((e) =>
                `${e.firstName} ${e.lastName}`
                    .toLowerCase()
                    .includes(employeeSearch.toLowerCase())
            ),
          ]
        : [];

    const floors = selectedBuilding?.floors || [];
    const shelves = selectedFloor?.shelves || [];
    const rows = selectedShelf?.rows || [];

    const canSubmit = selectedEmployee && selectedRow && !submitting;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setError(null);
        setSubmitting(true);
        try {
            const body = {
                trackingNumber,
                employeeId: isSpecial ? null : selectedEmployee.employeeId,
                rowId: selectedRow.id,
                recipientName: selectedEmployee.recipientName ?? null,
            };
            const res = await fetch(`${API_BASE}/orders/store`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Failed to store package");
            const data = await res.json();

            if (isUnknown) {
                setStoredPackageId(data.pkgId ?? data.id);
            } else {
                onStored(data);
                onClose();
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBroadcast = async () => {
        if (!storedPackageId) return;
        setBroadcasting(true);
        try {
            const message = broadcastMessage.trim() ||
                "An unaddressed package has arrived at the front desk. Please come check if it is yours.";
            await fetch(`${API_BASE}/orders/${storedPackageId}/broadcast`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            onStored({});
            onClose();
        } catch {
            setError("Package stored but broadcast failed.");
            onClose();
        } finally {
            setBroadcasting(false);
        }
    };

    if (storedPackageId !== null) {
        return (
            <div className="qr-overlay" onClick={onClose}>
                <div className="store-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="qr-header">
                        <h3>Notify All Employees</h3>
                        <button className="qr-close" onClick={onClose}>✕</button>
                    </div>
                    <div className="store-modal-body">
                        <p style={{ marginBottom: "12px", color: "#666" }}>
                            Package stored. Write a message to notify all employees about this unaddressed package.
                        </p>
                        <div className="store-field">
                            <label className="store-label">Message</label>
                            <textarea
                                className="store-input"
                                rows={4}
                                placeholder="An unaddressed package has arrived at the front desk. Please come check if it is yours."
                                value={broadcastMessage}
                                onChange={(e) => setBroadcastMessage(e.target.value)}
                                style={{ resize: "vertical", fontFamily: "inherit", width: "100%" }}
                            />
                        </div>
                        {error && <p className="store-error">{error}</p>}
                        <button
                            className="store-submit"
                            onClick={handleBroadcast}
                            disabled={broadcasting}
                        >
                            {broadcasting ? "Sending..." : "Send to All Employees"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="qr-overlay" onClick={onClose}>
            <div className="store-modal" onClick={(e) => e.stopPropagation()}>
                <div className="qr-header">
                    <h3>Store Package</h3>
                    <button className="qr-close" onClick={onClose}>✕</button>
                </div>

                <div className="store-modal-body">
                    <div className="store-field">
                        <label className="store-label">Tracking Number</label>
                        <p className="store-tracking">{trackingNumber}</p>
                    </div>

                    <div className="store-field">
                        <label className="store-label">Employee</label>
                        <div className="store-autocomplete">
                            <input
                                type="text"
                                className="store-input"
                                placeholder="Search by name, or type Sioux / No Name..."
                                value={employeeSearch}
                                onChange={(e) => {
                                    setEmployeeSearch(e.target.value);
                                    setSelectedEmployee(null);
                                }}
                            />
                            {filteredEmployees.length > 0 && (
                                <ul className="store-dropdown">
                                    {filteredEmployees.slice(0, 8).map((e) => (
                                        <li
                                            key={e.employeeId}
                                            className={`store-dropdown-item${e.type === "special" ? " store-dropdown-item--special" : ""}`}
                                            onClick={() => {
                                                setSelectedEmployee(e);
                                                setEmployeeSearch(`${e.firstName} ${e.lastName}`);
                                            }}
                                        >
                                            {e.firstName} {e.lastName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {isSioux && (
                            <p className="store-field-hint" style={{ color: "#e07b00" }}>
                                All managers will be notified about this company package.
                            </p>
                        )}
                        {isUnknown && (
                            <p className="store-field-hint" style={{ color: "#e07b00" }}>
                                After storing, you can send a custom notification to all employees.
                            </p>
                        )}
                    </div>

                    <div className="store-field">
                        <label className="store-label">Building</label>
                        <select
                            className="store-select"
                            value={selectedBuilding?.id || ""}
                            onChange={(e) => {
                                const b = buildings.find((b) => b.id === Number(e.target.value));
                                setSelectedBuilding(b || null);
                                setSelectedFloor(null);
                                setSelectedShelf(null);
                                setSelectedRow(null);
                            }}
                        >
                            <option value="" disabled>Select building</option>
                            {buildings.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedBuilding && (
                        <div className="store-field">
                            <label className="store-label">Floor</label>
                            <select
                                className="store-select"
                                value={selectedFloor?.id || ""}
                                onChange={(e) => {
                                    const f = floors.find((f) => f.id === Number(e.target.value));
                                    setSelectedFloor(f || null);
                                    setSelectedShelf(null);
                                    setSelectedRow(null);
                                }}
                            >
                                <option value="" disabled>Select floor</option>
                                {floors.map((f) => (
                                    <option key={f.id} value={f.id}>Floor {f.floorNumber ?? f.id}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedFloor && (
                        <div className="store-field">
                            <label className="store-label">Shelf</label>
                            <select
                                className="store-select"
                                value={selectedShelf?.id || ""}
                                onChange={(e) => {
                                    const s = shelves.find((s) => s.id === Number(e.target.value));
                                    setSelectedShelf(s || null);
                                    setSelectedRow(null);
                                }}
                            >
                                <option value="" disabled>Select shelf</option>
                                {shelves.map((s) => (
                                    <option key={s.id} value={s.id}>Shelf {s.shelfNumber ?? s.id}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedShelf && (
                        <div className="store-field">
                            <label className="store-label">Row</label>
                            <select
                                className="store-select"
                                value={selectedRow?.id || ""}
                                onChange={(e) => {
                                    const r = rows.find((r) => r.id === Number(e.target.value));
                                    setSelectedRow(r || null);
                                }}
                            >
                                <option value="" disabled>Select row</option>
                                {rows.map((r) => (
                                    <option key={r.id} value={r.id}>Row {r.rowNumber}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {error && <p className="store-error">{error}</p>}

                    <button
                        className="store-submit"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >
                        {submitting ? "Storing..." : "Store Package"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StorePackageModal;

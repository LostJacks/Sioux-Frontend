const API_BASE = "http://localhost:8080/api";

export async function getReminderSettings() {
    const res = await fetch(`${API_BASE}/reminder-settings`);
    if (!res.ok) throw new Error("Failed to load reminder settings");
    return res.json();
}

export async function updateReminderSettings(settings) {
    const res = await fetch(`${API_BASE}/reminder-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to save reminder settings");
    return res.json();
}

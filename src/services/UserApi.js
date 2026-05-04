// User lookup helpers. Used by US-03 to populate the receptionist's
// manager-picker modal.

const API_BASE = "http://localhost:8080";

export async function listUsersByRole(role) {
    const url = role
        ? `${API_BASE}/api/users?role=${encodeURIComponent(role)}`
        : `${API_BASE}/api/users`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load users (${response.status})`);
    }

    return await response.json();
}

export function listManagers() {
    return listUsersByRole("MANAGER");
}

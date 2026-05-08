// Order REST helpers — wraps the legacy /api/orders/{id}/arrival-notification
// and /reminder-notification endpoints used by the receptionist's
// "Send reminder" button and any backend-arrival hooks.

const API_BASE = "http://localhost:8080";

export async function getArrivalNotification(orderId) {
    const response = await fetch(
        `${API_BASE}/api/orders/${orderId}/arrival-notification`,
        { method: "POST" }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch arrival notification (${response.status})`);
    }

    return await response.json();
}

export async function getPickupReminder(orderId) {
    const response = await fetch(
        `${API_BASE}/api/orders/${orderId}/reminder-notification`,
        { method: "POST" }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch pickup reminder (${response.status})`);
    }

    return await response.json();
}

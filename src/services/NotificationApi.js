// Notification REST helpers (US-03).
//
// All endpoints live under /api/notifications on the Spring backend.
// `notifyArrival` posts the optional { targetUserIds } body the
// receptionist's manager picker provides.

const API_BASE = "http://localhost:8080";

export async function listForEmployee(employeeId) {
    const response = await fetch(
        `${API_BASE}/api/notifications/employee/${employeeId}`
    );

    if (!response.ok) {
        throw new Error(`Failed to load notifications (${response.status})`);
    }

    return await response.json();
}

export async function listSince(employeeId, afterId) {
    const safeAfter = Number.isFinite(afterId) ? afterId : 0;
    const response = await fetch(
        `${API_BASE}/api/notifications/employee/${employeeId}/since?afterId=${safeAfter}`
    );

    if (!response.ok) {
        throw new Error(`Failed to poll notifications (${response.status})`);
    }

    return await response.json();
}

export async function listGlobalForManager(managerId) {
    const response = await fetch(
        `${API_BASE}/api/notifications/global/${managerId}`
    );

    if (!response.ok) {
        throw new Error(`Failed to load global notifications (${response.status})`);
    }

    return await response.json();
}

export async function markAsRead(notificationId) {
    const response = await fetch(
        `${API_BASE}/api/notifications/${notificationId}/read`,
        { method: "PATCH" }
    );

    if (!response.ok) {
        throw new Error(`Failed to mark notification as read (${response.status})`);
    }

    return await response.json();
}

/**
 * Trigger an arrival notification for an order/package.
 *
 * @param {number} orderId
 * @param {number[] | null | undefined} targetUserIds  optional manager
 *        subset for Sioux/unaddressed packages. Omit / null / [] means
 *        "fan out to every manager".
 */
export async function notifyArrival(orderId, targetUserIds) {
    const body =
        Array.isArray(targetUserIds) && targetUserIds.length > 0
            ? JSON.stringify({ targetUserIds })
            : undefined;

    const response = await fetch(
        `${API_BASE}/api/orders/${orderId}/arrival-notification`,
        {
            method: "POST",
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to trigger arrival notification (${response.status})`);
    }

    return await response.json();
}

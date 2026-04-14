const BASE_URL = "http://localhost:8080/api/orders";

export async function getAllOrders() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    return await response.json();
}

export async function getOrdersForEmployee(employeeId) {
    const response = await fetch(`${BASE_URL}/employee/${employeeId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch employee orders");
    }
    return await response.json();
}

export async function getOrderByTrackingNumber(trackingNumber) {
    const response = await fetch(`${BASE_URL}/tracking/${trackingNumber}`);
    if (!response.ok) {
        throw new Error("Failed to fetch order");
    }
    return await response.json();
}

export async function getArrivalNotification(orderId) {
    const response = await fetch(`${BASE_URL}/${orderId}/arrival-notification`, {
        method: "POST"
    });
    if (!response.ok) {
        throw new Error("Failed to fetch arrival notification");
    }
    return await response.json();
}

export async function getPickupReminder(orderId) {
    const response = await fetch(`${BASE_URL}/${orderId}/reminder-notification`, {
        method: "POST"
    });
    if (!response.ok) {
        throw new Error("Failed to fetch pickup reminder");
    }
    return await response.json();
}

export async function markOrderAsPickedUp(orderId) {
    const response = await fetch(`${BASE_URL}/${orderId}/pickup`, {
        method: "PUT"
    });
    if (!response.ok) {
        throw new Error("Failed to mark order as picked up");
    }
    return await response.json();
}
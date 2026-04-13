export async function getArrivalNotification(orderId) {
    const response = await fetch(`http://localhost:8080/api/orders/${orderId}/arrival-notification`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to fetch arrival notification");
    }

    return await response.json();
}

export async function getPickupReminder(orderId) {
    const response = await fetch(`http://localhost:8080/api/orders/${orderId}/reminder-notification`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to fetch pickup reminder");
    }

    return await response.json();
}
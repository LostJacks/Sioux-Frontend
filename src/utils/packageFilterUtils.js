export const MAIN_STATUS_FILTERS = [
    { id: "all", label: "All" },
    { id: "incoming", label: "Incoming" },
    { id: "stored", label: "Stored" },
    { id: "pickedup", label: "Picked Up" },
];

const statusValue = (order) =>
    String(order?.status || "")
        .trim()
        .toUpperCase();

const isStoredStatus = (status) =>
    status === "STORED" || status === "READY" || status === "READY_FOR_PICKUP";

const isPickedUpStatus = (status) => status === "PICKED_UP";

const isIncomingStatus = (status) => !isStoredStatus(status) && !isPickedUpStatus(status);

const statusMatches = (order, selectedStatuses) => {
    if (!selectedStatuses.length) return true;

    const status = statusValue(order);
    return selectedStatuses.some((selected) => {
        if (selected === "incoming") return isIncomingStatus(status);
        if (selected === "stored") return isStoredStatus(status);
        if (selected === "pickedup") return isPickedUpStatus(status);
        return false;
    });
};

export const matchesPackageFilters = (order, statusFilters = []) => {
    if (!statusMatches(order, statusFilters)) return false;
    return true;
};

export const getStatusSortRank = (order) => {
    const status = statusValue(order);
    if (isStoredStatus(status)) return 0;
    if (isIncomingStatus(status)) return 1;
    return 2; // picked up and anything else at bottom
};

export const formatLocationFromParts = ({ buildingName, floorNumber, shelfNumber, rowNumber }) => {
    const parts = [];
    if (buildingName) parts.push(buildingName);
    if (floorNumber != null) parts.push(`Floor ${floorNumber}`);
    if (shelfNumber != null) parts.push(`Shelf ${shelfNumber}`);
    if (rowNumber != null) parts.push(`Row ${rowNumber}`);
    return parts.join(" · ");
};

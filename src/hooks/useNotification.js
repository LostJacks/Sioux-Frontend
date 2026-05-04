import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

/**
 * Convenience hook that exposes the NotificationContext value.
 * Lives in its own file so React Fast Refresh stays happy with the
 * provider component module.
 */
export const useNotification = () => useContext(NotificationContext);

import { createContext } from "react";

/**
 * Standalone context object — kept in its own file so React Fast Refresh
 * stays happy with `NotificationContext.jsx` (which only exports the
 * Provider component) and `hooks/useNotification.js` (which only exports
 * the hook).
 */
export const NotificationContext = createContext();

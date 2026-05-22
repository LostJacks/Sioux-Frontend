import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Receptionist from "./pages/Receptionist";
import Manager from "./pages/Manager";
import Notifications from "./pages/Notifications";
import LoginPage from "./pages/LoginPage";
import { NotificationProvider } from "./context/NotificationContext";

const STORAGE_KEY = "spms.currentUser";

const readStoredUser = () => {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.id !== "number") return null;
        return parsed;
    } catch {
        return null;
    }
};

const Protected = ({ user, children }) =>
    user ? children : <Navigate to="/login" replace />;

const App = () => {
    const stored = readStoredUser();

    const [currentUser, setCurrentUserState] = useState(stored);
    const [currentRole, setCurrentRole] = useState(
        stored?.role === "admin" ? "manager" : (stored?.role || "employee")
    );

    // Persist to localStorage so reloads keep the session.
    useEffect(() => {
        if (currentUser) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
        } else {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }, [currentUser]);

    const setCurrentUser = (u) => setCurrentUserState(u);

    const userId = currentUser?.id ?? 1;

    return (
        <NotificationProvider userId={userId}>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <LoginPage
                            setCurrentRole={setCurrentRole}
                            setCurrentUser={setCurrentUser}
                        />
                    }
                />

                <Route
                    path="/"
                    element={
                        currentUser ? (
                            <Navigate to="/employee" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/employee"
                    element={
                        <Protected user={currentUser}>
                            <Dashboard
                                currentRole={currentRole}
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser}
                            />
                        </Protected>
                    }
                />

                <Route
                    path="/receptionist"
                    element={
                        <Protected user={currentUser}>
                            <Receptionist
                                currentRole={currentRole}
                                setCurrentRole={setCurrentRole}
                                setCurrentUser={setCurrentUser}
                            />
                        </Protected>
                    }
                />

                <Route
                    path="/manager"
                    element={
                        <Protected user={currentUser}>
                            <Manager
                                currentRole={currentRole}
                                setCurrentRole={setCurrentRole}
                                setCurrentUser={setCurrentUser}
                            />
                        </Protected>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <Protected user={currentUser}>
                            <Notifications
                                currentRole={currentRole}
                                setCurrentRole={setCurrentRole}
                                setCurrentUser={setCurrentUser}
                            />
                        </Protected>
                    }
                />
            </Routes>
        </NotificationProvider>
    );
};

export default App;

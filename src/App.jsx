import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Receptionist from "./pages/Receptionist";
import Manager from "./pages/Manager";
import LoginPage from "./pages/LoginPage";
import NotificationHistory from "./pages/NotificationHistory";
import { NotificationProvider } from "./context/NotificationContext";

const ProtectedRoute = ({ currentRole, allowedRoles, children }) => {
    if (!currentRole) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(currentRole)) return <Navigate to="/" replace />;
    return children;
};

const App = () => {
    const [currentRole, setCurrentRole] = useState("");

    return (
        <NotificationProvider>
            <Routes>
                <Route
                    path="/"
                    element={<LoginPage setCurrentRole={setCurrentRole} />}
                />

                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute
                            currentRole={currentRole}
                            allowedRoles={["employee", "receptionist", "manager"]}
                        >
                            <Dashboard
                                currentRole={currentRole}
                                setCurrentRole={setCurrentRole}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/receptionist"
                    element={
                        <ProtectedRoute
                            currentRole={currentRole}
                            allowedRoles={["receptionist"]}
                        >
                            <Receptionist
                                currentRole={currentRole}
                                setCurrentRole={setCurrentRole}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute
                            currentRole={currentRole}
                            allowedRoles={["manager"]}
                        >
                            <Manager
                                currentRole={currentRole}
                                setCurrentRole={setCurrentRole}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute
                            currentRole={currentRole}
                            allowedRoles={["employee", "receptionist", "manager"]}
                        >
                            <NotificationHistory
                                currentRole={currentRole}
                                setCurrentRole={setCurrentRole}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </NotificationProvider>
    );
};

export default App;
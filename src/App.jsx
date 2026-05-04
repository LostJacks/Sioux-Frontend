import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Receptionist from "./pages/Receptionist";
import Manager from "./pages/Manager";
import Notifications from "./pages/Notifications";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
    const [currentRole, setCurrentRole] = useState("receptionist");

    return (
        <NotificationProvider>
            <Routes>
                <Route path="/" element={<Navigate to="/employee" replace />} />
                <Route
                    path="/employee"
                    element={
                        <Dashboard
                            currentRole={currentRole}
                            setCurrentRole={setCurrentRole}
                        />
                    }
                />
                <Route
                    path="/receptionist"
                    element={
                        <Receptionist
                            currentRole={currentRole}
                            setCurrentRole={setCurrentRole}
                        />
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <Manager
                            currentRole={currentRole}
                            setCurrentRole={setCurrentRole}
                        />
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <Notifications
                            currentRole={currentRole}
                            setCurrentRole={setCurrentRole}
                        />
                    }
                />
            </Routes>
        </NotificationProvider>
    );
};

export default App;
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Receptionist from "./pages/Receptionist";
import Manager from "./pages/Manager";
import LoginPage from "./pages/LoginPage";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
    const [currentRole, setCurrentRole] = useState("");

    return (
        <NotificationProvider>
            <Routes>
                {/* LOGIN PAGE */}
                <Route
                    path="/"
                    element={<LoginPage setCurrentRole={setCurrentRole} />}
                />

                {/* PAGES */}
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
            </Routes>
        </NotificationProvider>
    );
};

export default App;
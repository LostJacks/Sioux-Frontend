import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Receptionist from "./pages/Receptionist";

const Manager = () => {
    return <div>Manager Page</div>;
};

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/employee" replace />} />
            <Route path="/employee" element={<Dashboard />} />
            <Route path="/receptionist" element={<Receptionist />} />
            <Route path="/manager" element={<Manager />} />
        </Routes>
    );
};

export default App;
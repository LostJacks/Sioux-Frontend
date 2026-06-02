import Sidebar from "../components/Sidebar";
import ReminderSettings from "../components/ReminderSettings";

const Settings = ({ currentRole, setCurrentRole, setCurrentUser }) => {
    return (
        <div className="dashboard">
            <Sidebar
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                setCurrentUser={setCurrentUser}
            />
            <main className="main-content">
                <ReminderSettings />
            </main>
        </div>
    );
};

export default Settings;

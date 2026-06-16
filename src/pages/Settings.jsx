import Sidebar from "../components/Sidebar";
import ReminderSettings from "../components/ReminderSettings";

const Settings = ({ currentRole, setCurrentRole, setCurrentUser, currentUser }) => {
    return (
        <div className="dashboard">
            <Sidebar
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                setCurrentUser={setCurrentUser}
                currentUser={currentUser}
            />
            <main className="main-content">
                <ReminderSettings />
            </main>
        </div>
    );
};

export default Settings;

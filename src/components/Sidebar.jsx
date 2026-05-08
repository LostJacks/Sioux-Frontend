import { NavLink, useNavigate } from "react-router-dom";
import siouxLogo from "../assets/sioux-logo.jpg";
import { useNotification } from "../hooks/useNotification";

const Sidebar = ({ currentRole, setCurrentRole, setCurrentUser }) => {
    const { unreadCount } = useNotification() || {};
    const navigate = useNavigate();

    const allowedRoles = {
        employee: [
            { label: "Employee", path: "/employee" },
            { label: "Notifications", path: "/notifications" }
        ],
        manager: [
            { label: "Employee", path: "/employee" },
            { label: "Manager", path: "/manager" },
            { label: "Notifications", path: "/notifications" }
        ],
        receptionist: [
            { label: "Employee", path: "/employee" },
            { label: "Receptionist", path: "/receptionist" },
            { label: "Notifications", path: "/notifications" }
        ]
    };

    const visibleRoles = allowedRoles[currentRole] || allowedRoles.employee;

    const handleSignOut = () => {
        if (typeof setCurrentUser === "function") {
            setCurrentUser(null);
        }
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <img src={siouxLogo} alt="Sioux Logo" className="logo" />

                <div className="role-switch">
                    <button onClick={() => setCurrentRole("employee")}>Employee</button>
                    <button onClick={() => setCurrentRole("receptionist")}>Receptionist</button>
                    <button onClick={() => setCurrentRole("manager")}>Manager</button>
                </div>

                <div className="roles-section">
                    <h2 className="roles-title">Roles</h2>

                    {visibleRoles.map((item) => {
                        const isNotifLink = item.path === "/notifications";
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? "role-button active-role" : "role-button"
                                }
                            >
                                {item.label}
                                {isNotifLink && unreadCount > 0 && (
                                    <span
                                        style={{
                                            marginLeft: 8,
                                            background: "#d12222",
                                            color: "#fff",
                                            borderRadius: "10px",
                                            padding: "2px 8px",
                                            fontSize: 12
                                        }}
                                    >
                                        {unreadCount}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            <div className="sidebar-bottom">
                <p className="current-role">
                    {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                </p>
                <button className="sign-out-button" onClick={handleSignOut}>
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

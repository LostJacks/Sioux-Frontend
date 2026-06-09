import { NavLink, useNavigate } from "react-router-dom";
import siouxLogo from "../assets/sioux-logo.jpg";
import { useNotification } from "../hooks/useNotification";

const Sidebar = ({ currentRole, setCurrentUser }) => {
    const { unreadCount } = useNotification() || {};
    const navigate = useNavigate();

    const allowedRoles = {
        employee: [
            { label: "My Packages", path: "/employee" },
            { label: "Notifications", path: "/notifications" }
        ],
        manager: [
            { label: "My Packages", path: "/employee" },
            { label: "Add building", path: "/buildings/add" },
            { label: "Update building", path: "/buildings/update" },
            { label: "Notifications", path: "/notifications" }
        ],
        receptionist: [
            { label: "My packages", path: "/employee" },
            { label: "Reception Dashboard", path: "/receptionist" },
            { label: "Notifications", path: "/notifications" },
            { label: "Notification Settings", path: "/settings" }
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

                <div className="roles-section">
                    <h2 className="roles-title">Pages</h2>

                    {visibleRoles.map((item) => {
                        const isNotifLink = item.path === "/notifications";

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive
                                        ? "role-button active-role"
                                        : "role-button"
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
                <div className="current-role">
                    <p>Signed in as:</p>
                    {currentRole === "manager"
                        ? "Building Manager"
                        : currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                </div>

                <button className="sign-out-button" onClick={handleSignOut}>
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
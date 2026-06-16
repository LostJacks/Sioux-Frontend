import { NavLink, useNavigate } from "react-router-dom";
import siouxLogo from "../assets/sioux-logo.jpg";
import { useNotification } from "../hooks/useNotification";

const Sidebar = ({ currentRole, setCurrentUser, currentUser }) => {
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
            { label: "Settings", path: "/settings" }
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
                    <p>{currentRole === "manager" ? "Building Manager" : currentRole === "receptionist" ? "Receptionist" : "Employee"}</p>
                    {currentUser
                        ? `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim() || currentUser.email
                        : currentRole}
                </div>

                <button className="sign-out-button" onClick={handleSignOut}>
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
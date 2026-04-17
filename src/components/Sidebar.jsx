import { NavLink, useNavigate } from "react-router-dom";
import siouxLogo from "../assets/sioux-logo.jpg";

const Sidebar = ({ currentRole, setCurrentRole }) => {
    const navigate = useNavigate();

    const allowedRoles = {
        employee: [
            { label: "Employee", path: "/employee" }
        ],
        manager: [
            { label: "Employee", path: "/employee" },
            { label: "Manager", path: "/manager" }
        ],
        receptionist: [
            { label: "Employee", path: "/employee" },
            { label: "Receptionist", path: "/receptionist" }
        ]
    };

    const visibleRoles = allowedRoles[currentRole] || [];

    const handleSignOut = () => {
        setCurrentRole("");
        navigate("/");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <img src={siouxLogo} alt="Sioux Logo" className="logo" />

                <div className="roles-section">
                    <h2 className="roles-title">Roles</h2>

                    {visibleRoles.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? "role-button active-role" : "role-button"
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="sidebar-bottom">
                <p className="current-role">
                    {currentRole
                        ? currentRole.charAt(0).toUpperCase() + currentRole.slice(1)
                        : "Not signed in"}
                </p>
                <button className="sign-out-button" onClick={handleSignOut}>
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
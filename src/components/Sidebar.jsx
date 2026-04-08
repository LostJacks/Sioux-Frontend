import { NavLink } from "react-router-dom";
import siouxLogo from "../assets/sioux-logo.jpg";

const Sidebar = ({ currentRole, setCurrentRole }) => {
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

    const visibleRoles = allowedRoles[currentRole] || allowedRoles.employee;

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
                    {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                </p>
                <button className="sign-out-button">Sign out</button>
            </div>
        </aside>
    );
};

export default Sidebar;
import { NavLink, useLocation } from "react-router-dom";
import siouxLogo from "../assets/sioux-logo.jpg";

const Sidebar = () => {
    const location = useLocation();

    const getCurrentRole = () => {
        if (location.pathname === "/employee") {
            return "Employee";
        }

        if (location.pathname === "/manager") {
            return "Manager";
        }

        if (location.pathname === "/receptionist") {
            return "Receptionist";
        }

        return "Employee";
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <img src={siouxLogo} alt="Sioux Logo" className="logo" />

                <div className="roles-section">
                    <h2 className="roles-title">Roles</h2>

                    <NavLink
                        to="/employee"
                        className={({ isActive }) =>
                            isActive ? "role-button active-role" : "role-button"
                        }
                    >
                        Employee
                    </NavLink>

                    <NavLink
                        to="/manager"
                        className={({ isActive }) =>
                            isActive ? "role-button active-role" : "role-button"
                        }
                    >
                        Manager
                    </NavLink>

                    <NavLink
                        to="/receptionist"
                        className={({ isActive }) =>
                            isActive ? "role-button active-role" : "role-button"
                        }
                    >
                        Receptionist
                    </NavLink>
                </div>
            </div>

            <div className="sidebar-bottom">
                <p className="current-role">{getCurrentRole()}</p>
                <button className="sign-out-button">Sign out</button>
            </div>
        </aside>
    );
};

export default Sidebar;
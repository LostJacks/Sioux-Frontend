import siouxLogo from "../assets/sioux-logo.jpg";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <img src={siouxLogo} alt="Sioux Logo" className="logo" />

              <div className="roles-section">
                  <h2 className="roles-title">Roles</h2>

                  <button className="role-button active-role">Employee</button>
                  <button className="role-button">Manager</button>
                  <button className="role-button">Receptionist</button>
              </div>
      </div>

      <div className="sidebar-bottom">
        <p className="current-role">Employee</p>
        <button className="sign-out-button">Sign out</button>
      </div>
    </aside>
  );
};

export default Sidebar;
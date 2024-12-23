import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import './SideBar.css';

function SideBar() {
  const location = useLocation(); // Hook to get the current location

  return (
    <div className="SideBar">
      <Link to="/login">
        <button
          type="button"
          className={location.pathname === '/login' ? 'active' : ''}
        >
          User Access
        </button>
      </Link>
      <Link to="/project">
        <button
          type="button"
          className={location.pathname === '/project' ? 'active' : ''}
        >
          Project Access
        </button>
      </Link>
    </div>
  );
}

export default SideBar;

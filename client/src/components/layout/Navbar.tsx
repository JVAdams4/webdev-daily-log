import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const titleStyle = {
    backgroundColor: 'hsl(75, 94%, 57%)',
    color: '#4f2f4f',
    fontSize: '1.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem'
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <span style={titleStyle}>WebDev Daily Log</span>
        </Link>
        {user && <button className="btn btn-outline-danger" onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
};
export default Navbar;
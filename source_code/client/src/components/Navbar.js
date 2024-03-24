import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'; // Import the CSS module

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
      <li><Link to="/movies">3rd party API</Link></li> {/* Adding Movie List to navbar */}
        <li><Link to="/add">Create an Inventory</Link></li>  
        <li><Link to="/"> Explore Inventory </Link></li>
              
        <li><a href="http://3.17.65.244/" target="_blank" rel="noopener noreferrer">My Profile</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;

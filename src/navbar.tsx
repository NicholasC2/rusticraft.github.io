import { Link } from "react-router-dom";
import "./navbar.css";
import Logo from "/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>

      <div className="dropdown">
        <span className="dropdown-trigger">Seasons</span>

        <div className="dropdown-menu">
          <Link to="/season1">Season 1</Link>
          <Link to="/season1.5">Season 1.5</Link>
        </div>
      </div>

      <Link to="/join">Join</Link>

      <div className="spacer" />

      <img src={Logo} alt="Logo" className="logo" />
    </nav>
  );
}

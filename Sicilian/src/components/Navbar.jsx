import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <section className="navbar-links">
        <ul className="navbar-list">
          <li className="navbar-item">
            <NavLink to="/home">Hem</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/min-sida">Mina bokningar</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/logga-in">Logga in</NavLink>
          </li>
        </ul>
      </section>
    </nav>
  );
};

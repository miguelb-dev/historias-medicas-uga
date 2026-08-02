import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.css";

export const Sidebar = () => {
  return (
    <nav className={styles.sidebar} id="sidebar">
      <ul>
        <li>
          <NavLink to="/rendimiento">Rendimiento</NavLink>
        </li>
        <li>
          <NavLink to="/facturas">Facturas</NavLink>
        </li>
      </ul>
    </nav>
  );
};

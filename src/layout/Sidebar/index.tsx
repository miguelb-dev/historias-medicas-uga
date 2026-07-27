import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

export const Sidebar = () => {
  return (
    <nav className={styles.sidebar} id="sidebar">
      <ul>
        <li>
          <Link to="/rendimiento">Rendimiento</Link>
        </li>
        <li>
          <Link to="/historias">Historias Médicas</Link>
        </li>
      </ul>
    </nav>
  );
};

// Configuración para las páginas
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./config/AppRoutes";

// Layout
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { Footer } from "./layout/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Sidebar></Sidebar>
      <main id="main">
        <AppRoutes></AppRoutes>
      </main>
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;

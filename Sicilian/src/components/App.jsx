import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import  Footer  from "./Footer";

export function App() {
  return (
    <div className = "wrapper">
      <Navbar />
      <div className = "content">
        <Outlet />
      </div>
      <Footer />
    </ div>
  );
}

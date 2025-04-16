import "../styling/App.css";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import  Footer  from "./Footer";

export function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

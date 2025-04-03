import '../styling/App.css'
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Logga } from "./Logga";


  export function App() {
    return (
      <>
        <Logga />
        <Navbar />
        <Outlet />
      </>
    );
  }



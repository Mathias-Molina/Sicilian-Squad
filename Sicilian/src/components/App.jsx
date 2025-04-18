import "../styling/App.css";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function App() {
  return (
    <>
      <Navbar />
      <main className="fade-container">
        <Outlet />
      </main>
    </>
  );
}

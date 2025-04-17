import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import "../styling/App.css";
export function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </ >
  );
};
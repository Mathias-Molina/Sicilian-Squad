import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
  } from "react-router-dom";
  import { App } from "./components/App";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<App />} path="/">
        <Route
          element={
            <section>
              <h1>404</h1>
            </section>
          }
          path="*"
        />
        
    )
  );
  
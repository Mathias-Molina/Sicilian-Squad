import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { App } from "./components/App";
import { Hem } from "./views/Hem";
import { MinaBokningar } from "./views/MinaBokningar";
import { LoggaIn } from "./views/LoggaIn";
import { MovieDetailsView } from "./views/MovieDetailsView";
import { BokningsView } from "./views/BokningsView";

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
      <Route path="/home" element={<Hem />} />
      <Route path="/min-sida" element={<MinaBokningar />} />
      <Route path="/logga-in" element={<LoggaIn />} />
      <Route path="/film/:movieId" element={<MovieDetailsView />} />
      <Route path="/boka" element={<BokningsView />} />
    </Route>
  )
);

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Router,
} from "react-router-dom";
import UploudPage from "./pages/UploadPage";
import { Dashboard } from "./pages/Dashboard";
import { PrimeReactProvider } from "primereact/api";

function Routes() {
  return (
    <BrowserRouter>
      <Router>
        <Route element={<UploudPage />} path="/upload" />
        <Route element={<Dashboard />} path="/dashboard" />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Router>
    </BrowserRouter>
  );
}

export default Routes;

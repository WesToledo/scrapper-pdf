import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Router,
} from "react-router-dom";
import UploudPage from "./pages/UploadPage";
import { Dashboard } from "./pages/DashboardPage";
import { PrimeReactProvider } from "primereact/api";
import { DownloadPage } from "./pages/DownloadPage";

function Routes() {
  return (
    <BrowserRouter>
      <Router>
        <Route element={<UploudPage />} path="/upload" />
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<DownloadPage />} path="/download" />
        <Route path="/" element={<Navigate to="/upload" replace />} />
      </Router>
    </BrowserRouter>
  );
}

export default Routes;

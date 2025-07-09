import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";

// Routing configuration:
// If a element is wrapped in ProtectedRoute, it will be protected by the AuthContext
// If a element is not wrapped in ProtectedRoute, it will be accessible by anyone
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* All other routes will be redirected to the NotFound page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;

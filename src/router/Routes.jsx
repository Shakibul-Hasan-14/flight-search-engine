import Dashboard from "../pages/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

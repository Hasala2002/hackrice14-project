import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import SecureRoute from "../utilities/SecureRoute";
import Classroom from "../pages/Classroom";
import LiveClass from "../pages/LiveClass";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<SecureRoute element={<Home />} />} />
      <Route path={"/login"} element={<Login />} />
      <Route
        path={"/classroom"}
        element={<SecureRoute element={<Classroom />} />}
      />
      <Route path={"/live"} element={<LiveClass />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;

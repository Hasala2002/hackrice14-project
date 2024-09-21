import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import SecureRoute from "../utilities/SecureRoute"
import Classroom from "../pages/Classroom"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={"/"} element={<SecureRoute element={<Home />} />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/classroom"} element={<Classroom />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    )
}

export default AppRoutes
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { ProtectedRoutes } from "./ProtectRoutes"; 
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import { EditProfile } from "../pages/EditProfile/EditProfile";


export const AppRoutes = () => {

   

    return (
        <BrowserRouter>
            <Routes>
                <Route path={paths.home} element={<Home />} />
                <Route path={paths.login} element={<Login />} />
                <Route path={paths.register} element={<Register />} />
                <Route path={paths.dashboard} element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
                <Route path={paths.editProfile} element={<ProtectedRoutes><EditProfile /></ProtectedRoutes>} />
            </Routes>
        </BrowserRouter>
    )
}
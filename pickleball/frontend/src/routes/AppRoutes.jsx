import { Routes, Route } from "react-router-dom";
import LayoutMain from "../layouts/layoutMain";
import Home from "../modules/Home";
import LoginPage from "../modules/auth/LoginPage";
import SignUp from "../modules/auth/SignUp";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../modules/admin/Dashboard";
import Users from "../modules/admin/User/Users";
import UserEdit from "../modules/admin/User/UserEdit";
function AppRoutesUser() {
    return (
        <Routes>
            {/* user */}
            <Route path="/" element={<LayoutMain />}>
                <Route index element={< Home/>} />
                <Route path="contact" element={<h1>Contact</h1>} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>
            {/* auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Admin */}
            <Route path="/admin/" element={<AdminLayout />}>
                <Route index element={< Dashboard/>} />
                <Route path="dashboards" element={< Dashboard/>} />
                <Route path="users" element={< Users/>} />
                <Route path="users/edit/:userId" element={< UserEdit/>} />
            </Route>
        </Routes>
    );
}

export default AppRoutesUser;
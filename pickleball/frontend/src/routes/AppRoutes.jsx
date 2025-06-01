import { Routes, Route } from "react-router-dom";
import LayoutMain from "../layouts/layoutMain";
import Home from "../modules/Home";
import LoginPage from "../modules/auth/LoginPage";
import SignUp from "../modules/auth/SignUp";
import OAuth2RedirectHandler from "../modules/auth/OAuth2RedirectHandler";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../modules/admin/Dashboard";
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
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            {/* Admin */}
            <Route path="/admin/" element={<AdminLayout />}>
                <Route index element={< Dashboard/>} />
                <Route path="settings" element={<h1>Admin Settings</h1>} />
            </Route>
        </Routes>
    );
}

export default AppRoutesUser;
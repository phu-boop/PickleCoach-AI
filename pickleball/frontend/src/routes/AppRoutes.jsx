import { Routes, Route } from "react-router-dom";
import LayoutMain from "../layouts/layoutMain";
import Home from "../modules/Home";
import LoginPage from "../modules/auth/LoginPage";
import SignUp from "../modules/auth/SignUp";
function AppRoutesUser() {
    return (
        <Routes>
            <Route path="/" element={<LayoutMain />}>
                <Route index element={< Home/>} />
                <Route path="contact" element={<h1>Contact</h1>} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default AppRoutesUser;
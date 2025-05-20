import { Routes, Route } from "react-router-dom";
import LayoutMain from "../layouts/layoutMain";
import Home from "../modules/Home";
function AppRoutesUser() {
    return (
        <Routes>
            <Route path="/" element={<LayoutMain />}>
                <Route index element={< Home/>} />
                <Route path="about" element={<h1>About</h1>} />
                <Route path="contact" element={<h1>Contact</h1>} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>
        </Routes>
    );
}

export default AppRoutesUser;
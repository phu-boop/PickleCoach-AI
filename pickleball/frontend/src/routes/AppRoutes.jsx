// src/routes/AppRoutesUser.js
import { Routes, Route } from 'react-router-dom';
import LayoutMain from '../layouts/layoutMain';
import Home from '../modules/Home';
import LoginPage from '../modules/auth/LoginPage';
import SignUp from '../modules/auth/SignUp';
import OAuth2RedirectHandler from '../modules/auth/OAuth2RedirectHandler';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../modules/admin/Dashboard';
import Users from '../modules/admin/User/Users';
import UserEdit from '../modules/admin/User/UserEdit';
import ProtectedRoute from '../components/ProtectedRoute';
import Tests from '../modules/admin/Tests/Tests';
import EditQuestion from '../modules/admin/Tests/EditQuestion';
import InputAssessment from '../modules/pages/InputAssessment';
import QuizPage from '../modules/pages/QuizApp';

function AppRoutesUser() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<LayoutMain />}>
                <Route index element={<Home />} />
                <Route path="contact" element={<h1>Contact</h1>} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            {/* Protected routes - Yêu cầu người dùng đã đăng nhập */}
            <Route
                path="/"
                element={
                    <ProtectedRoute requiredRole="USER"> {/* Sử dụng "USER" thay vì "ROLE_USER" */}
                        <LayoutMain />
                    </ProtectedRoute>
                }
            >
                <Route path="input-assessment" element={<InputAssessment />} />
                <Route path="quiz" element={<QuizPage />} />
            </Route>
            {/* Admin routes - Yêu cầu ROLE_ADMIN */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requiredRole="admin"> {/* Sử dụng "admin" thay vì "ROLE_admin" */}
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="dashboards" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="users/edit/:userId" element={<UserEdit />} />
                <Route path="tests" element={<Tests />} />
                <Route path="tests/edit/:id" element={<EditQuestion />} />
            </Route>
        </Routes>
    );
}

export default AppRoutesUser;
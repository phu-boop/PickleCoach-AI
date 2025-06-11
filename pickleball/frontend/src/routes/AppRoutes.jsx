import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
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
import Learner from '../modules/admin/Learner/Learner';
import HomePage from '../modules/pages/learner/HomePage';
import LessonDetailPage from '../modules/pages/learner/LessonDetailPage';
import CourseManager from '../modules/admin/Learnerning/CourseManager';
import LessonManager from '../modules/admin/Learnerning/LessonManager';
import LearnerProgress from '../modules/admin/Learnerning/LearnerProgress';
//import Profile from '../modules/pages/learner/Profile'; 

function AppRoutesUser() {
  const {id_user } = useAuth(); 
  const userId = id_user ; 

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

      {/* Protected routes - Yêu cầu người dùng đã đăng nhập (ROLE_USER) */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="ROLE_USER">
            <LayoutMain />
          </ProtectedRoute>
        }
      >
        <Route path="input-assessment" element={<InputAssessment />} />
        <Route path="quiz" element={<QuizPage />} />
      </Route>

      {/* Protected routes - Yêu cầu người dùng role là learner (ROLE_learner) */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="ROLE_learner">
            <LayoutMain />
          </ProtectedRoute>
        }
      >
        <Route path="learner" element={<HomePage userId={userId} />} />
        <Route path="lessons/:id" element={<LessonDetailPage userId={userId} />} />
      </Route>

      {/* Admin routes - Yêu cầu ROLE_ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ROLE_admin">
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
        <Route path="learners" element={<Learner />} />
        <Route path="courses" element={<CourseManager />} />
        <Route path="lessons" element={<LessonManager />} />
        <Route path="learner-progress" element={<LearnerProgress />} />
      </Route>
    </Routes>
  );
}

export default AppRoutesUser;
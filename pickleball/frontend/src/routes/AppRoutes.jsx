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
import ForgotPasswordEmail from '../modules/auth/ForgotPasswordEmail'; // (note: thêm mới)
import EnterOTP from '../modules/auth/EnterOTP'; // (note: thêm mới)
import ResetPassword from '../modules/auth/ResetPassword'; // (note: thêm mới)
import CourseCard from'../modules/pages/learner/CourseCard';
import LessonByCourse from'../modules/pages/learner/LessonByCourse';
import Register from '../modules/pages/user/Register';
import Verifying from '../modules/pages/user/Verifying';
import Coach from '../modules/admin/coach/Coach';
import CoachDashboard from '../modules/pages/coach/CoachDashboard';
import CoachSchedule from '../modules/pages/coach/CoachSchedule';
import CoachBookingPage from '../modules/pages/learner/lCoachBookingPage';
import UploadVideo from '../modules/pages/UploadVideo'; 
import ProfileDetail from '../modules/pages/learner/detail_profile/ProfileDetails'; 
import ReviewCoach from '../modules/pages/learner/ReviewCoach';
import DetailCoach from '../modules/pages/DetailCoach';
import CoachVideoCall from '../modules/pages/coach/CoachVideoCall';
import LearnerVideoCall from '../modules/pages/learner/LearnerVideoCall';
import Organize from '../modules/pages/user/Organize';
import Earn from '../modules/pages/user/Earn';
import Gear from '../modules/pages/user/Gear';
import Learn from '../modules/pages/user/Learn';

function AppRoutesUser() {
    const { id_user } = useAuth();
    const userId = id_user;

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<LayoutMain />}>
                <Route path="earn" element={<Earn />} />
                <Route path="organize" element={<Organize />} />
                <Route path="gear" element={<Gear />} />
                <Route path="learn" element={<Learn />} />
                <Route index element={<Home />} />
                <Route path="contact" element={<h1>Contact</h1>} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
                <Route path='coach_register' element={<Register />} />
                <Route path='verifying' element={<Verifying />} />
                <Route path="coach" element={<CoachDashboard />} />
                <Route path="coach_schedule" element={<CoachSchedule />} />
                <Route path="coach_video_call/:roomId" element={<CoachVideoCall />} />
                <Route path="learner_video_call/:roomId" element={<LearnerVideoCall />} />
                <Route path="profile" element={<ProfileDetail />} />
                <Route path="upload-video" element={<UploadVideo />} />
            </Route>
            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} /> {/* Route duy nhất cho OAuth2 callback */}
            <Route path="/auth/forgot-password-email" element={<ForgotPasswordEmail />} /> {/* (note: thêm mới) */}
            <Route path="/auth/enter-otp" element={<EnterOTP />} /> {/* (note: thêm mới) */}
            <Route path="/auth/reset-password" element={<ResetPassword />} /> {/* (note: thêm mới) */}

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
        <Route path="DetailCoach/:id" element={<DetailCoach />} />
        <Route path="review-coach" element={<ReviewCoach />} />
        <Route path="learner" element={<HomePage userId={userId} />} />
        <Route path="lessons/:id" element={<LessonDetailPage userId={userId} />} />
        <Route path="course/:id" element={<LessonByCourse/>}/>
        <Route path="learner_CoachBookingPage" element={<CoachBookingPage />} />
      </Route>
        {/* Protected routes - Yêu cầu người dùng role là learner (ROLE_coach) */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="ROLE_coach">
            <LayoutMain />
          </ProtectedRoute>
        }
      >
        <Route path="Detail_coach/:id" element={<DetailCoach />} />
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
                <Route path="coach" element={<Coach />} />
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
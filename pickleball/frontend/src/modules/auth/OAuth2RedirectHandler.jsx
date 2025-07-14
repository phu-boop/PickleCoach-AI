// src/modules/auth/OAuth2RedirectHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");
    const message = params.get("message");

    console.log("Initial Token:", token);
    console.log("Initial Role:", role);
    console.log("Initial Message:", message);

    if (token && role) {
      // Chuẩn hóa role: nếu không có "ROLE_", thêm vào
      const normalizedRole = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", normalizedRole);

      Swal.fire({
        title: message || "Login successful",
        icon: "success",
        draggable: true,
        timer: 1500,
      }).then(() => {
        if (normalizedRole === 'ROLE_admin') {
          navigate('/admin');
        } else if (normalizedRole === 'ROLE_USER') {
          navigate('/');
        } else {
          navigate('/login');
        }
      });
    } else {
      console.error("Token or role is missing");
      navigate('/login');
    }
  }, []);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;

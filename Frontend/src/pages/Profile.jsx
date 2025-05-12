import React from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { logout, email } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="w-50 mx-auto border p-4 text-center">
        <h3 className="mb-3">Email</h3>
        <p className="mb-4">{email}</p>
        <button className="btn btn-danger" onClick={handleLogout}>
          🔒 Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

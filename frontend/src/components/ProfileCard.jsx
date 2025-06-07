import React from "react";
import "../App.css"; // Make sure this is imported or import separate CSS file
import Avatar from "./avatar.jpg";

const ProfileCard = ({ profile }) => {
  return (
    <div className="profile-card">
      <img
        src={profile.images?.[0]?.url || Avatar}
        alt="Profile"
        className="profile-img"
      />
      <h2>{profile?.display_name || "Anonymus"}</h2>
      <p>📧 {profile?.email}</p>
      <p>🌍 {profile?.country}</p>
    </div>
  );
};

export default ProfileCard;

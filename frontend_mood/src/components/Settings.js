import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Settings.css";
import { VscFeedback } from "react-icons/vsc";
import { FaHome, FaCog, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Fetch user data when the page loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/update-user/${userId}/`);
        const data = await response.json();
        if (response.ok) {
          setUserData({ ...data, password: "" }); // Don't pre-fill password
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    let updatedUserData = { ...userData };
    if (!updatedUserData.password) {
        delete updatedUserData.password; // Don't send password if empty
    }

    console.log("Sending data:", updatedUserData);

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/update-user/${userId}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUserData),
        });

        const updatedData = await response.json();
        console.log("Response received:", updatedData);

        if (response.ok) {
            alert("Profile updated successfully!");
            setUserData({ ...updatedData, password: "" });
        } else {
            alert("Update failed. Please try again.");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
};


  return (
    <div className="homepage-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">NIRVANA</h2>
        <nav>
          <ul>
            <li><Link to="/home"><FaHome /> Homepage</Link></li>
            <li><Link to="/moodanalytics"><FaChartBar /> Mood Analytics</Link></li>
            <li><Link to="/therapistappointment"><FaUserMd /> Therapist Appointment</Link></li>
            <li><Link to="/meditation"><FaSpa /> Meditation</Link></li>
            <li><Link to="/journal"><FaBook /> Journal</Link></li>
            <li><Link to="/notification"><FaBell /> Notifications</Link></li>
            <li><Link to="/messaging"><FaComments /> Messaging</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header>
          <div className="user-info">
            <span className="username">Hello, {username} 👋</span>
          </div>
          <h1>Profile Management</h1>
          <div className="header-buttons">
            <button className="settings-button" onClick={() => navigate("/settings")}>
              <FaCog />
            </button>
            <button className="logout" onClick={() => navigate("/")}>
              <FaSignOutAlt /> LOG OUT
            </button>
          </div>
        </header>

        {/* Settings Form */}
        <div className="settings-container">
          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label>First Name:</label>
              <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Last Name:</label>
              <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Email:</label>
              <input type="email" name="email" value={userData.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Password:</label>
              <input type="password" name="password" value={userData.password} onChange={handleChange} />
            </div>

            <button type="submit" className="update-button">Update</button>


          </form>

          <button className="footer-buttons" onClick={() => navigate("/feedback")}>
          <VscFeedback /> {/* Settings Icon */}
      </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

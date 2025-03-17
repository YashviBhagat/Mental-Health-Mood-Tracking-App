import React from "react";
import { FaHome, FaChartBar, FaCalendarAlt, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Ensure this file exists and is correctly referenced

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged Out!");
    navigate("/");
  };

  return (
    <div className="homepage-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2 className="logo">NIRVANA</h2>
        <p className="tagline">Nurture your mind, embrace your journey</p>
        <nav>
          <ul>
            <li><FaHome /> Homepage</li>
            <li><FaChartBar /> Mood Analytics Insights</li>
            <li><FaUserMd /> Therapist Appointment</li>
            <li><FaSpa /> Meditation</li>
            <li><FaBook /> Journal</li>
            <li><FaBell /> Notifs & Reminders</li>
            <li><FaComments /> Messaging</li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <h1>HOMEPAGE</h1>
          <div className="header-buttons">
            <button className="settings"><FaCog /></button>
            <button className="logout" onClick={handleLogout}><FaSignOutAlt /> LOG OUT</button>
          </div>
        </header>

        {/* Mood Selection */}
        <section className="mood-selection">
          <h2>HELLO!</h2>
          <p>What's your mood like today? 🌈</p>
          <div className="mood-options">
            {["Happy", "Excited", "Sad", "Nervous", "Worried", "Bored", "Angry"].map((mood) => (
              <div key={mood} className="mood">
                <span>{mood}</span>
                <div className="stars">⭐ ⭐ ⭐ ⭐ ⭐</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

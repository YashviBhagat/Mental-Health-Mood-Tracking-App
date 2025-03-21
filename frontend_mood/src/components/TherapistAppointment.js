import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";
import { FaPlus, FaHome ,FaTrash,FaCog, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";
import "./journal.css"; // Ensure CSS file exists

const TherapistAppointment = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    
    const username = localStorage.getItem("username");


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
                    <h1>Therapist Appointment</h1>

                    <div className="header-buttons">
                        <button className="settings-button" onClick={() => navigate("/settings")}>
                            <FaCog />
                        </button>
                        <button className="logout" onClick={() => navigate("/")}>
                            <FaSignOutAlt /> LOG OUT
                        </button>
                    </div>
                    
                </header>

                <div className="journal-container">
                    
                
                </div>
            </div>

            {/* Feedback Button */}
            <button className="footer-buttons" onClick={() => navigate("/feedback")}>
                <VscFeedback />
            </button>
        </div>
    );
};

export default TherapistAppointment;
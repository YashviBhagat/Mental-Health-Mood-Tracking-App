import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";
import { FaHome, FaCog, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";
import "./feedback.css"; // Ensure this file exists
import { BsEmojiSmile, BsEmojiNeutral, BsEmojiLaughing, BsEmojiFrown, BsEmojiAngry } from "react-icons/bs";

const feedbackOptions = [
    { label: "Excellent", rating: 6, icon: <BsEmojiLaughing className="icon excellent" /> },
    { label: "Great", rating: 5, icon: <BsEmojiSmile className="icon great" /> },
    { label: "Good", rating: 4, icon: <BsEmojiNeutral className="icon good" /> },
    { label: "Okay", rating: 3, icon: <BsEmojiNeutral className="icon okay" /> },
    { label: "Bad", rating: 2, icon: <BsEmojiFrown className="icon bad" /> },
    { label: "Very Bad", rating: 1, icon: <BsEmojiAngry className="icon very-bad" /> },
];

const Feedback = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    
    // ✅ Declare states correctly
    const [selected, setSelected] = useState(null);
    const [comment, setComment] = useState(""); // ✅ Define comment state

    const submitFeedback = async () => {
        
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/submit/${userId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                      
                },
                body: JSON.stringify({ rating: selected, comment }),
            });
    
            const data = await response.json();
            console.log("Response Data:", data);
    
            if (response.ok) {
                alert("Feedback submitted successfully!");
                setSelected(null);
                setComment("");
            } else {
                alert("Error: " + data.detail);  // ✅ Show authentication error message
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback.");
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
                    <h1>Feedback</h1>
                    <div className="header-buttons">
                        <button className="settings-button" onClick={() => navigate("/settings")}>
                            <FaCog />
                        </button>
                        <button className="logout" onClick={() => navigate("/")}>
                            <FaSignOutAlt /> LOG OUT
                        </button>
                    </div>
                </header>

                {/* Feedback Section */}
                <div className="feedback-container">
                    <h3>HOW WOULD YOU RATE YOUR EXPERIENCE?</h3>

                    <div className="sub-container">
                        <div className="feedback-container">
                            {/* Rating Emojis */}
                            <div className="emoji-container">
                                {feedbackOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`feedback-button ${selected === option.rating ? "selected" : ""}`}
                                        onClick={() => setSelected(option.rating)}
                                    >
                                        <div className="icon-container">{option.icon}</div>
                                        <span className="feedback-label">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Experience Text Box */}
                        <textarea
                            className="feedback-textbox"
                            placeholder="Tell us about your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        {/* Submit Button */}
                        <button className="submit-feedback" onClick={submitFeedback}>
                            Submit
                        </button>
                    </div>
                </div>

                {/* Feedback Button - Positioned at Bottom Right */}
                <button className="footer-buttons" onClick={() => navigate("/feedback")}>
                    <VscFeedback /> {/* Feedback Icon */}
                </button>
            </div>
        </div>
    );
};

export default Feedback;

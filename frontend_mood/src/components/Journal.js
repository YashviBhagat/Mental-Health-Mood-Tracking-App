import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";
import { FaPlus, FaHome, FaCog, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";
import "./journal.css"; // Ensure CSS file exists
import axios from "axios";

const Journal = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [journals, setJournals] = useState([]);
    const username = localStorage.getItem("username");

    useEffect(() => {
        if (userId) {
            fetchJournals(userId);
        }
    }, [userId]);

    const fetchJournals = async (userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/journals/${userId}/`);
            setJournals(response.data);
        } catch (error) {
            console.error("Error fetching journals:", error);
        }
    };

    /** ✅ Redirect to New Journal Form */
    const handleAddJournal = () => {
        navigate("/new_notes");
    };

    /** ✅ Redirect to Edit Journal Page (Passing Journal Data) */
    const handleEditJournal = (journal) => {
        navigate("/new_notes", { state: journal }); // ✅ Pass journal data to NoteForm
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
                    <h1>Journal</h1>
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
                    <div className="journal-title">
                        <h3>WRITE YOUR THOUGHTS</h3>
                    </div>

                    {journals.length === 0 ? (
                        <div className="empty-note" onClick={handleAddJournal}>
                            <h3>Title</h3>
                            <p>+ Add Journal</p>
                        </div>
                    ) : (
                        <ul className="notes-list">
                            {journals.map((journal) => (
                                <li key={journal.id} className="note-item" onClick={() => handleEditJournal(journal)}>
                                    <h3>{journal.title}</h3>
                                    <p>{journal.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                   
                    {/*  "➕" Button (Fixed at Bottom Center) */}
                    <button className="add-task-circle" onClick={handleAddJournal}>
                        <FaPlus />
                    </button>
                   
                    
                </div>
            </div>

            {/* Feedback Button */}
            <button className="footer-buttons" onClick={() => navigate("/feedback")}>
                <VscFeedback />
            </button>
        </div>
    );
};

export default Journal;

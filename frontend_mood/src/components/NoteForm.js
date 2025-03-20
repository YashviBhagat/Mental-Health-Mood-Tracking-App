import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";
import { FaHome, FaCog, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "./NoteForm.css"; // Ensure CSS file exists

const NoteForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const existingJournal = location.state || {}; // ✅ Get journal data if editing

    const [title, setTitle] = useState(existingJournal.title || "");
    const [description, setDescription] = useState(existingJournal.description || "");
    const [isChanged, setIsChanged] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        setIsChanged(title.trim() !== "" || description.trim() !== "");
    }, [title, description]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("User ID is missing. Please log in first.");
            return;
        }

        if (!title.trim() && !description.trim()) {
            alert("Either title or description must be filled.");
            return;
        }

        const journalData = { user_id: userId, title, description };

        try {
            let response;
            if (existingJournal.id) {
                // ✅ If editing, send PUT request
                response = await axios.put(
                    `http://127.0.0.1:8000/api/journals/update/${existingJournal.id}/`,
                    journalData,
                    { headers: { "Content-Type": "application/json" } }
                );
            } else {
                // ✅ If creating new, send POST request
                response = await axios.post(
                    "http://127.0.0.1:8000/api/journals/add/",
                    journalData,
                    { headers: { "Content-Type": "application/json" } }
                );
            }

            console.log("✅ Server response:", response.data);
            navigate("/journal");

        } catch (error) {
            console.error("🚨 Error saving journal entry:", error);
            alert("Failed to save the journal entry. Please try again.");
        }
    };

    const handleExit = () => {
        navigate("/journal");
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
                    <h1>{existingJournal.id ? "Edit Journal" : "Write Your Thoughts"}</h1>
                </header>

                <form onSubmit={handleSubmit} className="note-form">
                    <input
                        type="text"
                        className="note-form-input"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="note-form-textarea"
                        placeholder="Write your thoughts here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button type="submit" className="note-form-button" disabled={!isChanged}>
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NoteForm;


import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";
import { FaHome, FaCog, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";
import "./meditation.css"; //  Ensure CSS file exists

// List of background sounds
const soundOptions = [
    { label: "Flute", src: "/sounds/flute.mp3" },
    { label: "Spring", src: "/sounds/spring.mp3" },
    
];


const Meditation = () => {
    const navigate = useNavigate(); // efine navigate
    const username = localStorage.getItem("username"); //  Get username
    const userId = localStorage.getItem("userId");
    const [time, setTime] = useState(0); // Time in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [selectedSound, setSelectedSound] = useState(null);
    const [audio, setAudio] = useState(null);

    const formatTime = (seconds) => {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    //  Timer logic (Runs every second if isRunning is true)
    useEffect(() => {
        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
        } else if (time === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(timer);
    }, [isRunning, time]);

    // Handle button clicks
    const startPauseTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setTime(0);
    };
    const setTimer = (minutes) => {
        setTime(minutes * 60);
        setIsRunning(false);
    };
// Play selected sound
    const playSound = (src) => {
        if (audio) {
            audio.pause();
        }
        const newAudio = new Audio(src);
        newAudio.loop = true;
        newAudio.play();
        setAudio(newAudio);
        setSelectedSound(src);
    };

    // Stop playing sound
    const stopSound = () => {
        if (audio) {
            audio.pause();
            setAudio(null);
            setSelectedSound(null);
        }
    };


    // Send completed session to Django backend
    const saveSession = async () => {
        // if (time === 0) {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/save-session/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ duration: time, user_id: userId }), // Send session duration
                });
                const data = await response.json();
                alert("Session saved successfully!");
            } catch (error) {
                console.error("Error saving session:", error);
            }
        // }
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
                    <h1>Meditation</h1>
                    <div className="header-buttons">
                        <button className="settings-button" onClick={() => navigate("/settings")}>
                            <FaCog />
                        </button>
                        <button className="logout" onClick={() => navigate("/")}>
                            <FaSignOutAlt /> LOG OUT
                        </button>
                    </div>
                </header>

                {/* Meditation Timer Section */}
                <div className="meditation-container">
            <h2>Meditation Timer</h2>
            <div className="timer-display">{formatTime(time)}</div>

            {/* Timer Control Buttons */}
            <button className="start-button" onClick={startPauseTimer}>
                {isRunning ? "Pause" : "Start"}
            </button>
            <button className="reset-button" onClick={resetTimer}>Reset</button>

            {/* Time Selection Buttons */}
            <div className="time-buttons">
                {[10, 15, 20, 25, 30].map((min) => (
                    <button key={min} onClick={() => setTimer(min)}>{min} MIN</button>
                ))}
            </div>

            {/* Save Session Button */}
            <button className="save-button" onClick={saveSession} >
                Save Session
            </button>
            

            {/* Background Music Selection */}
        <div className="music-selection">
                        <h3>Select Background Music</h3>
                        <div className="music-buttons">
                            {soundOptions.map((sound) => (
                                <button
                                    key={sound.src}
                                    className={selectedSound === sound.src ? "selected" : ""}
                                    onClick={() => playSound(sound.src)}
                                >
                                    {sound.label}
                                </button>
                            ))}
                        </div>
                        {selectedSound && <button onClick={stopSound} className="stop-button">Stop Music</button>}
                    </div>

        </div>
            </div>
        
        




            {/* Feedback Button - Positioned at Bottom Right */}
            <button className="footer-buttons" onClick={() => navigate("/feedback")}>
                <VscFeedback /> {/* Feedback Icon */}
            </button>
        </div>
    );
};

// ✅ Ensure default export
export default Meditation;

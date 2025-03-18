import React, { useState, useEffect } from "react";
import { FaHome, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Get logged-in user's ID
  const [username, setUsername] = useState(""); // Store user's name
  const [moodRatings, setMoodRatings] = useState({});
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [weekDays, setWeekDays] = useState({});
  
  useEffect(() => {
    if (!userId) {
      navigate("/"); // Redirect to login if no user is logged in
    } else {
      fetchUserProfile();
      fetchMoodRatings();
      fetchStreaks();
    }
  }, [userId]);

  // Fetch User Profile (Name)
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-user-profile/${userId}/`);
      const data = await response.json();

      if (response.ok) {
        setUsername(data.first_name || "User");
      } else {
        console.error("Error fetching user profile:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch Mood Ratings
  const fetchMoodRatings = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-mood-ratings/${userId}/`);
      if (!response.ok) throw new Error("Failed to fetch mood ratings");

      const data = await response.json();
      const ratingsMap = {};
      data.forEach((rating) => {
        ratingsMap[rating.mood] = { id: rating.id, rating: rating.rating };
      });

      setMoodRatings(ratingsMap);
    } catch (error) {
      console.error("Error fetching mood ratings:", error);
    }
  };

  // Fetch Streak Data
  const fetchStreaks = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-mood-streak/${userId}/`);
      const data = await response.json();
      if (!response.ok) throw new Error("Failed to fetch streak data");

      setStreak({ current: data.current_streak || 0, longest: data.longest_streak || 0 });

      // Track last 7 days
      const today = new Date();
      const daysMap = {};
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(today.getDate() - i);
        const dayName = day.toLocaleString("en-US", { weekday: "short" });
        daysMap[dayName] = data.last_submission_date === day.toISOString().split("T")[0];
      }
      setWeekDays(daysMap);
    } catch (error) {
      console.error("Error fetching streaks:", error);
    }
  };

  // Handle Mood Selection
  const handleRatingChange = (mood, rating) => {
    setMoodRatings((prev) => ({
      ...prev,
      [mood]: { id: prev[mood]?.id || null, rating },
    }));
  };

  // Submit New Mood Entry
  const submitMood = async () => {
    if (!userId) return;

    try {
      const requestData = {
        user_id: userId,
        happy: moodRatings["Happy"]?.rating || 0,
        excited: moodRatings["Excited"]?.rating || 0,
        sad: moodRatings["Sad"]?.rating || 0,
        nervous: moodRatings["Nervous"]?.rating || 0,
        worried: moodRatings["Worried"]?.rating || 0,
        bored: moodRatings["Bored"]?.rating || 0,
        angry: moodRatings["Angry"]?.rating || 0,
      };

      const response = await fetch("http://127.0.0.1:8000/api/submit-mood/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Mood submitted successfully!");
        fetchMoodRatings(); // Refresh mood ratings
        fetchStreaks(); // Update streak after submission
      } else {
        console.error("Error submitting mood ratings:", data.error);
      }
    } catch (error) {
      console.error("Error submitting mood ratings:", error);
    }
  };

  return (
    <div className="homepage-container">
      <div className="sidebar">
        <h2 className="logo">NIRVANA</h2>
        <nav>
          <ul>
            <li><FaHome /> Homepage</li>
            <li><FaChartBar /> Mood Analytics</li>
            <li><FaUserMd /> Therapist Appointment</li>
            <li><FaSpa /> Meditation</li>
            <li><FaBook /> Journal</li>
            <li><FaBell /> Notifications</li>
            <li><FaComments /> Messaging</li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <header>
          <h1>HOMEPAGE</h1>
          <h2>Welcome, {username}</h2> {/* ✅ User's name displayed */}
          <button className="logout" onClick={() => navigate("/")}>
            <FaSignOutAlt /> LOG OUT
          </button>
        </header>

        {/* Streaks Section */}
        <section className="streaks">
          <h2>STREAKS <span className="streak-number">{streak.current}</span></h2>
          <p>Longest streak: {streak.longest}</p>
          <div className="week-streak">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className={weekDays[day] ? "day completed" : "day"}>{day.charAt(0)}</span>
            ))}
          </div>
        </section>

        {/* Mood Selection */}
        <section className="mood-selection">
          <h2>HELLO!</h2>
          <p>What's your mood like today? 🌈</p>
          <div className="mood-options">
            {["Happy", "Excited", "Sad", "Nervous", "Worried", "Bored", "Angry"].map((mood) => (
              <div key={mood} className="mood">
                <span>{mood}</span>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <label key={num}>
                      <input
                        type="radio"
                        name={mood}
                        value={num}
                        checked={moodRatings[mood]?.rating === num}
                        onChange={() => handleRatingChange(mood, num)}
                      />
                      {num}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={submitMood}>SUBMIT</button>
        </section>

        {/* Display Mood Ratings */}
        <section className="existing-ratings">
          <h2>Your Mood Ratings</h2>
          <ul>
            {Object.entries(moodRatings).map(([mood, { rating }]) => (
              <li key={mood}>{mood}: {rating}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

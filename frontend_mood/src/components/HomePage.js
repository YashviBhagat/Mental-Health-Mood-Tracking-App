import React, { useState, useEffect } from "react";
import { FaHome, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const userId = 1; // Replace with actual user ID after login implementation
  const [moodRatings, setMoodRatings] = useState({});
  const [existingRatings, setExistingRatings] = useState({});

  useEffect(() => {
    fetchMoodRatings();
  }, []);

  // Fetch mood ratings from the backend
  const fetchMoodRatings = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-user-moods/${userId}/`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const ratingsMap = {};
        data.forEach((rating) => {
          ratingsMap[rating.mood] = { id: rating.id, rating: rating.rating };
        });

        setMoodRatings(ratingsMap);
        setExistingRatings(ratingsMap);
      }
    } catch (error) {
      console.error("Error fetching mood ratings:", error);
    }
  };

  // Handle rating selection
  const handleRatingChange = (mood, rating) => {
    setMoodRatings((prev) => ({
      ...prev,
      [mood]: { ...prev[mood], rating },
    }));
  };

  // Submit or update mood ratings
  const submitMoodRatings = async () => {
    try {
      for (let mood in moodRatings) {
        if (moodRatings[mood].id) {
          // Update existing rating
          await fetch(`http://127.0.0.1:8000/api/update-mood/${moodRatings[mood].id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: moodRatings[mood].rating }),
          });
        } else {
          // Submit new rating
          await fetch("http://127.0.0.1:8000/api/submit-mood/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: userId, mood, rating: moodRatings[mood].rating }),
          });
        }
      }
      alert("Mood ratings updated!");
      fetchMoodRatings(); // Refresh the data
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
          <button className="logout" onClick={() => navigate("/")}>
            <FaSignOutAlt /> LOG OUT
          </button>
        </header>

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
          <button className="submit-btn" onClick={submitMoodRatings}>SUBMIT/UPDATE RATINGS</button>
        </section>

        {/* Display Existing Mood Ratings */}
        <section className="existing-ratings">
          <h2>Your Previous Mood Ratings</h2>
          <ul>
            {Object.entries(existingRatings).map(([mood, { rating }]) => (
              <li key={mood}>{mood}: {rating} </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect } from "react";
import { FaHome, FaChartBar, FaBook, FaBell, FaComments, FaUserMd, FaSpa, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { Link } from "react-router-dom";


const HomePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
   // Replace with actual user ID after login
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [moodRatings, setMoodRatings] = useState({});
  const [existingRatings, setExistingRatings] = useState({});
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [weekDays, setWeekDays] = useState({});
  const [quote, setQuote] = useState(); // Default quote

  useEffect(() => {
    fetchMoodRatings();
    fetchStreaks();
  }, []);
  
  
  
  // Fetch mood ratings from the backend
  const fetchMoodRatings = async () => {
    try {
        
        const response = await fetch(`http://127.0.0.1:8000/api/get-user-moods/${userId}/`);
        const data = await response.json();

        if (typeof data === "object") {  // Ensure valid JSON response
            setMoodRatings(data);
            setExistingRatings(data);
            updateQuote(data);
        }
    } catch (error) {
        console.error("Error fetching mood ratings:", error);
    }
};
// fetch streak 
const fetchStreaks = async () => {
  try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-user-streaks/${userId}/`);
      const data = await response.json();

      setStreak({ current: data.current_streak, longest: data.longest_streak });

      // Mark completed days dynamically for the last 7 days
      const today = new Date();
      const daysMap = {};
      for (let i = 6; i >= 0; i--) {
          const day = new Date();
          day.setDate(today.getDate() - i);
          const dayName = day.toLocaleString("en-US", { weekday: "short" });

          // Mark days completed based on last_submission_date
          daysMap[dayName] = new Date(data.last_submission_date) >= day;
      }
      setWeekDays(daysMap);
  } catch (error) {
      console.error("Error fetching streaks:", error);
  }
};



  // Handle rating selection
  const handleRatingChange = (mood, rating) => {
    setMoodRatings((prev) => ({
      ...prev,
      [mood]: { ...prev[mood], rating },
    }));
    updateQuote({ 
      ...moodRatings, 
      [mood]: { rating } 
  });
  };


  // Submit or update mood ratings and update streak
  const submitMoodRatings = async () => {
    const missingMoods = ["Happy", "Excited", "Sad", "Nervous", "Worried", "Bored", "Angry"].filter(mood =>
        !moodRatings[mood] || !moodRatings[mood].rating
    );

    if (missingMoods.length > 0) {
        alert(`Please fill in all mood ratings before submitting.\nMissing: ${missingMoods.join(", ")}`);
        return; // Stop submission if any mood is missing
    }

    try {
        for (let mood in moodRatings) {
            await fetch("http://127.0.0.1:8000/api/submit-mood/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: userId, mood, rating: moodRatings[mood].rating }),
            });
        }
        alert("Mood ratings updated!");

        const response = await fetch(`http://127.0.0.1:8000/api/get-user-moods/${userId}/`);
        const updatedData = await response.json();

        setExistingRatings(moodRatings);  //  Ensure ratings are displayed
        updateQuote(moodRatings);  //  Ensure quote updates dynamically
    } catch (error) {
        console.error("Error submitting mood ratings:", error);
    }
};


const updateQuote = (moods) => {
  if (!moods || Object.keys(moods).length === 0) {
      setQuote("Emotions are like waves. Ride them with strength! 🌊");
      return;
  }

  //  Find the mood with the highest rating
  let highestMood = Object.keys(moods).reduce((a, b) =>
      moods[a].rating > moods[b].rating ? a : b
  );

  //  Mood-based quotes
  const moodQuotes = {
      Happy: "Happiness is not something ready-made. It comes from your actions. 😊",
      Excited: "The best way to predict the future is to create it! 🚀",
      Sad: "Even the darkest night will end and the sun will rise. 🌅",
      Nervous: "Believe in yourself, and you will be unstoppable. 💪",
      Worried: "Worrying does not take away tomorrow’s troubles, it takes away today’s peace. ✨",
      Bored: "Boredom is the birthplace of creativity. 🎨",
      Angry: "Take deep breaths. For every minute you are angry, you lose sixty seconds of happiness. ❤️",
  };

  //  Set the quote based on the highest-rated mood
  setQuote(moodQuotes[highestMood] || "Keep going, you're doing great! 🌟");
};



  return (
    <div className="homepage-container">
  {/* Sidebar */}
  <aside className="sidebar">
    <h2 className="logo">NIRVANA</h2>
    <nav>
      <ul>
        <li><Link to="/"><FaHome /> Homepage</Link></li>
        <li><Link to="moodanalytics"><FaChartBar /> Mood Analytics</Link></li>
        <li><Link to="therapistappoinment"><FaUserMd /> Therapist Appointment</Link></li>
        <li><Link to="meditation"><FaSpa /> Meditation</Link></li>
        <li><Link to="journal"><FaBook /> Journal</Link></li>
        <li><Link to="notification"><FaBell /> Notifications</Link></li>
        <li><Link to="messaging"><FaComments /> Messaging</Link></li>
      </ul>
    </nav>
  </aside>

  {/* Main Content Area */}
  <div className="main-content">
    {/* Header */}
    <header>
    <div className="user-info">
        <span className="username">Hello, {username} 👋</span>
      </div>

      <h1>HOMEPAGE</h1>
      
      <button className="logout" onClick={() => navigate("/")}>
            <FaSignOutAlt /> LOG OUT
      </button>

    </header>

    <div className="content-grid">
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
          <button className="submit-btn" onClick={submitMoodRatings}>
            SUBMIT/UPDATE RATINGS
          </button>

      </section>

      {/* Mood Prediction */}
      <section className="mood-prediction">
        <h2>MOOD PREDICTION</h2>
        <p>Today's mood prediction: <strong>EXCITED</strong></p>
        <p>Is it true? <input type="radio" name="mood-prediction" /> Yes <input type="radio" name="mood-prediction" /> No</p>
        <button>SUBMIT</button>
      </section>

      {/* Streaks */}
      <section className="streaks">
  <h2>STREAKS <span className="streak-number">{streak.current}</span></h2>
  <p>Longest streak: {streak.longest}</p>
  <div className="week-streak">
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <span key={day} className={weekDays[day] ? "day completed" : "day"}>{day.charAt(0)}</span>
    ))}
  </div>
</section>

      {/* Quote of the Day */}
      <section className="quote">
        <h2>Quote of the day</h2>
        <p>{quote}</p>
      </section>
    </div>
  </div>
</div>
  );
};


export default HomePage;

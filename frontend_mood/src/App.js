import React,{useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signin from "./components/Signin";  
import Signup from "./components/Signup";  
import HomePage from "./components/HomePage";  
import Journal from "./components/Journal";
import NoteForm from "./components/NoteForm";
import Meditation from "./components/Meditation";
import Messaging from "./components/Messaging";
import MoodAnalytics from "./components/MoodAnalytics";
import Notification from "./components/Notification";
import TherapistAppointment from "./components/TherapistAppointment";  
import Feedback from "./components/Feedback";
import Settings from "./components/Settings";



const App = () => {

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/moodanalytics" element={<MoodAnalytics />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/therapistappointment" element={<TherapistAppointment />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/journal" element={<Journal />} />  
        <Route path="/new_notes" element={<NoteForm />} /> 
        

      </Routes>
      </div>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signin from "./components/Signin";  
import Signup from "./components/Signup";  
import HomePage from "./components/HomePage";  
import Journal from "./components/Journal";
import Meditation from "./components/Meditation";
import Messaging from "./components/Messaging";
import MoodAnalytics from "./components/MoodAnalytics";
import Notification from "./components/Notification";
import TherapistAppointment from "./components/TherapistAppointment";  
import Feedback from "./components/Feedback";
import Settings from "./components/Settings";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/moodanalytics" element={<MoodAnalytics />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/TherapistAppointment" element={<TherapistAppointment />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/Settings" element={<Settings />} />

      </Routes>
    </Router>
  );
};

export default App;

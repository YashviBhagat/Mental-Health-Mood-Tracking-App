import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import HomePage from "./HomePage";
import HomePage from "./components/HomePage";
// import Signin from "./Signin";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
// import Signup from "./Signup";
import Journal from "./components/Journal";
import Meditation from "./components/Meditation";
import Messageing from "./components/Messaging";
import MoodAnalytics from "./components/MoodAnalytics";
import Notification from "./components/Notification";
import TherapistAppoinment from "./components/TherapistAppoinment";
import Feedback from "./components/feedback";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/messaging" element={<Messageing />} />
        <Route path="/moodanalytics" element={<MoodAnalytics />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/therapistappoinment" element={<TherapistAppoinment />} />
        <Route path="/feedback" element={<Feedback />} />

      </Routes>
    </Router>
  );
};

export default App;

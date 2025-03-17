import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import HomePage from "./HomePage";
import HomePage from "./components/HomePage";
// import Signin from "./Signin";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
// import Signup from "./Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;

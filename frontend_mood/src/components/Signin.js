import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signin.css";
import logo from "../assets/nirvana-logo.png"; 

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("username", data.username);
        navigate("/home");
      } else {
        setError(data.error || "Signin failed");
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="signin-container">
      {/* Left Section - Logo & Tagline */}
      <div className="signin-left">
        <img src={logo} alt="Nirvana Logo" className="signin-logo" />
        <h2>Nurture your mind, embrace your journey</h2>
      </div>

      {/* Right Section - Sign-In Form */}
      <div className="signin-right">
        <h1>WELCOME TO NIRVANA</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignin}>
          <div className="input-group">
            <label>USERNAME</label>
            <input 
              type="text" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>PASSWORD</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="extra-links">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="signin-button">SIGN IN</button>
        </form>
        <div className="extra-links">
          <span>New at <b>NIRVANA?</b></span>
          <a href="/signup">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default Signin;

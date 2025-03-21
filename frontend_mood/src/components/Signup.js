import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import logo from "../assets/nirvana-logo.png"; 

const Signup = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        dateOfBirth: "",
        gender: "",
        licenceNumber: "",
        consultationType: "",
        aboutMe: "",
        wellbeingGoal: "",
        feelings: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            feelings: checked
                ? [...prevData.feelings, value]
                : prevData.feelings.filter((feeling) => feeling !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/signupP/create/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup successful! Redirecting to Signin...");
                navigate("/");
            } else {
                alert("Signup failed. Please check your inputs.");
            }
        } catch (error) {
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div className="signup-container">
            {/* <div className="signup-left">
                <img src={logo} alt="Nirvana Logo" className="signup-logo" />
                <h2>Nurture your mind, embrace your journey</h2>
            </div> */}

            <div className="signup-right">
                <h1>WELCOME TO NIRVANA</h1>

                {!userType ? (
                    <div className="user-selection">

                      <h1>Select User</h1>
                        <button onClick={() => setUserType("user")}> USER</button>
                        <button onClick={() => setUserType("therapist")}> THERAPIST</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="input-group">
                            <label>FIRST NAME</label>
                            <input type="text" name="firstName" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>LAST NAME</label>
                            <input type="text" name="lastName" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>USERNAME</label>
                            <input type="text" name="username" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>E-MAIL</label>
                            <input type="email" name="email" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>PASSWORD</label>
                            <input type="password" name="password" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>DATE OF BIRTH</label>
                            <input type="date" name="dateOfBirth" onChange={handleChange} required />
                        </div>

                        <div className="radio-group">
                            <h4>GENDER</h4>
                            <label>
                                <input type="radio" name="gender" value="male" onChange={handleChange} required /> Male
                            </label>
                            <label>
                                <input type="radio" name="gender" value="female" onChange={handleChange} required /> Female
                            </label>
                        </div>

                        {/* Additional Fields for Therapists */}
{userType === "therapist" && (
  <div className="additional-fields">
    <input type="text" name="licenceNumber" placeholder="Licence Number" onChange={handleChange} required />
    <div className="radio-group">
      <h4>Consultation Type</h4>
      <label>
        <input type="radio" name="consultationType" value="online" onChange={handleChange} required /> Online
      </label>
      <label>
        <input type="radio" name="consultationType" value="in_person" onChange={handleChange} required /> In-Person
      </label>
      <label>
        <input type="radio" name="consultationType" value="both" onChange={handleChange} required /> Both
      </label>
    </div>
    <textarea name="aboutMe" placeholder="About Me" onChange={handleChange} required></textarea>
  </div>
)}

{/* Additional Fields for Users */}
{userType === "user" && (
  <div className="additional-fields">
    <div className="radio-group">
      <h4>Your Well-being Goal</h4>
      <label>
        <input type="radio" name="wellbeingGoal" value="improve_goal" onChange={handleChange} required />
        Improve Focus
      </label>
      <label>
        <input type="radio" name="wellbeingGoal" value="reduce_anxiety" onChange={handleChange} required />
        Reduce Anxiety
      </label>
      <label>
        <input type="radio" name="wellbeingGoal" value="track_emotions" onChange={handleChange} required />
        Track Emotional Patterns
      </label>
      <label>
        <input type="radio" name="wellbeingGoal" value="other" onChange={handleChange} required />
        Other
      </label>
    </div>

    <div className="checkbox-group">
      <h4>How do you feel most of the day?</h4>
      <label>
        <input type="checkbox" value="happy" onChange={handleCheckboxChange} />
        😊 Happy
      </label>
      <label>
        <input type="checkbox" value="neutral" onChange={handleCheckboxChange} />
        😐 Neutral
      </label>
      <label>
        <input type="checkbox" value="anxious" onChange={handleCheckboxChange} />
        😰 Anxious
      </label>
      <label>
        <input type="checkbox" value="sad" onChange={handleCheckboxChange} />
        😢 Sad
      </label>
      <label>
        <input type="checkbox" value="angry" onChange={handleCheckboxChange} />
        😡 Angry
      </label>
      <label>
        <input type="checkbox" value="fluctuating_mood" onChange={handleCheckboxChange} />
        🤷 Fluctuating Mood
      </label>
    </div>
  </div>
)}


                        <button type="submit" className="signup-button">SIGN UP</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Signup;

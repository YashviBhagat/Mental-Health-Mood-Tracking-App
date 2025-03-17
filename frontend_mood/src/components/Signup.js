import React, { useState } from "react";

const Signup = () => {
  const [userType, setUserType] = useState(""); // 'user' or 'therapist'
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

    // Log data before sending request
    console.log("Sending Data:", JSON.stringify({ ...formData, userType }));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signupP/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userType }),
      });

      const data = await response.json(); // Try to parse response JSON

      if (response.ok) {
        alert("Signup successful!");
        console.log("Success:", data);
      } else {
        alert("Signup failed. Please check your inputs.");
        console.error("Error Response:", data);
      }
    } catch (error) {
      alert("Something went wrong. Check console for details.");
      console.error("Network Error:", error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {!userType ? (
        <>
          <h3>Select User Type</h3>
          <button onClick={() => setUserType("user")}>User</button>
          <button onClick={() => setUserType("therapist")}>Therapist</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>Signup as {userType.charAt(0).toUpperCase() + userType.slice(1)}</h3>

          {/* Common Fields for User and Therapist */}
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="date" name="dateOfBirth" onChange={handleChange} required />

          <div>
            <h4>Gender</h4>
            <label>
              <input type="radio" name="gender" value="male" onChange={handleChange} required /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" onChange={handleChange} required /> Female
            </label>
          </div>

          {/* Additional Fields for Therapists */}
          {userType === "therapist" && (
            <>
              <input type="text" name="licenceNumber" placeholder="Licence Number" onChange={handleChange} required />
              <div>
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
            </>
          )}

          {/* Additional Fields for Users */}
          {userType === "user" && (
            <>
              <div>
                <h4>Your Well-being Goal</h4>
                <label>
                  <input type="radio" name="wellbeingGoal" value="improve_goal" onChange={handleChange} required />
                  Improve Goal
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

              <div>
                <h4>How do you feel most of the day?</h4>
                <label>
                  <input type="checkbox" value="happy" onChange={handleCheckboxChange} />
                  Happy
                </label>
                <label>
                  <input type="checkbox" value="neutral" onChange={handleCheckboxChange} />
                  Neutral
                </label>
                <label>
                  <input type="checkbox" value="anxious" onChange={handleCheckboxChange} />
                  Anxious
                </label>
                <label>
                  <input type="checkbox" value="sad" onChange={handleCheckboxChange} />
                  Sad
                </label>
                <label>
                  <input type="checkbox" value="angry" onChange={handleCheckboxChange} />
                  Angry
                </label>
                <label>
                  <input type="checkbox" value="fluctuating_mood" onChange={handleCheckboxChange} />
                  Fluctuating Mood
                </label>
              </div>
            </>
          )}

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Signup;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NoteForm.css';

const NoteForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState(''); // ✅ Store user ID from latest login
  const [isChanged, setIsChanged] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch the most recent login username from the backend
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/get-texts/')
      .then(response => {
        console.log("📥 Received user data:", response.data); // ✅ Debugging line
        if (response.data && response.data.username) {
          setUsername(response.data.username); // ✅ Assign latest username
        }
      })
      .catch(error => console.error('🚨 Error fetching username:', error));
  }, []);

  // ✅ Check if either title or description is filled
  useEffect(() => {
    setIsChanged(title.trim() !== '' || description.trim() !== ''); // ✅ At least one must be filled
  }, [title, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username) {
     /* alert('Username is missing. Please log in first.');*/
      return;
    }
  
    if (!title.trim() && !description.trim()) {
      /*alert('Either title or description must be filled.');*/
      return;
    }
  
    const newNote = { username, title, description };
  
    try {
      console.log("📤 Sending request:", newNote); // ✅ Debugging log
  
      const response = await axios.post(
        'http://127.0.0.1:8000/api/notes/',  // ✅ Ensure this matches Django's API URL
        newNote,  // ✅ Directly pass object (DO NOT use JSON.stringify)
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log("📥 Server response:", response.data); // ✅ Log response
  
      /*alert('Note saved successfully!');
      
      /*setTitle('');
      setDescription('');*/
      setIsChanged(false);
    } catch (error) {
      /*console.error("🔥 Error saving note:", error.response ? error.response.data : error.message);*/
      alert('Failed to save note. Please try again.');
    }
  };
  

  const handleExit = () => {
    navigate('/notes_list');
  };

  return (
    <div className="note-form-container">
      <button className="exit-button" onClick={handleExit}>EXIT</button>
      <h1 className="note-form-title">WRITE YOUR THOUGHTS</h1>
      <form onSubmit={handleSubmit} className="note-form">
        {/* ✅ Hidden Username Field (Auto-filled from login text) */}
        <input type="hidden" name="username" value={username} />

        <input
          type="text"
          className="note-form-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="note-form-textarea"
          placeholder="Write your thoughts here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="button-container">
          <button type="submit" className="note-form-button" disabled={!isChanged}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;

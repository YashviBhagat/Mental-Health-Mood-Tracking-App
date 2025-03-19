import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateNote.css";

const UpdateNote = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const user_note = queryParams.get("user_note"); // ✅ Extract user_note from URL

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdated, setIsUpdated] = useState(false); // ✅ Track if changes are made

  useEffect(() => {
    console.log("🔄 useEffect triggered, user_note:", user_note); // ✅ Debug log
    if (user_note) {
      fetchNote(user_note);
    }
  }, [user_note]); // ✅ Ensures fetch runs when user_note changes

  const fetchNote = async (user_note) => {
    try {
      console.log("🌐 Sending API request to:", `http://127.0.0.1:8000/api/retrieve_note/?user_note=${encodeURIComponent(user_note)}`);
      
      const response = await axios.get(`http://127.0.0.1:8000/api/retrieve_note/?user_note=${encodeURIComponent(user_note)}`);
      
      console.log("✅ API Response:", response.data); // ✅ Debug log

      if (response.status === 200 && response.data) {
        setTitle(response.data.title);
        setDescription(response.data.description);
      } else {
        console.error("🚨 Error fetching note:", response.status);
        alert("Error fetching note.");
      }
    } catch (error) {
      console.error("🚨 API Error:", error);
      alert("Failed to fetch note.");
    }
  };

  // ✅ Handle Input Change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsUpdated(true);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setIsUpdated(true);
  };

  const handleSave = async () => {
    try {
      console.log("📤 Sending update request...");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/update_note/?user_note=${encodeURIComponent(user_note)}`, 
        { title, description }, // ✅ Send JSON data
        { headers: { "Content-Type": "application/json" } } // ✅ Set correct headers
      );
  
      if (response.status === 200) {
        console.log("✅ Note updated successfully:", response.data);
        setIsUpdated(false); // ✅ Disable Save button after save
        /*alert("Note updated successfully!");*/
      } else {
        console.error("🚨 Error updating note:", response.status);
        alert("Error updating note.");
      }
    } catch (error) {
      console.error("🚨 API Error:", error);
      alert("Failed to update note.");
    }
  };
  

  return (
    <div className="update-note-container">
      {/* Exit Button */}
      <button className="update-exit-button" onClick={() => navigate("/notes_list")}>Exit</button>

      {/* Title */}
      <h1 className="update-note-title">Write Your Thoughts</h1>

      {/* Input Fields */}
      <input
        type="text"
        className="update-note-input"
        value={title}
        onChange={handleTitleChange}
      />
      <textarea
        className="update-note-textarea"
        value={description}
        onChange={handleDescriptionChange}
      />

      {/* Save Button */}
      <div className="update-button-container">
        <button
          className="update-note-button"
          onClick={handleSave}
          disabled={!isUpdated} // ✅ Enable only when changes are made
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateNote;

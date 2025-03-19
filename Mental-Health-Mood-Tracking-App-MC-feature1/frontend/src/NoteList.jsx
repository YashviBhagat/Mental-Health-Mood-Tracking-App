import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NoteList.css";

const NoteList = () => {
  const [notes, setNotes] = useState([]); // Store user’s saved notes
  const [username, setUsername] = useState(""); // Store logged-in user’s username
  const navigate = useNavigate();

  /** ✅ Fetch logged-in username */
  const fetchUsername = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/get-texts/");
      if (response.data && response.data.username) {
        setUsername(response.data.username);
        console.log("📥 Logged-in Username:", response.data.username);
      } else {
       /* alert("No logged-in user found. Please log in first.");*/
        navigate("/"); // Redirect to login if no user found
      }
    } catch (error) {
      console.error("🚨 Error fetching username:", error);
     /* alert("Failed to get user details. Please try again.");*/
    }
  }, [navigate]);

  /** ✅ Fetch notes once username is available */
  useEffect(() => {
    fetchUsername();
  }, [fetchUsername]);

  useEffect(() => {
    if (username) {
      fetchNotes(username);
    }
  }, [username]);

  /** ✅ Fetch saved notes for the logged-in user */
  const fetchNotes = async (username) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/notes_list/?username=${username}`
      );
      if (response.status === 200) {
        setNotes(response.data);
      } else {
        alert("Error fetching notes. Try again.");
      }
    } catch (error) {
      console.error("🚨 Error fetching notes:", error);
      alert("Failed to fetch notes."); /* Please check your network or backend.");*/
    }
  };

  /** ✅ Redirect user to add a new note */
  const handleAddNote = () => {
    navigate("/new_notes");
  };

  /** ✅ Redirect user to edit a selected note */
  const handleEditNote = (user_note) => {
    navigate(`/update_note/?user_note=${user_note}`); // ✅ Redirect to note update page
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div className="notes-list-container">
      <h1 className="notes-list-title">WRITE YOUR THOUGHTS</h1>

      {notes.length === 0 ? (
        /** ✅ Show this if no saved notes exist */
        <div className="empty-note" onClick={handleAddNote}>
          <h3 className="empty-note-title">Title</h3>
          <hr className="note-divider" /> {/* ✅ Border between title & description */}
          <p className="empty-note-description"> + Add Task</p>
          <hr className="note-divider" />
          <div className="note-footer">
            <span className="note-date">{formatDate(new Date())}</span>
          </div>
        </div>
      ) : (
        <>
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.user_note} className="note-item" onClick={() => handleEditNote(note.user_note)}>
                <h3>{note.title || "Untitled Note"}</h3>
                <hr className="note-divider" /> {/* ✅ Border between title & description */}
                <p>{note.description || "No description provided."}</p>
                <hr className="note-divider" />
                <div className="note-footer">
                  <span className="note-date">
                    {formatDate(new Date())}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="add-task-container">
            <button className="add-task-circle" onClick={handleAddNote}>
               +
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteList;

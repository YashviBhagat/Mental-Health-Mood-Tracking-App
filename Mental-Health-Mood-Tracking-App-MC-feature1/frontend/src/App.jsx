import { useState } from 'react';
/*import axios from 'axios';*/
import { useNavigate } from 'react-router-dom';

function App() {
  const [text, setText] = useState("");
  const navigate = useNavigate();
 

  const handleSave = async () => {
    if (text.trim() !== "") {
      try {
        console.log("📤 Sending request to save login:", text); // ✅ Log input data
  
        const response = await fetch("http://127.0.0.1:8000/api/save-text/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: text }),
        });
  
        const data = await response.json();
        console.log("📥 Server response:", data); // ✅ Log API response
  
        if (response.ok) {
          alert("Login saved successfully!");
          navigate("/home"); // ✅ Redirect after saving
        } else {
          console.error("🚨 Error saving login:", data);
          alert("Failed to save login. Please try again.");
        }
      } catch (error) {
        console.error("🔥 Network error:", error);
        alert("Network error. Check your server.");
      }
    }
  };
  

  return (
    <>
      <h1>Nirvana</h1>
      <div>
        <input 
          type="text" 
          placeholder="Enter login text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <br /><br />
        <button onClick={handleSave} disabled={!text.trim()}>
          Save Login
        </button>
      </div>
    </>
  );
}

export default App; 


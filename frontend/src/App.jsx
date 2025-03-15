import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    
  }, []);

  const login = async () => {
    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/login/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      

      if (response.ok) {
        setResponseData(data.message);
        // TODO: navigate to home page
      } else {
        setResponseData(data.error);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Nirvana</h1>
      <div>
        <input 
          type='text' 
          placeholder='Enter username' 
          onChange={(e) => setUsername(e.target.value)}
        />
        <br></br>
        <input 
          type='password' 
          placeholder='Enter Password' 
          onChange={(e) => setPassword(e.target.value)}
        />
        <br></br><br></br>
        <button onClick={login}>Login</button>

        {responseData && ( 
        <div style={{ marginTop: '20px' }}>
          {<p>{responseData}</p>}
        </div>
      )}
      </div>
    </>
  );
}

export default App;

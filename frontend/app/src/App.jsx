import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [loginP, setLogin] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [newName, setnewName] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  const fetchLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/loginP/");
      const data = await response.json();
      setLogin(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addLogin = async () => {
    const loginData = {
      name,
      password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/loginP/create/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      setLogin((prev) => [...prev, data]);

    } catch (err) {
      console.log(err);
    }
  };

  const updateName = async (pk, password) => {
    const loginData = {
      name: newName,
      password,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/loginP/${pk}/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      setLogin((prev) => 
        prev.map((login) => {
          if (login.id === pk){
            return data;
          }else{
            return login;
          }
        }
          
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  const deleteName = async (pk) => {
    try{
    const response = await fetch(`http://127.0.0.1:8000/api/loginP/${pk}/`, {
        method: "DELETE",
       
      });

     
      setLogin((prev) => prev.filter((login) =>login.id !== pk));
    } catch(err){
      console.log(err);
    }


  };

  return (
    <>
      <h1>Nirvana</h1>
      <div>
        <input 
          type='text' 
          placeholder='Enter name' 
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type='text' 
          placeholder='Enter Password' 
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={addLogin}>Submit</button>
      </div>
      {loginP.map((login) => (
        <div key={login.id}> 
          <p>Name: {login.name}</p>
          <p>Password: {login.password}</p>
          <input 
            type="text" 
            placeholder='Update Name' 
            onChange={(e) => setnewName(e.target.value)}
          />
          <button onClick={() => updateName(login.id, login.password)}>
            Change Name
          </button>
          <button onClick={() => deleteName(login.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}

export default App;

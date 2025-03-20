import React, { useState, useEffect } from "react";
import "./MessagingSystem.css";

const MessagingSystem = () => {
  const [users, setUsers] = useState([]); // All users from backend
  const [chatUsers, setChatUsers] = useState([]); // Users with chat history
  const [filteredUsers, setFilteredUsers] = useState([]); // Search results
  const [search, setSearch] = useState(""); // Search input
  const [selectedUser, setSelectedUser] = useState(null); // Selected user
  const [messages, setMessages] = useState([]); // Chat messages
  const [newMessage, setNewMessage] = useState(""); // New message input
  const [currentUser, setCurrentUser] = useState(""); // ✅ Store logged-in user
  /*const [isLoading, setIsLoading] = useState(false);  // ✅ Loading state*/

const [isLoading, setIsLoading] = useState(false); // ✅ Track loading state

useEffect(() => {
  if (!selectedUser) return;

  setIsLoading(true); // ✅ Start loading before fetching messages

  const chatId = [currentUser, selectedUser].sort().join("_"); // ✅ Ensure chat ID format

  fetch(`http://localhost:8000/api/get-chat/${chatId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("📥 Chat data received:", data);
      setMessages(data || []); // ✅ Ensure messages are set (even if empty)
    })
    .catch((error) => {
      console.error("🔥 Error fetching chat history:", error);
      setMessages([]); // ✅ Reset messages on error
    })
    .finally(() => {
      setIsLoading(false); // ✅ Stop loading in ALL cases
    });

}, [selectedUser, currentUser]); // ✅ Runs whenever selected user changes


  // ✅ Fetch logged-in user from get-texts API
  useEffect(() => {
    fetch("http://localhost:8000/api/get-texts/")  // ✅ Calls get-texts API
      .then((response) => response.json())
      .then((data) => {
        console.log("📥 Received user data:", data);
        if (data && data.username) {
          setCurrentUser(data.username);  // ✅ Assign latest username from backend
        }
      })
      .catch((error) => console.error("🚨 Error fetching logged-in user:", error));
  }, []);

  // ✅ Fetch all users for searching (get-users API)
  useEffect(() => {
    fetch("http://localhost:8000/api/get-users/")  // ✅ Fetch all users
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);  // ✅ Store all users for search
          console.log("👥 All Users Loaded:", data);
        } else {
          console.error("🚨 API did not return an array:", data);
          setUsers([]);
        }
      })
      .catch((error) => {
        console.error("🔥 Error fetching users:", error);
        setUsers([]);
      });
  }, []);
  
  useEffect(() => {
    if (!currentUser) return;
  
    fetch(`http://localhost:8000/api/get-chat-users/${currentUser}/`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("✅ Chat Users Data:", data); // ✅ Debugging log
          setChatUsers(data.map(user => ({ username: user.username, chat_id: user.chat_id }))); // ✅ Ensure correct mapping
        } else {
          console.error("🚨 API did not return an array:", data);
          setChatUsers([]);
        }
      })
      .catch((error) => {
        console.error("🔥 Error fetching chat users:", error);
        setChatUsers([]);
      });
  }, [currentUser]);
  
  /*
  useEffect(() => {
    if (!selectedUser) return;
  
    // ✅ Ensure consistent chat_id format
    const chatId = [currentUser, selectedUser].sort().join("_"); 
  
    const interval = setInterval(() => {
      fetch(`http://localhost:8000/api/get-chat/${chatId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("📥 Chat data received:", data);  // ✅ Debugging log
          setMessages(data);  // ✅ Update chat messages
        })
        .catch((error) => console.error("🔥 Error fetching chat history:", error));
    }, 2000);  // ✅ Polls every 2 seconds
  
    return () => clearInterval(interval);
  }, [selectedUser]);
  */
/*
  useEffect(() => {
    if (!selectedUser || !currentUser) return;  // ✅ Ensure both users are set
  
    // ✅ Ensure consistent chat_id format
    const chatId = [currentUser, selectedUser].sort().join("_"); 
  
    setIsLoading(true);

    const interval = setInterval(() => {
      fetch(`http://localhost:8000/api/get-chat/${chatId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("📥 Chat data received:", data);  // ✅ Debugging log
          setMessages(data);  // ✅ Update chat messages
        })
        .catch((error) => console.error("🔥 Error fetching chat history:", error));
    }, 1000);  // ✅ Polls every 2 seconds
  
    return () => clearInterval(interval);
  }, [selectedUser, currentUser]); */

  /*justnowuseEffect(() => {
    fetch("http://localhost:8000/api/get-users/")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("API did not return an array:", data);
          setUsers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
      });
  }, []);*/

  // ✅ Fetch chat history for logged-in user
/* mood1
  useEffect(() => {
    if (!currentUser) return;
  
    fetch(`http://localhost:8000/api/get-chat-users/${currentUser}/`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // ✅ Ensure we only store valid users
          const chatList = data.filter(user => user.username !== currentUser);
          setChatUsers(chatList);
        } else {
          console.error("🚨 API did not return an array:", data);
          setChatUsers([]);
        }
      })
      .catch((error) => {
        console.error("🔥 Error fetching chat users:", error);
        setChatUsers([]);
      });
  }, [currentUser]); // ✅ Runs only when `currentUser` changes
  */

 /* useEffect(() => {
    if (!currentUser) return;

    setChatUsers([]);
    setSelectedUser(null);
    setMessages([]);

    fetch(`http://localhost:8000/api/get-chat-users/${currentUser}/`)
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setChatUsers([]);
        } else {
          const sortedUsers = data.sort((a, b) => new Date(b.last_text_time) - new Date(a.last_text_time));
          setChatUsers(sortedUsers);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat users:", error);
        setChatUsers([]);
      });
  }, [currentUser]); // ✅ Runs when `currentUser` changes
latest*/
  // ✅ Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (!Array.isArray(users)) return; // ✅ Prevents `.filter()` on non-array

    if (query.trim() === "") {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(users.filter(user => user.username.toLowerCase().startsWith(query))); // ✅ Now searches with "starts with"
    }
  };

  // ✅ Handle user selection
  /*
  const handleUserSelect = async (user) => {
    if (user === currentUser) return; // Prevent selecting self

    setSelectedUser(user);
    setMessages([]); // Clear previous messages before loading new ones

    const chatId = generateChatId(currentUser, user);

    fetch(`http://localhost:8000/api/get-chat/${chatId}/`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching chat history:", error));

    if (!chatUsers.some(chatUser => chatUser.username === user)) {
      setChatUsers(prev => [
        { username: user, chat_id: chatId, last_text_time: new Date().toISOString() },
        ...prev,
      ]);
    }

    setSearch("");
    setFilteredUsers([]);
  };*/

  const handleUserSelect = async (user) => {
    if (user === currentUser) return; // Prevent selecting self
  
    setSelectedUser(user);
    setMessages([]); // ✅ Clear previous messages before loading new ones
  
    const chatId = generateChatId(currentUser, user);
  
    console.log(`🔄 Fetching chat messages for: ${chatId}`);
  
    try {
      const response = await fetch(`http://localhost:8000/api/get-chat/${chatId}/`);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      if (Array.isArray(data) && data.length > 0) {
        setMessages(data); // ✅ Set messages if chat exists
      } else {
        console.warn("⚠ No messages found, but chat exists.");
        setMessages([]); // ✅ Ensure no stale messages remain
      }
    } catch (error) {
      console.error("🔥 Error fetching chat history:", error);
      setMessages([]); // ✅ Prevents displaying old messages
    }
  
    // ✅ Ensure user appears in left panel (if new)
    if (!chatUsers.some(chatUser => chatUser.username === user)) {
      setChatUsers(prev => [
        { username: user, chat_id: chatId, last_text_time: new Date().toISOString() },
        ...prev,
      ]);
    }
  
    setSearch("");
    setFilteredUsers([]);
  };
  

  // ✅ Generate chat ID (same as backend logic)
  const generateChatId = (user1, user2) => {
    const sortedUsers = [user1, user2].sort();
    return btoa(`${sortedUsers[0]}_${sortedUsers[1]}`); // Base64 encoding
  };

  // ✅ Handle message send
  const handleSendMessage = async () => {
    console.log("👤 Current User:", currentUser);

    if (newMessage.trim() === "" || !selectedUser) {
      alert("Please select a user and enter a message.");
      return;
    }

    if (!currentUser || currentUser.trim() === "") {
      alert("Error: Your username is missing. Please log in.");
      return;
    }

    const messageData = {
      username: currentUser,
      selected_username: selectedUser,
      text: newMessage,
    };

    try {
      console.log("📤 Sending message:", messageData);

      const response = await fetch("http://localhost:8000/api/send-message/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const responseData = await response.json();
      console.log("📥 Server response:", responseData);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${responseData.error}`);
      }

      setMessages(prevMessages => [...prevMessages, { sender: currentUser, text: newMessage }]);
      setNewMessage("");
    } catch (error) {
      console.error("🔥 Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="messaging-container">
      {/* Left Panel: Search + Chat List */}
      <div className="left-panel">
        <div className="search-container">
          <input type="text" placeholder="Search Users with username..." value={search} onChange={handleSearch} />
          {search.trim() !== "" && filteredUsers.length > 0 && (
            <ul className="search-results">
              {filteredUsers.map((user, index) => (
                <li key={index} onClick={() => handleUserSelect(user.username)}>
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chat History List (Past Chats) */}
        {/*
        <div className="chat-list">
          <ul>
            {chatUsers.map((chatUser, index) => (
              <li key={index} onClick={() => handleUserSelect(chatUser.username)}>
                {chatUser.username}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="chat-list">
  <ul>
    {chatUsers.map((chatUser, index) => (
      <li key={index} onClick={() => handleUserSelect(chatUser.username)}>
        {chatUser.username}  
      </li>
    ))}
  </ul>
</div>*/}
<div className="chat-list">
  <ul>
    {chatUsers.map((chatUser, index) => (
      <li key={index} onClick={() => handleUserSelect(chatUser.username)}>
        {chatUser.username}
      </li>
    ))}
  </ul>
</div>


      </div>

      {/* Right Panel: Chat Window */}
      <div className="right-panel">
        <div className="user-header">
          {selectedUser ? selectedUser : "Select a Chat"}
        </div>

        {selectedUser && (
          <div className="chat-window">
            {/*
            <div className="messages">
            <p className="loading-message">Loading messages...</p>  
          ) : {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <p key={index} className={msg.sender === currentUser ? "self" : "other"}>
                    {msg.text}
                  </p>
                ))
              ) : (
                <p className="empty-chat-message">No messages yet. Start the conversation!</p>
              )}
            </div>
            at 5:15*/}
           {/* at 5:20 <div className="messages">
  {isLoading ? (
    <p className="loading-message">Loading messages...</p>  // ✅ Show loading
  ) : messages.length > 0 ? (
    messages.map((msg, index) => (
      <p key={index} className={msg.sender === currentUser ? "self" : "other"}>
        {msg.text}
      </p>
    ))
  ) : (
    <p className="empty-chat-message">No messages yet. Start the conversation!</p>  // ✅ Only if no messages
  )}
</div>*/}

<div className="messages">
  {isLoading ? (
    <p className="loading-message">Loading messages...</p>  // ✅ Show while loading
  ) : messages.length > 0 ? (
    messages.map((msg, index) => (
      <p key={index} className={msg.sender === currentUser ? "self" : "other"}>
        {msg.text}
      </p>
    ))
  ) : (
    <p className="empty-chat-message">No messages yet. Start the conversation!</p>  // ✅ Show only if no messages exist
  )}
</div>


            {/* Send Message Box */}
            <div className="message-input">
              <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <button onClick={handleSendMessage} disabled={!selectedUser || !newMessage.trim()}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;

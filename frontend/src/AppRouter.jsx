import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './Home';
import Messaging from './MessagingSystem';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/messaging" element={<Messaging />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

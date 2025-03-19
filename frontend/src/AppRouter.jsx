import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './Home';
import NoteForm from './NoteForm';
import NotesList from './NoteList';
import UpdateNote from './UpdateNote';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/new_notes" element={<NoteForm />} />
        <Route path="/notes_list" element={<NotesList />} />
        
        <Route path="/update_note" element={<UpdateNote />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

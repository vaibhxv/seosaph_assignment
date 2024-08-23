import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import './App.css';

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add-user" element={<AddUser />} />
        </Routes>
      </Router>
  )
}
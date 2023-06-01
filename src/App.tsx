import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import UserFolder from './UserFolder';
import Register from './Register';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/user-folder" element={<UserFolder />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
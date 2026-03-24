// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import CourierDashboard from './components/CourierDashboard';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/courier" element={<CourierDashboard />} />
        </Routes>
      </Router>
  );
}

export default App;
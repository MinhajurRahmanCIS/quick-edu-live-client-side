import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import QHome from './QHome';
import Room from './Room';

const socket = io('https://meet-p57l.onrender.com');

function QuickMeet() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/qhome" element={<QHome />} />
          <Route path="/room/:roomId" element={<Room socket={socket} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default QuickMeet;
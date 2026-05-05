import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Navbar from './Navbar';
import Maps from './Maps';
import About from './About';
import Account from './Account';
import EmergencyAlert from './EmergencyAlert';
import EmergencyContacts from './EmergencyContacts';
import FAQ from './Faq';

function App() {
  const [activePage, setActivePage] = useState(null);
  const location = useLocation();

  const authPages = ['/', '/login', '/register'];
  const isLoggedIn = !authPages.includes(location.pathname) && localStorage.getItem("token");

  return (
    <>
      <Navbar />
      {activePage === "EmergencyContacts" ? (
        <EmergencyContacts onBack={() => setActivePage(null)} />
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/account" element={<Account setActivePage={setActivePage} />} />
        </Routes>
      )}
      {isLoggedIn && <EmergencyAlert />}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
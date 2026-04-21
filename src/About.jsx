import React from 'react';
import './About.css';
import logo2 from "./logo.png";

const About = () => {
  return (
    <div className="about-page">
      <main className="about-main">
        <div className="about-content">
          <div className="about-text-side">
            <h1 className="about-heading">
              RideWatch helps commuters track public transport vehicles and view accurate arrival times.
            </h1>
          </div>
          <div className="about-image-side">
            <div className="hero-card">
                <img src={logo2} alt="Home Logo" style={{ width: "100%", maxWidth: "400px", height: "auto" }} />
              </div>
          </div>
        </div>
      </main>

      <footer className="about-footer">
        <p>© 2026-2027 RideWatch. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import "./EmergencyAlert.css";

const EMAILJS_SERVICE_ID = "service_ddaz9is";
const EMAILJS_TEMPLATE_ID = "template_kw2qbqf";
const EMAILJS_PUBLIC_KEY = "XhiZrS1XmZ2UdD8EX";

const EMERGENCY_CONTACTS = [
  { name: "Mom", email: "{{to_email}}" },
];

const USER_NAME = "John Doe";

export default function EmergencyAlert() {
  const [phase, setPhase] = useState("idle");
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation(null)
      );
    }
  }, []);

  useEffect(() => {
    if (phase === "countdown") {
      if (countdown === 0) {
        clearInterval(timerRef.current);
        sendAlert();
        return;
      }
      timerRef.current = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, countdown]);

  const handleSOSClick = () => {
    setPhase("confirm");
  };

  const handleConfirm = () => {
    setCountdown(5);
    setPhase("countdown");
  };

  const handleCancel = () => {
    clearInterval(timerRef.current);
    setPhase("idle");
    setCountdown(5);
  };

  const sendAlert = async () => {
  setPhase("sending");

  const time = new Date().toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const getLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 8000 }
      );
    });

  const freshLocation = await getLocation();

  const mapsLink = freshLocation
    ? `https://maps.google.com/?q=${freshLocation.lat},${freshLocation.lng}`
    : "Location unavailable";

  const locationText = freshLocation
    ? `${freshLocation.lat.toFixed(5)}, ${freshLocation.lng.toFixed(5)}`
    : "Could not retrieve location";

  try {
    await Promise.all(
      EMERGENCY_CONTACTS.map((contact) =>
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            user_name: USER_NAME,
            to_email: contact.email,
            location: locationText,
            maps_link: mapsLink,
            time,
          },
          EMAILJS_PUBLIC_KEY
        )
      )
    );
    setPhase("sent");
    setTimeout(() => setPhase("idle"), 6000);
  } catch (err) {
    console.error("EmailJS error:", err);
    setErrorMsg("Failed to send alert. Check your EmailJS config.");
    setPhase("error");
    setTimeout(() => setPhase("idle"), 5000);
  }
};

  return (
    <>
      <button
        className={`sos-fab ${phase !== "idle" ? "sos-fab--active" : ""}`}
        onClick={handleSOSClick}
        aria-label="Emergency SOS"
        title="Emergency SOS"
      >
        <span className="sos-fab-label">SOS</span>
        <span className="sos-fab-pulse" />
      </button>

      {phase !== "idle" && (
        <div className="sos-overlay" onClick={phase === "confirm" ? handleCancel : undefined}>
          <div className="sos-modal" onClick={(e) => e.stopPropagation()}>

            {phase === "confirm" && (
              <>
                <div className="sos-modal-icon sos-modal-icon--warn">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <h2 className="sos-modal-title">Send Emergency Alert?</h2>
                <p className="sos-modal-desc">
                  This will immediately notify your emergency contacts with your
                  current GPS location via email.
                </p>
                <div className="sos-modal-actions">
                  <button className="sos-btn sos-btn--cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="sos-btn sos-btn--confirm" onClick={handleConfirm}>
                    Yes, Send Alert
                  </button>
                </div>
              </>
            )}

            {phase === "countdown" && (
              <>
                <div className="sos-countdown-ring">
                  <svg viewBox="0 0 80 80" className="sos-ring-svg">
                    <circle cx="40" cy="40" r="34" className="sos-ring-track" />
                    <circle
                      cx="40" cy="40" r="34"
                      className="sos-ring-progress"
                      style={{ strokeDashoffset: `${213.6 - (213.6 * (5 - countdown)) / 5}` }}
                    />
                  </svg>
                  <span className="sos-countdown-num">{countdown}</span>
                </div>
                <h2 className="sos-modal-title">Sending in {countdown}s…</h2>
                <p className="sos-modal-desc">Alert will be sent to your emergency contacts.</p>
                <button className="sos-btn sos-btn--cancel sos-btn--wide" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}

            {phase === "sending" && (
              <>
                <div className="sos-spinner" />
                <h2 className="sos-modal-title">Sending Alert…</h2>
                <p className="sos-modal-desc">Notifying your emergency contacts now.</p>
              </>
            )}

            {phase === "sent" && (
              <>
                <div className="sos-modal-icon sos-modal-icon--success">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="sos-modal-title">Alert Sent</h2>
                <p className="sos-modal-desc">
                  Your emergency contacts have been notified with your location.
                  Stay calm — help is on the way.
                </p>
                <button className="sos-btn sos-btn--cancel sos-btn--wide" onClick={handleCancel}>
                  Close
                </button>
              </>
            )}

            {phase === "error" && (
              <>
                <div className="sos-modal-icon sos-modal-icon--error">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <h2 className="sos-modal-title">Alert Failed</h2>
                <p className="sos-modal-desc">{errorMsg}</p>
                <button className="sos-btn sos-btn--cancel sos-btn--wide" onClick={handleCancel}>
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
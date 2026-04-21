import { useState, useRef, useEffect } from "react";
import "./Notifications.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "emergency",
    title: "SOS Alert Sent",
    message: "Your emergency contacts were notified at 8:21 PM.",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "ride",
    title: "Ride Completed",
    message: "Your ride to SM Cebu has been completed. 5.2km traveled.",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    type: "safety",
    title: "Safety Score Updated",
    message: "Your safety score improved to 98%. Great riding!",
    time: "3h ago",
    read: true,
  },
  {
    id: 4,
    type: "account",
    title: "Profile Updated",
    message: "Your contact number was successfully updated.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "ride",
    title: "Route Deviation Detected",
    message: "Your last ride deviated from the expected route. Tap to review.",
    time: "Yesterday",
    read: true,
  },
];

const typeConfig = {
  emergency: {
    color: "#c0392b",
    bg: "rgba(192,57,43,0.1)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  ride: {
    color: "#1e64b4",
    bg: "rgba(30,100,180,0.1)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
        <circle cx="7" cy="17" r="1"/><circle cx="17" cy="17" r="1"/>
      </svg>
    ),
  },
  safety: {
    color: "#27ae60",
    bg: "rgba(39,174,96,0.1)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  account: {
    color: "#8b6914",
    bg: "rgba(139,105,20,0.1)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
};

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notif-wrapper" ref={panelRef}>
      <button
        className={`notif-bell ${open ? "notif-bell--open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-panel-header">
            <span className="notif-panel-title">Notifications</span>
            <div className="notif-panel-actions">
              {unreadCount > 0 && (
                <button className="notif-text-btn" onClick={markAllRead}>
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button className="notif-text-btn notif-text-btn--danger" onClick={clearAll}>
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p>You're all caught up!</p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = typeConfig[n.type] || typeConfig.account;
                return (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? "notif-item--unread" : ""}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="notif-icon" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <div className="notif-content">
                      <div className="notif-item-header">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-time">{n.time}</span>
                      </div>
                      <p className="notif-item-msg">{n.message}</p>
                    </div>
                    {!n.read && <span className="notif-unread-dot" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
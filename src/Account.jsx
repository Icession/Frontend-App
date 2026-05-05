import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";

const API_URL = "http://localhost:8080/api/users/me";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function Account({ setActivePage }) {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", gender: "", contact: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setUserData(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        gender: data.gender || "",
        contact: data.contact || "",
      });
    } catch (err) {
      setError("Could not load profile. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          gender: form.gender,
          contact: form.contact,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save changes");
        return;
      }

      setUserData(data);
      // Update localStorage so Navbar/other components reflect changes
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      setEditMode(false);
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (err) {
      setError("Could not delete account.");
    }
  };

  const formatMemberSince = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const formatDistance = (km) => {
    if (!km) return "0km";
    return `${km.toFixed(1)}km`;
  };

  const formatSafetyScore = (score) => {
    if (!score) return "100%";
    return `${score.toFixed(0)}%`;
  };

  const initials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  if (loading) {
    return (
      <div className="account-page">
        <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-wrapper">

        {error && (
          <div style={{
            background: "rgba(139,0,0,0.08)", color: "#8b0000",
            padding: "10px 16px", borderRadius: "8px",
            marginBottom: "12px", fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <div className="profile-hero">
          <div className="profile-hero-left">
            <div className="avatar-ring">
              <div className="avatar-circle">{initials}</div>
            </div>
            <div className="profile-hero-info">
              <h2 className="profile-name">{form.name}</h2>
              <p className="profile-email">{form.email}</p>
              <span className="profile-badge">
                {userData?.verified ? "Verified Rider" : "Rider"}
              </span>
            </div>
          </div>
          <div className="profile-hero-actions">
            <button className="btn-edit" onClick={() => {
              if (editMode) {
                // Cancel — reset form to current userData
                setForm({
                  name: userData.name || "",
                  email: userData.email || "",
                  gender: userData.gender || "",
                  contact: userData.contact || "",
                });
              }
              setEditMode(!editMode);
            }}>
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
            {editMode && (
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{userData?.totalRides ?? 0}</span>
            <span className="stat-label">Total Rides</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatDistance(userData?.distanceTraveledKm)}</span>
            <span className="stat-label">Distance Traveled</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatSafetyScore(userData?.safetyScore)}</span>
            <span className="stat-label">Safety Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatMemberSince(userData?.memberSince)}</span>
            <span className="stat-label">Member Since</span>
          </div>
        </div>

        <div className="section-card">
          <h3 className="section-title">Personal Information</h3>
          <div className="fields-grid">
            <div className="field-group">
              <label className="field-label">Full Name</label>
              {editMode ? (
                <input className="field-input" name="name" value={form.name} onChange={handleChange} />
              ) : (
                <div className="field-display">{form.name || "—"}</div>
              )}
            </div>
            <div className="field-group">
              <label className="field-label">Gender</label>
              {editMode ? (
                <select className="field-input" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Prefer not to say</option>
                </select>
              ) : (
                <div className="field-display">{form.gender || "—"}</div>
              )}
            </div>
            <div className="field-group">
              <label className="field-label">Email</label>
              {editMode ? (
                <input className="field-input" name="email" value={form.email} onChange={handleChange} />
              ) : (
                <div className="field-display">{form.email || "—"}</div>
              )}
            </div>
            <div className="field-group">
              <label className="field-label">Contact Number</label>
              {editMode ? (
                <input className="field-input" name="contact" value={form.contact} onChange={handleChange} />
              ) : (
                <div className="field-display">{form.contact || "—"}</div>
              )}
            </div>
          </div>
        </div>

        <div className="section-card">
          <h3 className="section-title">Account Settings</h3>
          <div className="quick-links">

            <button className="quick-link-item">
              <div className="quick-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span className="quick-link-label">Change Password</span>
              <svg className="quick-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <button className="quick-link-item">
              <div className="quick-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <span className="quick-link-label">Rides Update Notifications</span>
              <svg className="quick-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <button
              className="quick-link-item"
              onClick={() => setActivePage && setActivePage("EmergencyContacts")}
            >
              <div className="quick-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <span className="quick-link-label">Emergency Contacts</span>
              <svg className="quick-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <button
              className="quick-link-item quick-link-danger"
              onClick={handleDeleteAccount}
            >
              <div className="quick-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </div>
              <span className="quick-link-label">Delete Account</span>
              <svg className="quick-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
import { useState } from "react";
import "./EmergencyContacts.css";

const MAX_CONTACTS = 3;

const defaultContacts = [
  { id: 1, name: "Mom", email: "mom@gmail.com", phone: "+63912345678", relation: "Family" },
];

export default function EmergencyContacts({ onBack }) {
  const [contacts, setContacts] = useState(defaultContacts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", relation: "" });
  const [deleteId, setDeleteId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setForm({ name: "", email: "", phone: "", relation: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (contact) => {
    setForm({ name: contact.name, email: contact.email, phone: contact.phone, relation: contact.relation });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingId !== null) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
      );
    } else {
      setContacts((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
  };

  const relationColors = {
    Family:  { bg: "rgba(139,0,0,0.08)",  text: "#8b0000" },
    Friend:  { bg: "rgba(30,100,180,0.08)", text: "#1e64b4" },
    Partner: { bg: "rgba(180,70,30,0.08)", text: "#b4461e" },
    Other:   { bg: "rgba(80,80,80,0.1)",  text: "#444" },
  };

  const getRelColor = (rel) => relationColors[rel] || relationColors["Other"];

  return (
    <div className="ec-page">
      <div className="ec-wrapper">

        <div className="ec-header">
          <button className="ec-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Account
          </button>
          <div className="ec-header-text">
            <h1 className="ec-title">Emergency Contacts</h1>
            <p className="ec-subtitle">
              These contacts are notified instantly when you trigger an SOS alert.
            </p>
          </div>
        </div>
        <div className="ec-limit-bar">
          <div className="ec-limit-dots">
            {Array.from({ length: MAX_CONTACTS }).map((_, i) => (
              <span key={i} className={`ec-dot ${i < contacts.length ? "ec-dot--filled" : ""}`} />
            ))}
          </div>
          <span className="ec-limit-text">
            {contacts.length} / {MAX_CONTACTS} contacts added
          </span>
        </div>

        <div className="ec-list">
          {contacts.map((contact) => {
            const rel = getRelColor(contact.relation);
            return (
              <div key={contact.id} className="ec-card">
                <div className="ec-card-left">
                  <div className="ec-avatar">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ec-card-info">
                    <div className="ec-card-name-row">
                      <span className="ec-card-name">{contact.name}</span>
                      {contact.relation && (
                        <span className="ec-relation-badge" style={{ background: rel.bg, color: rel.text }}>
                          {contact.relation}
                        </span>
                      )}
                    </div>
                    <span className="ec-card-email">{contact.email}</span>
                    {contact.phone && (
                      <span className="ec-card-phone">{contact.phone}</span>
                    )}
                  </div>
                </div>
                <div className="ec-card-actions">
                  <button className="ec-action-btn ec-action-btn--edit" onClick={() => openEdit(contact)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="ec-action-btn ec-action-btn--delete" onClick={() => setDeleteId(contact.id)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}

          {contacts.length === 0 && (
            <div className="ec-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <p>No emergency contacts added yet.</p>
            </div>
          )}
        </div>

        {contacts.length < MAX_CONTACTS && (
          <button className="ec-add-btn" onClick={openAdd}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Emergency Contact
          </button>
        )}

        <div className="ec-info-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>
            When you press SOS, all contacts above receive an email with your exact GPS location and a Google Maps link.
          </span>
        </div>

      </div>

      {showForm && (
        <div className="ec-overlay" onClick={() => setShowForm(false)}>
          <div className="ec-form-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="ec-form-title">
              {editingId !== null ? "Edit Contact" : "Add Contact"}
            </h3>

            <div className="ec-form-fields">
              <div className="ec-field">
                <label className="ec-field-label">Full Name *</label>
                <input className="ec-field-input" name="name" placeholder="e.g. Maria Cruz" value={form.name} onChange={handleChange} />
              </div>
              <div className="ec-field">
                <label className="ec-field-label">Email Address *</label>
                <input className="ec-field-input" name="email" type="email" placeholder="contact@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="ec-field">
                <label className="ec-field-label">Phone Number</label>
                <input className="ec-field-input" name="phone" placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={handleChange} />
              </div>
              <div className="ec-field">
                <label className="ec-field-label">Relationship</label>
                <select className="ec-field-input" name="relation" value={form.relation} onChange={handleChange}>
                  <option value="">Select…</option>
                  <option>Family</option>
                  <option>Friend</option>
                  <option>Partner</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="ec-form-actions">
              <button className="ec-form-btn ec-form-btn--cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button
                className="ec-form-btn ec-form-btn--save"
                onClick={handleSave}
                disabled={!form.name.trim() || !form.email.trim()}
              >
                {editingId !== null ? "Save Changes" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="ec-overlay" onClick={() => setDeleteId(null)}>
          <div className="ec-form-modal ec-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ec-delete-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h3 className="ec-form-title">Remove Contact?</h3>
            <p className="ec-delete-desc">This contact will no longer be notified during an SOS alert.</p>
            <div className="ec-form-actions">
              <button className="ec-form-btn ec-form-btn--cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="ec-form-btn ec-form-btn--delete" onClick={() => handleDelete(deleteId)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
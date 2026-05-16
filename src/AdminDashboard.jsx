import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { myAxios } from "./helper";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await myAxios.get("/admin/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      setError("Failed to load dashboard stats");
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await myAxios.get("/admin/users");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await myAxios.put(`/admin/users/${userId}/status`, null, {
        params: { isActive: newStatus }
      });
      fetchUsers();
      setSuccessMessage("User status updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to update user status");
      console.error(err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await myAxios.post("/admin/users", createFormData);
      setSuccessMessage("User created successfully!");
      setCreateFormData({ firstName: "", lastName: "", email: "", password: "" });
      setShowCreateForm(false);
      fetchUsers();
      fetchDashboardStats();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to create user");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await myAxios.delete(`/admin/users/${userId}`);
        setSuccessMessage("User deleted successfully!");
        fetchUsers();
        fetchDashboardStats();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Failed to delete user");
        console.error(err);
      }
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {successMessage && (
        <div className="admin-success">
          {successMessage}
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Dashboard Stats
        </button>
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      {activeTab === "stats" && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="stat-value">{stats.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Trips</h3>
            <p className="stat-value">{stats.totalTrips}</p>
          </div>
          <div className="stat-card">
            <h3>Total Distance (km)</h3>
            <p className="stat-value">{stats.totalDistanceKm.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Average Safety Score</h3>
            <p className="stat-value">{stats.averageSafetyScore.toFixed(1)}</p>
          </div>
          <div className="stat-card">
            <h3>Emergency Alerts</h3>
            <p className="stat-value">{stats.emergencyAlertsCount}</p>
          </div>
          <div className="stat-card">
            <h3>Failed Alerts</h3>
            <p className="stat-value warning">{stats.failedAlertsCount}</p>
          </div>
          <div className="stat-card">
            <h3>Total FAQs</h3>
            <p className="stat-value">{stats.faqCount}</p>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="users-management">
          <div className="users-header">
            <h2>User Management</h2>
            <button 
              className="create-btn"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "+ Add New User"}
            </button>
          </div>

          {showCreateForm && (
            <form className="create-user-form" onSubmit={handleCreateUser}>
              <h3>Create New User</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={createFormData.firstName}
                    onChange={handleCreateFormChange}
                    required
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={createFormData.lastName}
                    onChange={handleCreateFormChange}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={createFormData.email}
                    onChange={handleCreateFormChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={createFormData.password}
                    onChange={handleCreateFormChange}
                    required
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">Create User</button>
            </form>
          )}

          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rides</th>
                  <th>Distance (km)</th>
                  <th>Safety Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.totalRides}</td>
                    <td>{user.distanceTraveledKm.toFixed(2)}</td>
                    <td>{user.safetyScore.toFixed(1)}</td>
                    <td>
                      <span className={user.isActive ? "status-active" : "status-inactive"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="action-btns">
                      <button
                        className="toggle-btn"
                        onClick={() => handleUserStatusChange(user.id, !user.isActive)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

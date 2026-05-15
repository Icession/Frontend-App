import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { myAxios } from "./helper";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");

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
    } catch (err) {
      setError("Failed to update user status");
      console.error(err);
    }
  };

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

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
        <div className="users-table">
          <h2>User Management</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rides</th>
                  <th>Distance (km)</th>
                  <th>Safety Score</th>
                  <th>Status</th>
                  <th>Action</th>
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
                    <td>
                      <button
                        className="toggle-btn"
                        onClick={() => handleUserStatusChange(user.id, !user.isActive)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
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

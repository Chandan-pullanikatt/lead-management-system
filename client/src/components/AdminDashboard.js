import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/leads');
                setLeads(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/admin/login');
                }
            }
        };
        fetchLeads();
    }, [navigate]);

    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = currentStatus === 'new' ? 'contacted' : 'new';
        try {
            const res = await api.put(`/leads/${id}/status`, { status: newStatus });
            setLeads(leads.map(lead => (lead.id === id ? res.data.lead : lead)));
            setMessage('Status updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await api.delete(`/leads/${id}`);
            setLeads(leads.filter(lead => lead.id !== id));
            setMessage('Lead deleted successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error deleting lead', err);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const lowerSearch = search.toLowerCase();
        const matchesSearch =
            lead.name.toLowerCase().includes(lowerSearch) ||
            lead.email.toLowerCase().includes(lowerSearch);

        const matchesCourse = filterCourse ? lead.course.toLowerCase().includes(filterCourse.toLowerCase()) : true;

        return matchesSearch && matchesCourse;
    });

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            {message && <p className="success-msg">{message}</p>}

            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filter by course"
                    value={filterCourse}
                    onChange={e => setFilterCourse(e.target.value)}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeads.map(lead => (
                        <tr key={lead.id}>
                            <td>{lead.id}</td>
                            <td>{lead.name}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone}</td>
                            <td>{lead.course}</td>
                            <td>
                                <span className={`status-badge ${lead.status}`}>
                                    {lead.status}
                                </span>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleStatusUpdate(lead.id, lead.status)}
                                    className="action-btn"
                                >
                                    Mark as {lead.status === 'new' ? 'Contacted' : 'New'}
                                </button>
                                <button
                                    onClick={() => handleDelete(lead.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory
import api from '../services/api';
import './LeadForm.css'; // Reusing form styles for simplicity

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid Credentials');
        }
    };

    return (
        <div className="lead-form-container">
            <h2>Admin Login</h2>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <button
                onClick={() => navigate('/')}
                className="back-btn"
                style={{ marginTop: '10px', backgroundColor: '#6c757d' }}
            >
                Back to Forms
            </button>
        </div>
    );
};

export default AdminLogin;

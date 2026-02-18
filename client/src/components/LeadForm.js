import React, { useState } from 'react';
import api from '../services/api';
import './LeadForm.css'; // We will create this CSS file

const LeadForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        college: '',
        year: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { name, email, phone, course, college, year } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await api.post('/leads', formData);
            setMessage('Application submitted successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                course: '',
                college: '',
                year: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="lead-form-container">
            <h2>Enroll Now</h2>
            {message && <p className="success-msg">{message}</p>}
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
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
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Course</label>
                    <input
                        type="text"
                        name="course"
                        value={course}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>College</label>
                    <input
                        type="text"
                        name="college"
                        value={college}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Year</label>
                    <select name="year" value={year} onChange={onChange} required>
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduated">Graduated</option>
                    </select>
                </div>
                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
};

export default LeadForm;

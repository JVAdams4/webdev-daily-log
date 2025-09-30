import React, { useState } from 'react';
import api from '../../services/api';

const ChangePassword = () => {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            setMessage('New passwords do not match');
            return;
        }
        try {
            const res = await api.post('/auth/change-password', formData);
            setMessage(res.data.msg);
        } catch (err: any) {
            setMessage(err.response.data.msg);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
            <h2>Change Password</h2>
            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Current Password" required className="form-control mb-3" />
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" required className="form-control mb-3" />
            <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} placeholder="Confirm New Password" required className="form-control mb-3" />
            <button type="submit" className="btn btn-primary w-100">Change Password</button>
            {message && <p className="mt-3">{message}</p>}
        </form>
    );
};

export default ChangePassword;
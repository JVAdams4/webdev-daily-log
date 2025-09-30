import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const [formData, setFormData] = useState({ newPassword: '', confirmNewPassword: '' });
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
            const res = await api.post(`/auth/reset-password/${token}`, { newPassword: formData.newPassword });
            setMessage(res.data.msg);
        } catch (err: any) {
            setMessage(err.response.data.msg);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
            <h2>Reset Password</h2>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" required className="form-control mb-3" />
            <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} placeholder="Confirm New Password" required className="form-control mb-3" />
            <button type="submit" className="btn btn-primary w-100">Reset Password</button>
            {message && <p className="mt-3">{message}</p>}
        </form>
    );
};

export default ResetPassword;
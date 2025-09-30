import React, { useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(`Password reset link (for simulation): /reset-password/${res.data.token}`);
        } catch (err: any) {
            setMessage(err.response.data.msg);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
            <h2>Forgot Password</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="form-control mb-3" />
            <button type="submit" className="btn btn-primary w-100">Submit</button>
            {message && <p className="mt-3">{message}</p>}
            <p className="mt-3">Remember your password? <Link to="/login">Login here</Link></p>
        </form>
    );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) { alert('Login Failed'); }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
            <h2>Login</h2>
            <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email" required className="form-control mb-3" />
            <input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Password" required className="form-control mb-3" />
            <button type="submit" className="btn btn-primary w-100">Login</button>
            <p className="mt-3">Don't have an account? <Link to="/register">Register here</Link></p>
            <p className="mt-3"><Link to="/forgot-password">Forgot Password?</Link></p>
        </form>
    );
};
export default Login;
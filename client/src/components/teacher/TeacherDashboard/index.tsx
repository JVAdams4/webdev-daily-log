import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import UserFormsView from '../UserFormsView';

// Define user interface based on usage
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  ungradedCount: number;
}

const TeacherDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    if (selectedUser) {
        return <UserFormsView user={selectedUser} onBack={() => setSelectedUser(null)} />
    }

    if (loading) return <p>Loading users...</p>;

    return (
        <div>
            <h2>Teacher Dashboard</h2>
            <ul className="list-group">
                {users.map(user => (
                    <li key={user._id} onClick={() => setSelectedUser(user)} className="list-group-item d-flex justify-content-between align-items-center" style={{cursor: 'pointer'}}>
                        {user.firstName} {user.lastName}
                        {user.ungradedCount > 0 && <span className="badge bg-danger rounded-pill">{user.ungradedCount}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default TeacherDashboard;
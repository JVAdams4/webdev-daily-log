import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import FormDetailView from './FormDetailView';
import NewForm from './NewForm';

// Define types for state
type ViewType = 'list' | 'detail' | 'new';

interface Form {
  _id: string;
  date: string;
  feedback: any; // Or a more specific Feedback type
}

const Dashboard = () => {
    const [forms, setForms] = useState<Form[]>([]);
    const [view, setView] = useState<ViewType>('list');
    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

    useEffect(() => {
        const fetchForms = async () => {
            const res = await api.get('/forms');
            setForms(res.data);
        };
        // Fetch forms only when the view is 'list'
        if (view === 'list') {
            fetchForms();
        }
    }, [view]);

    const handleViewChange = (newView: ViewType, formId: string | null = null) => {
        setSelectedFormId(formId);
        setView(newView);
    }

    if (view === 'new') return <NewForm onFormSubmit={() => setView('list')} />;
    // The check below ensures selectedFormId is a string when FormDetailView is rendered
    if (view === 'detail' && selectedFormId) return <FormDetailView formId={selectedFormId} onBack={() => setView('list')} />;

    return (
        <div>
            <h2>Your Dashboard</h2>
            <button className="btn btn-primary mb-4" onClick={() => handleViewChange('new')}>Open New Form</button>
            <h3>Your Previous Forms</h3>
            <ul className="list-group">
                {forms.map(form => (
                    <li key={form._id} onClick={() => handleViewChange('detail', form._id)} className="list-group-item d-flex justify-content-between align-items-center" style={{cursor: 'pointer'}}>
                        <span>{`Daily Work Log (${new Date(form.date).toLocaleDateString()})`}</span>
                        {form.feedback && <span className="badge bg-success">Graded</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Dashboard;
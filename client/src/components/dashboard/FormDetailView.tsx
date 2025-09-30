import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import InstructorFeedback from './InstructorFeedback';

interface FormDetailViewProps {
  formId: string;
  onBack: () => void;
}

const FormDetailView: React.FC<FormDetailViewProps> = ({ formId, onBack }) => {
    const [form, setForm] = useState<any>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await api.get(`/forms/${formId}`);
                setForm(res.data);
            } catch (err) { console.error(err); }
        };
        fetchForm();
    }, [formId]);

    if (!form) return <p>Loading form...</p>;

    const { formData } = form;

    return (
        <div>
            <button className="btn btn-secondary mb-3" onClick={onBack}>Back to List</button>
            <h3>{`${form.userFullName} Daily Work Log (${new Date(form.date).toLocaleDateString()})`}</h3>
            <div className="p-3 rounded" style={{backgroundColor: 'hsl(0, 0%, 10%)'}}>
                <h4>1. Daily Goals & Progress</h4>
                <div className="qa-pair">
                    <label>My main goal for today is:</label>
                    <p>{formData.dailyGoal || 'No answer provided'}</p>
                </div>
                <div className="qa-pair">
                    <label>What I will focus on:</label>
                    <p>{formData.focusOn || 'No answer provided'}</p>
                </div>
                <div className="qa-pair">
                    <label>Evidence of Work: (List links, file names, or a brief description of what you produced. Deliverables must be sent to me via Slack.)</label>
                    <p>{formData.evidenceOfWork || 'No answer provided'}</p>
                </div>

                <hr style={{borderColor: 'hsl(0, 0%, 30%)'}}/>

                <h4>2. Reflection & Next Steps</h4>
                <div className="qa-pair">
                    <label>What went well today? (Wins!):</label>
                    <p>{formData.whatWentWell || 'No answer provided'}</p>
                </div>
                <div className="qa-pair">
                    <label>What challenges did I face?:</label>
                    <p>{formData.challenges || 'No answer provided'}</p>
                </div>
                <div className="qa-pair">
                    <label>What do I need help with?:</label>
                    <p>{formData.helpNeeded || 'No answer provided'}</p>
                </div>
                <div className="qa-pair">
                    <label>What are my next steps for tomorrow?:</label>
                    <p>{formData.nextSteps || 'No answer provided'}</p>
                </div>

                <hr style={{borderColor: 'hsl(0, 0%, 30%)'}}/>

                <h4>3. Productivity & Self-Assessment</h4>
                <div className="qa-pair">
                    <label>Productivity:</label>
                    <p>{formData.productivity || 'No answer provided'}</p>
                </div>
                <div className="qa-pair">
                    <label>Focus:</label>
                    <p>{formData.focus || 'No answer provided'}</p>
                </div>
                <div className="qa-pair">
                    <label>Overall Satisfaction:</label>
                    <p>{formData.overallSatisfaction || 'No answer provided'}</p>
                </div>
            </div>
            {(user && (user.isTeacher || form.feedback)) && <InstructorFeedback feedback={form.feedback} formId={form._id} isTeacher={user.isTeacher} onFeedbackSaved={(updatedForm) => setForm(updatedForm)} />}
        </div>
    );
};
export default FormDetailView;
import React, { useState } from 'react';
import api from '../../services/api';

interface Feedback {
  score: string;
  bonus: string;
  comments: string;
}

interface InstructorFeedbackProps {
  feedback: Feedback | null;
  formId: string;
  isTeacher: boolean;
  onFeedbackSaved: (updatedForm: any) => void;
}

const InstructorFeedback: React.FC<InstructorFeedbackProps> = ({ feedback, formId, isTeacher, onFeedbackSaved }) => {
    const [data, setData] = useState(feedback || { score: '', bonus: '', comments: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData({ ...data, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            const res = await api.put(`/forms/${formId}/feedback`, data);
            onFeedbackSaved(res.data);
            alert('Feedback saved!');
        } catch (err) { alert('Failed to save feedback.'); }
    };

    return (
        <div className="mt-4 p-3 rounded" style={{backgroundColor: 'hsl(0, 0%, 16%)'}}>
            <h4>Instructor Feedback & Grading</h4>
            <p><strong>3-2-1 Daily Work Grading System</strong></p>
            <p>3 – Mastery (Full Points): Work is complete, thorough, and meets or exceeds expectations. You can explain what you did and why.</p>
            <p>2 – Needs Improvement (Partial Points): Work is mostly done but missing small details, polish, or corrections.</p>
            <p>1 – Incomplete (Minimal Points): Little to no progress shown for the day. The goal is not complete or is off-topic.</p>
            <p>Bonus Points: Earned for going above expectations.</p>
            <div className="row mb-3 align-items-end">
                <div className="col-auto">
                    <label className="form-label">Instructor's Score:</label>
                    <input type="text" name="score" className="form-control" value={data.score} onChange={handleChange} readOnly={!isTeacher} style={{ width: '5rem' }} />
                </div>
                <div className="col-auto ps-0">
                    <span className="fs-5">/ 3</span>
                </div>
                <div className="col-auto">
                    <label className="form-label">+ Bonus Points</label>
                    <input type="text" name="bonus" className="form-control" value={data.bonus} onChange={handleChange} readOnly={!isTeacher} style={{ width: '5rem' }} />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Comments:</label>
                <textarea name="comments" className="form-control" value={data.comments} onChange={handleChange} readOnly={!isTeacher} rows={3}></textarea>
            </div>
            {isTeacher && <button className="btn btn-success" onClick={handleSave}>Save Feedback</button>}
        </div>
    );
};
export default InstructorFeedback;
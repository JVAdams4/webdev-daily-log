import express from 'express';
import auth, { AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { IForm } from '../models/Form';
import { IUser } from '../models/User';

const router = express.Router();

router.post('/', auth, async (req: AuthRequest, res) => {
    const { formData } = req.body;
    try {
        const userDoc = await db.collection('users').doc(req.user!.id).get();
        if (!userDoc.exists) return res.status(404).json({ msg: 'User not found' });
        const user = userDoc.data() as IUser;

        const newForm: IForm = {
            userId: req.user!.id,
            userFullName: `${user.firstName} ${user.lastName}`,
            date: new Date(),
            formData,
            feedback: null
        };

        const docRef = await db.collection('forms').add(newForm);
        const form = await docRef.get();
        res.json({ ...form.data(), id: form.id });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/', auth, async (req: AuthRequest, res) => {
    try {
        const snapshot = await db.collection('forms').where('userId', '==', req.user!.id).orderBy('date', 'desc').get();
        const forms = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        res.json(forms);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/user/:userId', auth, async (req: AuthRequest, res) => {
    if (!req.user!.isMaster) return res.status(403).json({ msg: 'Access denied' });
    try {
        const snapshot = await db.collection('forms').where('userId', '==', req.params.userId).orderBy('date', 'desc').get();
        const forms = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        res.json(forms);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/:id', auth, async (req: AuthRequest, res) => {
    try {
        const doc = await db.collection('forms').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ msg: 'Form not found' });

        const form = doc.data() as IForm;
        if (form.userId.toString() !== req.user!.id && !req.user!.isMaster) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        res.json({ ...form, id: doc.id });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.put('/:id/feedback', auth, async (req: AuthRequest, res) => {
    if (!req.user!.isMaster) return res.status(403).json({ msg: 'Access denied' });
    try {
        const docRef = db.collection('forms').doc(req.params.id);
        await docRef.update({ feedback: req.body });
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ msg: 'Form not found' });
        res.json({ ...doc.data(), id: doc.id });
    } catch (err) { res.status(500).send('Server Error'); }
});

export default router;
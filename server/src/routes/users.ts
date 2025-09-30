import express from 'express';
import auth, { AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { IUser } from '../models/User';

const router = express.Router();

router.get('/', auth, async (req: AuthRequest, res) => {
    if (!req.user!.isTeacher) return res.status(403).json({ msg: 'Access denied' });
    try {
        const usersSnapshot = await db.collection('users').where('isTeacher', '==', false).get();
        const users = usersSnapshot.docs.map(doc => {
            const { password, ...user } = doc.data() as IUser;
            return { ...user, id: doc.id };
        });

        const formsSnapshot = await db.collection('forms').where('feedback', '==', null).get();
        const forms = formsSnapshot.docs.map(doc => doc.data());

        const usersWithCounts = users.map(user => {
            const ungradedCount = forms.filter(form => form.userId === user.id).length;
            return { ...user, ungradedCount };
        });

        res.json(usersWithCounts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;

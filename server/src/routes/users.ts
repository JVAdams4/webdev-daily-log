import express from 'express';
import auth, { AuthRequest } from '../middleware/auth';
import { db } from '../db';

const router = express.Router();

router.get('/', auth, async (req: AuthRequest, res) => {
    if (!req.user!.isMaster) return res.status(403).json({ msg: 'Access denied' });
    try {
        const usersSnapshot = await db.collection('users').where('isTeacher', '==', false).get();
        const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

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

export default router;        res.status(500).send('Server Error');
    }
});

export default router;
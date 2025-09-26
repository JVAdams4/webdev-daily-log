import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { IUser } from '../models/User';
import auth, { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const userRef = db.collection('users').where('email', '==', email);
        const snapshot = await userRef.get();
        if (!snapshot.empty) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const isMaster = email === process.env.MASTER_EMAIL;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser: IUser = { firstName, lastName, email, password: hashedPassword, isMaster };
        const docRef = await db.collection('users').add(newUser);

        const payload = { user: { id: docRef.id, isMaster } };
        jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) { res.status(500).send('Server error'); }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRef = db.collection('users').where('email', '==', email);
        const snapshot = await userRef.get();
        if (snapshot.empty) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = snapshot.docs[0].data() as IUser;
        const userId = snapshot.docs[0].id;

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: userId, isMaster: user.isMaster } };
        jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) { res.status(500).send('Server error'); }
});

router.get('/', auth, async (req: AuthRequest, res) => {
    try {
        const doc = await db.collection('users').doc(req.user!.id).get();
        if (!doc.exists) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const user = doc.data() as IUser;
        res.json(user);
    } catch (err) { res.status(500).send('Server Error'); }
});

export default router;
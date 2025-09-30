import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
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

        const isTeacher = email === process.env.TEACHER_EMAIL;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser: IUser = { firstName, lastName, email, password: hashedPassword, isTeacher };
        const docRef = await db.collection('users').add(newUser);

        const payload = { user: { id: docRef.id, isTeacher } };
                jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 3600 }, (err: Error | null, token: string | undefined) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
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

        const payload = { user: { id: userId, isTeacher: user.isTeacher } };
        jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 3600 }, (err: Error | null, token: string | undefined) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) { 
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/change-password', auth, async (req: AuthRequest, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const userRef = db.collection('users').doc(req.user!.id);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const user = doc.data() as IUser;

        const isMatch = await bcrypt.compare(currentPassword, user.password!);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userRef.update({ password: hashedPassword });

        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const userRef = db.collection('users').where('email', '==', email);
        const snapshot = await userRef.get();
        if (snapshot.empty) {
            return res.status(400).json({ msg: 'User with that email does not exist' });
        }
        const userId = snapshot.docs[0].id;

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await db.collection('passwordResetTokens').add({ userId, token, expires });

        // In a real app, you would send an email with the token
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const tokenRef = db.collection('passwordResetTokens').where('token', '==', req.params.token);
        const snapshot = await tokenRef.get();
        if (snapshot.empty) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
        }

        const tokenDoc = snapshot.docs[0];
        const tokenData = tokenDoc.data();

        if (tokenData.expires.toDate() < new Date()) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
        }

        const userRef = db.collection('users').doc(tokenData.userId);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        await userRef.update({ password: hashedPassword });
        await tokenDoc.ref.delete();

        res.json({ msg: 'Password has been reset' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/', auth, async (req: AuthRequest, res) => {
    try {
        const doc = await db.collection('users').doc(req.user!.id).get();
        if (!doc.exists) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const user = doc.data() as IUser;
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;
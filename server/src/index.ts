import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './firebase';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import formRoutes from './routes/forms';
import * as functions from 'firebase-functions';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);

export const api = functions.https.onRequest(app);
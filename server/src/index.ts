import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './firebase';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import formRoutes from './routes/forms';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
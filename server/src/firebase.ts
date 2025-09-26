import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('Firebase Connected');
} else {
  console.error('FIREBASE_SERVICE_ACCOUNT environment variable not set.');
}

export default admin;
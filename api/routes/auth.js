import express from 'express';
import { login, register, registerAdmin, sendEmail, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

// Create a new user in the DB
router.post('/register', register);

// Login a user in the DB
router.post('/login', login);

// Register as Admin
router.post('/register-admin', registerAdmin);

// Send reset email
router.post('/send-email', sendEmail);

// Reset password
router.post('/reset-password', resetPassword);

// // Logout from the DB
// router.post('/logout', logout);

export default router;
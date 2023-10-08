import express from 'express';
import { getAllUsers, getById } from '../controllers/user.controller.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// Get all users (Admin can see a list of all users)
router.get('/', verifyAdmin, getAllUsers);

// Get a user by ID (Only the logged user can see their profile)
router.get('/:id', verifyUser, getById);

export default router;
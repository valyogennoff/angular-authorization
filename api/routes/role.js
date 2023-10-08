import express from 'express';
import { createRole, deleteRole, getAllRoles, updateRole } from '../controllers/role.controller.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Create a new role in the DB
router.post('/add', verifyAdmin, createRole);

// Update a role in the DB
router.put('/update/:id', verifyAdmin, updateRole);

// Get all roles from the DB
router.get('/roles', getAllRoles);

// Delete a role from the DB
router.delete('/delete/:id', deleteRole);

export default router;
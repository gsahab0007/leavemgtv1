import { logout, userLogin } from '../controllers/userCtr.js'
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/login').post(userLogin);
router.route('/logout').post(authMiddleware, logout);


export default router;


import express from "express";
import { 
    register, 
    profile, 
    confirm,
    authenticate,
    restorePass,
    checkToken,
    setNewPass,
    updateProfile,
    updatePassword
} from '../controllers/veterinarianController.js'
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router()

// Public routes
router.post('/', register)
router.get('/confirm/:token', confirm)
router.post('/login', authenticate)
router.post('/restore-password', restorePass)
router.route('/restore-password/:token').get(checkToken).post(setNewPass)

// Private routes
router.get('/profile', checkAuth, profile)
router.put('/profile/:id', checkAuth, updateProfile)
router.put('/update-password', checkAuth, updatePassword)

export default router
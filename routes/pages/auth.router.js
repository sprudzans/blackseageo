import express from "express";
import authController from "../../controllers/auth.controller.js";

const router = express.Router()

router.get('/login', authController.getLoginPage)
router.get('/signup', authController.getSignupPage)
router.get('/logout', authController.getLogoutPage)

router.post('/login', authController.authenticate)
router.post('/signup', authController.register)

export default router;
import express from "express";
import adminController from "../../controllers/admin.controller.js";
import upload from "../../config/upload.js";

const router = express.Router();

router.get('/', adminController.getMainPage)

router.get('/users', adminController.getUsersPage) 
router.get('/users/:userId', adminController.getUsersDetailPage)
router.post('/users/update/:userId', adminController.updateUser)
router.post('/users/delete/:userId', adminController.deleteUser)

router.get('/posts', adminController.getPostsPage)
router.get('/posts/:postId', adminController.getPostsDetailPage)
router.post('/posts/update/:postId', upload, adminController.updatePost)
router.post('/posts/delete/:postId', adminController.deletePost)

export default router;
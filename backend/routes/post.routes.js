import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPosts, getAuthorPosts, getPostComments, likePost } from "../controllers/post.controller.js";
const router = express.Router();
router.route('/addPost').post(isAuthenticated, upload.single('image'), addNewPost)
router.route('/all').get(isAuthenticated, getAllPosts)
router.route('/userpost/all').get(isAuthenticated, getAuthorPosts)
router.route('/:id/like').get(isAuthenticated, likePost)
router.route('/:id/dislike').get(isAuthenticated, dislikePost)
router.route('/:id/comment').post(isAuthenticated, addComment)
router.route('/:id/comment/all').get(isAuthenticated, getPostComments)
router.route('/deletePost/:id').get(isAuthenticated, deletePost)
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost)
export default router; 
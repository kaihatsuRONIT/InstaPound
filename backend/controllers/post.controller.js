import sharp from "sharp"
import cloudinary from "../config/cloudinary.js"
import Post from "../models/post.model.js"
import Comment from "../models/comment.model.js"
import User from "../models/user.model.js"
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body
        const authorId = req.id
        const image = req.file

        if (!image) {
            res.status(404).json({
                message: "please provide an image to upload",
                success: false
            })
        }
        //image upload
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();
        //buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri)

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' })
        return res.status(200).json({
            message: "content posted successfully",
            post,
            success: true,
        })

    } catch (error) {
        console.log(error)
    }
}
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: { path: "author", select: "username profilePicture" }
            })
        return res.status(200).json({
            success: true,
            posts,
            
        })
    } catch (error) {
        console.log(error)
    }
}
export const getAuthorPosts = async (req, res) => {
    try {
        const authorId = req.id
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: { path: "author", select: "username profilePicture" }
            })
        return res.status(200).json({
            posts,
            success: true,
        })

    } catch (error) {
        console.log(error)
    }
}
export const likePost = async (req, res) => {
    try {
        const activeUserId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "post not found",
                success: false
            })
        }
        //post liking logic
        await post.updateOne({ $addToSet: { likes: activeUserId } });
        await post.save();

        //implementing socketIo for real time notification

        return res.status(200).json({
            message: "post Liked",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const dislikePost = async (req, res) => {
    try {
        const activeUserId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "post not found",
                success: false
            })
        }
        //post disliking logic
        await post.updateOne({ $pull: { likes: activeUserId } });
        await post.save();

        //implementing socketIo for real time notification

        return res.status(200).json({
            message: "post disliked",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const addComment = async (req, res) => {
    try {
        const authorId = req.id
        const postId = req.params.id
        const commenter = req.id
        const { text } = req.body
        const post = await Post.findById(postId)
        if (!text) {
            return res.status(400).json({
                message: "text is required",
                success: false
            })
        }
        const comment = await Comment.create({
            text,
            author: authorId,
            post: postId,
        });
        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        });
        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({
            message: "comment added successfully",
            comment,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const getPostComments = async (req, res) => {
    try {
        const postId = req.params.id
        const comments = await Comment.find({ post: postId }).populate({
            path: "author",
            select: "username profilePicture"
        })

        if (!comments) {
            return res.status(404).json({
                message: "No New Comments",
                success: false
            })
        }
        return res.status(200).json({
            comments,
            success: false
        })
    } catch (error) {
        console.log(error)
    }
}
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        const authorId = req.id
        const post = await Post.findById(postId)
        if (!postId) {
            return res.status(404).json({
                message: "post not found",
                success: false
            })
        }
        // check if authorId is owner of the post 
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: "unauthorized",
                success: false
            })
        }
        await Post.findByIdAndDelete(postId)
        let user = await User.findById(authorId)
        // await user.updateOne({ $pull: { posts: postId } });
        //  OR
        user.posts = user.posts.filter(id => id.toString() !== postId)
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "post deleted successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}
export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id
        const authorId = req.id
        const user = await User.findById(authorId)
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "post not found",
                success: false
            })
        }
        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                message: "bookmark removed",
                success: true
            })
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                message: "bookmark added",
                success: true
            })
        }



    } catch (error) {
        console.log(error)
    }
}
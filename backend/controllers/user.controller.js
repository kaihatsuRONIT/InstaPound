import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import getDataUri from "../config/dataUri.js"
import cloudinary from "../config/cloudinary.js"
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Please fill out all information",
                success: false
            })
        }
        const existedUser = await User.findOne({ email })
        if (existedUser) {
            return res.status(401).json({
                message: "User Already Exists",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            username,
            email,
            password: hashedPassword,
        })
        return res.status(201).json({
            message: "You have registered successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }

}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Please fill out all information",
                success: false
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "incorrect email or password",
                success: false
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "incorrect email or password",
                success: false
            })
        }
        const token = jwt.sign({
            userId: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '1d' })
        const populatedPost = await Promise.all(
            user.posts.map(async (postId)=>{
                const post = await Post.findById(postId);
                if(post && post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPost
        }
        
        return res.cookie("token", token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `welcome back, ${user.username}`,
            success: true,
            user,
        })
    } catch (error) {
        console.log(error)
    }
}
export const logout = (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "logged Out successfully",
            success: true,
        })
    } catch (error) {
        console.log(error)
    }
}
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt :-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true,
        })
    } catch (error) {
        console.log(error)
    }
}
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body
        const profilePicture = req.file
        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();
        return res.status(200).json({
            message: "profile updated",
            success: true
            , user
        })
    } catch (error) {
        console.log(error)
    }
}
export const suggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({
            _id: { $ne: req.id }
        }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "currently do not have any users",
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers,

        })
    } catch (error) {
        console.log(error)
    }
}
export const followOrUnfollow = async(req,res)=>{
    try {
        const followingPerson = req.id
        const followedPerson = req.params.id
        if(followingPerson === followedPerson){
            res.status(400).json({
                message : "you cannot follow yourself",
                success : false
            })
        }
        const user = await User.findById(followingPerson)  //me
        const targetUser = await User.findById(followedPerson) //RobertDowneyjr

        if(!user || !targetUser){
            res.status(404).json({
                message : "user not found",
                success : false
            })
        }
        const isFollowing = user.following.includes(followedPerson)
        if(isFollowing){
            //unfollow logic
            await Promise.all([
                User.updateOne({_id : followingPerson} , {$pull : {following : followedPerson}}),
                User.updateOne({_id : followedPerson} , {$pull : {followers : followingPerson}})
            ])
            return res.status(200).json({
                message : "unfollowed successfully",
                success : true
            })
        }
        else{
            //follow logic
            await Promise.all([
                User.updateOne({_id : followingPerson} , {$push : {following : followedPerson}}),
                User.updateOne({_id : followedPerson} , {$push : {followers : followingPerson}})
            ])
            return res.status(200).json({
                message : "followed successfully",
                success : true
            })
        }
    } catch (error) {
        console.log(error)
    }
}
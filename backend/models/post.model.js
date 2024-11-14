import mongoose from "mongoose"
const postSchema = mongoose.Schema({
    caption : {type:String, default:''},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    author:{type:mongoose.Schema.Types.ObjectId, ref:"User",required:true},
    image: {type:String, required:true,},
    comments : [{type:mongoose.Schema.Types.ObjectId, ref: "comment"}]
})
const Post = mongoose.model("Post", postSchema);
export default Post;
import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
	title: {
	     type: String,
         require:true,
         maxlength: 300,
	},
    postBody:{
        type: String,
        require:true,
    },
	imageAndVdo: {
	   type: String,
	   required: true,
	},
	link: {
 	   type: String,
	   required: true,
	},
	like: {
	   type: Number,
	   default: 0,
	},
	dislike: {
        type: Number,
        default: 0,
	},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    users:{
	type:mongoose.Schema.Types.ObjectId,
	ref: "User",
	required: true,
    },
});

const Post = mongoose.model("Post",postSchema)

export default Post

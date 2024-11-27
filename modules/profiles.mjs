import mongoose from "mongoose"

const profileSchema = new mongoose.Schema({
	bio: {
	     type: String,
	},
	profile_pic: {
	   type: String,
	   required: true
	},
	address: {
 	   type: String,
	   required: true,
	},
	gender: {
	   type: String,
	   required: true,
	},
	phone_num: {
	   type: String,
	   required: true,
	},
    birth_day: {
        type: Date,
        required: true,
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

const Profile = mongoose.model("Profile",profileSchema)

export default Profile

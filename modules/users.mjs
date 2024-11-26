import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
	username: {
	     type: String,
	   required: true,
	   uniqle: true
	},
	password: {
	   type: String,
	   required: true
	},
	email: {
 	   type: String,
	   required: true,
	   unique: true
	},
	firstName: {
	   type: String,
	   required: true,
	},
	lastName: {
	   type: String,
	   required: true
	},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User",userSchema)

export default User
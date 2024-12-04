import mongoose from "mongoose"

const cartProductSchema = new mongoose.Schema({
	carts:{
	type:mongoose.Schema.Types.ObjectId,
	ref: "Cart",
	required: true,
    },
	products:{
	type:mongoose.Schema.Types.ObjectId,
	ref: "User",
	required: true,
    },
	quantity:{
	type: Number,
	required:true,
	default: 0,
    }
});

const CartProduct = mongoose.model("CartProduct",cartProductSchema)

export default CartProduct
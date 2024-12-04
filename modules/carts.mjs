import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    carts:{
      type:Number  
    },
    users: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

const Cart = mongoose.model("Cart",cartSchema)

export default Cart
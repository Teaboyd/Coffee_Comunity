import mongoose from "mongoose"

const productsSchema = new mongoose.Schema({
    name:{
      type:String,
      require:true
    },
    description:{
      type:String,
      require:true
    },
    price:{
      type:String,
      require:true
    },
    quantity:{
      type:Number,
      require:true,
      default:0
    },
    category:{
      type:String,
      enum:["Coffee Beans" , "Barista Tools" , "Cleaning Tool"],
      require:true
    },
    created_at:{
      type: Date,
      default: Date.now
    },
    updated_at:{
      type: Date,
      default: Date.now
    },
      users:{
	      type:mongoose.Schema.Types.ObjectId,
	      ref: "User",
	      required: true,
    },
});

const Product = mongoose.model("Product",productsSchema)

export default Product

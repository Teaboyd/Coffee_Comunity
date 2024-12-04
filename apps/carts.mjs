import CartProduct from "../modules/cartProduct.mjs";
import { protect } from "../middlewares/protect.mjs";
import { Router } from "express";
import Cart from "../modules/carts.mjs";

const cartRouter = Router();

cartRouter.post("/" , [protect] , async (req,res) =>{

	try{
	  
	   const {users} = req.body
	   const newCart = new Cart({
		users:req.user_id,
		created_at: new Date(),
		updated_at: new Date(),
		});

	   await newCart.save();

	   return res.status(201).json({
		message: "Cart has been created"		
	   });

	}catch(err){
	   console.log(err)
	   return res.status(500).json({
		message: "Cart can't create because database issue",
	   });
	}
});

cartRouter.post("/cart" , [protect] , async (req,res) => {

});

export default cartRouter

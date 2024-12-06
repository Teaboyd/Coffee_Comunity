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

cartRouter.post("/carts" , [protect] , async (req,res) => {

	try{
	const {products , carts , quantity} = req.body
	const  productCart = new CartProduct ({
		userId : req.user_id,
		products,
		carts,
		quantity,
		created_at: new Date(),
		updated_at: new Date(),
	});

	await productCart.save();

	return res.status(201).json({
		message: "Product has added"
	});
	}catch(err){
		console.log(err)
	   return res.status(500).json({
		message: "Cart can't create because database issue",
	   });
	}	
});

cartRouter.get("/:cartIdProduct/products" , [protect] , async (req,res) => {
	try{

		const { cartProductId } = req.params // ใช้ params เลือก id ของ carts

		const productInCart = await CartProduct.find({ cartProduct: cartProductId}) // หา id ของ cartProduct ที่ users ส่งเข้ามา
			.populate("products","name description price category") // populate ดึงข้อมูลจำเพาะของ products ออกมา
			.exec();

		return res.status(200).json({
			cart: productInCart,
		});
	}catch(err){
		console.log(err)
	   return res.status(500).json({
		message: "Cart can't be read because database issue",
	   });
	}
});

cartRouter.delete("/:cartIdProduct" , [protect] , async (req,res) =>{

	try{
		const {cartIdProduct} = req.params;
		// ดึง id cart product // 
		const cartProductChecker = await CartProduct.findById(cartIdProduct);

		// เช็คว่ามีไหม //
		if ( !cartProductChecker ){
			return res.status(404).json({
				message: "product not found"
			});
		};

		// delete one  ลบออก//
		await CartProduct.deleteOne({_id:cartIdProduct})

		return res.status(200).json({
			message: "Product delete from Cart successfully"
		});
	}catch(err){
		console.log(err)
	   return res.status(500).json({
		message: "Product can't delete from Cart because database issue",
	   });
	}
});

export default cartRouter

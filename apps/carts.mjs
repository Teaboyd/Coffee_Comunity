import CartProduct from "../modules/cartProduct.mjs";
import { protect } from "../middlewares/protect.mjs";
import { Router } from "express";
import Cart from "../modules/carts.mjs";

const cartRouter = Router();

// สร้าง cart //
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

// เพิ่ม products เข้าไปใน cart //
cartRouter.post("/products" , [protect] , async (req,res) => {

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

// ดึงข้อมูล products จากใน carts //
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

// ลบตัว products ออกจาก carts //
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

// คำนวณราคาสินค้าในตระกร้า //
cartRouter.get("/:cartId/total" , [protect] , async (req,res) => {

	try{
	const { cartId } = req.params;
	 // ดึงข้อมูล products ใน carts ออกมา โดยการใช้ populate เพื่อดึงข้อมูลสินค้าที่เชื่อมโยงกับ CartProduct
	const cartProduct = await CartProduct.find({carts: cartId}).populate("products"); 
	
	// ใช้ reduce ในการ วนคำนวณ price แล้วเก็บไว้ใน totalPrice โดยมีการเช็คว่าถ้ามี product แต่ไม่มีราคาก็ให้ข้ามไป //
	const totalPrice = cartProduct.reduce((total , cartProduct) => {
		if(cartProduct.products && cartProduct.products.price){
			return total + cartProduct.products.price * cartProduct.quantity;
		}
		return total;
	},0);

	return res.status(200).json({
		totalPrice: totalPrice,
	});
	
	}catch(err){
		console.log(err)
		return res.status(500).json({
			message: "Cannot computed price because database issue",
		});
	};
});


/// *** ยังไม่เริ่ม validation *** ///
export default cartRouter

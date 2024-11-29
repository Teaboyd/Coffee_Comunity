import { Router } from "express";
import Product from "../modules/products.mjs"; 
import { protect } from "../middlewares/protect.mjs";

const productRouter = Router();

productRouter.post("/" , [protect] , async (req,res) => {
  
    try{
      
      const { name , description , price , quantity , category } = req.body

      const newProducts = new Product ({
        users:req.user_id,
        name,
        description,
        price,
        quatity,
        category,
        created_at: new Date(),
        updated_at: new Date(),
      });

      newProducts.save();
      
    }catch(err){
      console.log(err)
      res.status(500).json({
        message: "Cannot add products because database issue",  
      });
    };

  return res.status(201).json({
    message: "Product has been create" 
  });
  // ยังไม่ test // 
});

productRouter.get("/" , [protect] , async (req,res) => {

  try{

  const product = await Product.findOne({users: req.user_id})
  
  if(!product){
    return res.status(404).json({
      message: "Product not found",
    });
  };

  return res.status(200).json({
    data: product
  });
   
  }catch(err){
    console.log(err)
    return res.status(500).json({
      message: "cannot read products because database issue",
    });
  }; 
  
});

// เช็คดูสินค้าบางชิ้น // 
productRouter.get("/:productId" , [protect] , async (req,res) => {
  
});

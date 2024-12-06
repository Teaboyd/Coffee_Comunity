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
        quantity,
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

    try{
    const {productId} = req.params
    const selectProducts = await Product.findById(productId)

    if(!selectProducts){
      return res.status(404).json({
        message: "Product not found",
      });
    };

    return res.status(200).json({
      data: selectProducts,
    });

    }catch(err){
      console.log(err)
      return res.status(500).json({
        message: "This product cannot read because database issue",
      });
    };
});

productRouter.delete("/:productId" , [protect] , async (req,res) =>{

  try{
      
      const {productId} = req.params
      const productChecker = await Product.findById(productId)

      if ( !productChecker ){
        return res.status(404).json({
            message: "product not found"
        });
    };

      await Product.deleteOne({_id:productId})

    
      return res.status(200).json({
        message: "Product delete successfully"
      });

  }catch(err){
      console.log(err)
        return res.status(500).json({
            message: "This user cannot be deleted because database issue",
      });
  };
});

// แก้ไขสินค้า //
productRouter.put("/:productId" , [protect] , async (req,res) => { 

  try{
  const {productId} = req.params
  const productChecker = await Product.findById(productId);

  if ( !productChecker ){
    return res.status(404).json({
      message: "Post not found"
    });
  }

  const { name , description , price , quantity , category } = req.body


  await Product.findByIdAndUpdate (
    productId,
      {
      $set: {
        name,
        description,
        price,
        quantity,
        category,
        updated_at: new Date(),
      },
     },
   {new : true},
  );


  return res.status(201).json({
    message: "Product has been updated"
  });

  }catch(err){
    console.log(err)
    return res.status(500).json({
       message: "product cannot updated because database issue", 
    });
  }
});

export default productRouter;

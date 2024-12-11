import multer from "multer";

export const uploadProfiles = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/'); // กำหนดที่เก็บไฟล์
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // ตั้งชื่อไฟล์
      },
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // ขนาดไฟล์สูงสุด 5MB
  }).single('profile_pic');
  
  
  export const uploadProducts = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/products/'); // กำหนดที่เก็บไฟล์
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // ตั้งชื่อไฟล์
      },
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // ขนาดไฟล์สูงสุด 5MB
  }).array('product_pic');

  export const uploadPosts = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/posts/'); // กำหนดที่เก็บไฟล์
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // ตั้งชื่อไฟล์
      },
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // ขนาดไฟล์สูงสุด 5MB
  }).single('imageAndVdo');
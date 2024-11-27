import mongoose from "mongoose"

const connectDB = async () =>{

                try{
                  mongoose.connect(
                    'mongodb://localhost:27017/Sapar_Caffe',
                );
                console.log("Connected to Sapar Caffe !!! successfully");
                }catch(err){
                    console.error("Error connecting to MongoDB:",err);
                    process.exit(1);
                }
            };
            

export default connectDB;

        
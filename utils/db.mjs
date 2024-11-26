import mongoose from "mongoose"

const connectDB = async () =>{

                try{
                  mongoose.connect(
                    'mongodb+srv://Teaaboyd:ZaxBam55666@cluster0.ga6gv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
                );
                console.log("Connected to MongoDB successfully");
                }catch(err){
                    console.error("Error connecting to MongoDB:",err);
                    process.exit(1);
                }
            };
            

export default connectDB;

        
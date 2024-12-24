import mongoose from "mongoose";

export const connectMongoDB = async () =>{
    try {
        mongoose.connect("mongodb://localhost:27017/")
        //mongoose.connect("mongodb+srv://administrador:12345@cluster0.457nj.mongodb.net/")
        console.log("MongoDB conectado")
    } catch{
        console.log(error);
    }
}
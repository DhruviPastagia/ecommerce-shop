const app=require("./app");
const dotenv = require("dotenv");
const connectDatabase=require("./db/Database.js")
const cloudinary = require("cloudinary");


process.on("uncaughtException",(err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server for Handling uncaught Exception`);
})

dotenv.config({
    path:"backend/config/.env",
})

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is working on port: ${process.env.PORT}`);
})


process.on("unhandledRejection", (err) =>{
    console.log(`Shutting down server for ${err.message}`);
    console.log(`Shutting down the server due to Unhandled promise rejection`);
    server.close(() =>{
        process.exit(1);
    });
});
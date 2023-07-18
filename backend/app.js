const express = require("express");
const app = express();
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const ErrorHandler = require("./middleware/error")
const dotenv = require("dotenv");
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(fileUpload());

dotenv.config({
    path:"backend/config/.env",
})

const product= require("./routes/ProductRoutes")
const user= require("./routes/UserRoutes")
const order=require("./routes/OrderRoutes")
const payment = require("./routes/PaymentRoutes");
app.use("/api/v2",product);
app.use("/api/v2",user);
app.use("/api/v2",order);
app.use("/api/v2",payment);

app.use(ErrorHandler);

module.exports=app
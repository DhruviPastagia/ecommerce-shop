const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");



exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next) =>{
    const { token } = req.cookies;
    console.log(token);

  if (!token) {
    return next(new ErrorHandler("Please Login for access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedData._id);

  next();
});

//Admin Roles
exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
          return next(new ErrorHandler(`Role:${req.user.role} can not access this resources`));
        };
        next();
    }
}
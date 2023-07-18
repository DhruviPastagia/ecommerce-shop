const Product= require("../models/ProductModel.js")
const ErrorHandler = require("../utils/ErrorHandler.js")
const catchAsyncError = require("../middleware/catchAsyncError.js");
const features = require("../utils/features.js")
const cloudinary = require("cloudinary");

//create product 

exports.createProduct=catchAsyncError(async(req,res,next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
});




exports.getALLProducts =catchAsyncError(async(req,res)=>{
    const resultPerPage = 8;

    const productsCount = await Product.countDocuments();
    const feature = new features(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const allProducts =await feature.query;
    res.status(200).json({
        success:true,
        allProducts,
        productsCount,
        resultPerPage,
    })
})

exports.updateProduct = catchAsyncError(async(req, res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product)
    {
        return next(new ErrorHandler("Product is not found with this id",404));
       
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = imagesLinks;
    }

    product= await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useUnified:false
    });
    res.status(200).json({
        success:true,
        product
    })
})
exports.deleteProduct = catchAsyncError(async(req,res,next) =>{

    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product is not found with this id",404));
    }

    for (let i = 0; 1 < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully",
        product
    })
})

exports.getSingleProduct =catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product is not found with this id",404));
    }

    res.status(200).json({
        success:true,
        product       
    })

})

exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });

  exports.getSingleProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHandler("Product is not found with this id", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });

  // Delete Review --Admin
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found with this id", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });
  
  exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });
  
  
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter a name of product  "],
        trim:true,
        maxlength:[25,"Product name can not be more than 25 characters."]
    },
    description:{
        type:String,
        required:[true,"Please enter description of your product "],
        maxlength:[5000,"Description can not be more than 5000 characters."]
    },
    price:{
        type:Number,
        required:[true,"Please enter price of your product "],
        maxlengtg:[8,"Price can not be more than 8 numbers" ]
    },
    offerPrice:{
        type:String,
        maxlength:[3,"Discount price can not be more than 3 characters "],

    },
    color:{
        type:String,
    },
    size:{
        type:String,
    },
    ratings:{
       type:Number, 
       default:0,
    },
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter a category of your product"],


    },
    Stock:{
        type:Number,
        required:[true,"Please enter a stock for your product"],
        maxlength:[3,"Stock can not be more than 3 characters"],

    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
          user: {
             type: mongoose.Schema.ObjectId,
             ref:"User",
            // required:true,
        
          },
          name:{
            type:String,
            //required:true,

          },
          rating:{
            type:Number,
            //required:true,
          },
          comment:{
            type:String,
          },
          time:{
            type:Date,
            default:Date.now()
          },
        },
    ],

    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
       
    },
    createAt:{
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model("Product",productSchema);
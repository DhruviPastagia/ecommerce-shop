const sendToken = (user,statusCode,res) =>{

    const token = user.getJwtToken();
    console.log(token);

    // Options for cookies
    // const options = {
    //     expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    //     httpOnly: true
    // };
   res.cookie("token",token,{
    expires:new Date(Date.now()+50000),
    httpOnly:true,
   });
   
   res.status(statusCode).cookie("token",token).json({
       success: true,
       user,
       token
   });

   console.log(token);
}

module.exports = sendToken;
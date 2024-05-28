const User = require('../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('./../Utils/CustomError')
const util = require('util')

const signToken = (id)=>{
    return jwt.sign({id:id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
     })
}
exports.signup = asyncErrorHandler(async(req,res,next)=>{
     const newUser = await User.create(req.body);
     
     // here id being used as payload. Header automatically generated.
     // Signature = header + payload + secret str
     // JWT = header + payload + signature
     const token = signToken(newUser._id)

     res.status(201).json({
        status:"success",
        token,
        data:{
            user:newUser
        }
    })
})

exports.login = asyncErrorHandler(async(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    //const {email,password} = req.body;

    if(!email || !password){
        const err = new CustomError('Plz provide emailid and password for login',400)
        return next(err);
    }

    // Check if user exists with email
    const user = await User.findOne({email:email}).select('+password');
    //const isMatch = await user.comparePasswordIndb(password, user.password);
    if(!user || !(await user.comparePasswordIndb(password, user.password))){
        const err = new CustomError('Incorrect email or password',400)
        return next(err);
    }

    const token = signToken(user._id)
    res.status(200).json({
        status:"success",
        token    
    })
})

exports.protect = asyncErrorHandler(async(req,res,next)=>{
    // 1. check the token if token exist
    const testToken = req.headers.authorization;
    let token;
    if(testToken && testToken.startsWith('Bearer')){
        token = testToken.split(' ')[1]
    }
    if(!testToken){
        next(new CustomError("You are not logged in",401))
    }
     console.log("Token: " , token);
    // 2. Verfify the token
    //const decodedToken =  await util.promisify(jwt.verify(token, process.env.SECRET_STR))
    const decodedToken = jwt.verify(token, process.env.SECRET_STR);
    // 3. If the user exist in db or not
    const user =  await User.findById(decodedToken.id);
    if(!user){
        next(new CustomError("User with given token does not exist",401))
    }
    // 4. If the user changed password after token issued
    if(await user.isPasswordChanged(decodedToken.iat)){
        next(new CustomError("Password has been changed recently.Plz login again",401))
    }
    // 5. Allow user to access the route
    req.user = user;
    next()
})
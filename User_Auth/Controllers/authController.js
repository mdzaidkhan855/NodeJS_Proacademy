const User = require('../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('./../Utils/CustomError')
const util = require('util')
const sendEmail = require('./../Utils/email')
const crypto = require('crypto')


const signToken = (id)=>{
    return jwt.sign({id:id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
     })
}

const createSendResponse = (user, statusCode, res)=>{
    const token = signToken(user._id)
    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user
        }    
    })
}

exports.signup = asyncErrorHandler(async(req,res,next)=>{
     const newUser = await User.create(req.body);
     
     // here id being used as payload. Header automatically generated.
     // Signature = header + payload + secret str
     // JWT = header + payload + signature

    //  const token = signToken(newUser._id)

    //  res.status(201).json({
    //     status:"success",
    //     token,
    //     data:{
    //         user:newUser
    //     }
    // })

    createSendResponse(newUser,201,res)
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

    // const token = signToken(user._id)
    // res.status(200).json({
    //     status:"success",
    //     token    
    // })
    createSendResponse(user,200,res)
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
        return next(new CustomError("Password has been changed recently.Plz login again",401))
    }
    // 5. Allow user to access the route
    req.user = user;
    next()
})

// exports.restrict = (role)=>{
//     return (req,res,next)=>{
//         if(req.user.role !== role){
//             next(new CustomError("You donot have permission to perform this action",403))
//         }
//         next();
//     }
// }

// This implementation is for any number of roles
exports.restrict = (...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            next(new CustomError("You donot have permission to perform this action",403))
        }
        next();
    }
}

exports.forgotPassword = asyncErrorHandler(async(req,res,next)=>{
    // 1. get user based on posted email
    const user = await User.findOne({email:req.body.email})
    if(!user){
        next(new CustomError("Could not find user with this email:${req.body.email}",403))
    }
    // 2. Generate a randon token
    const resetToken = user.createResetPasswordToken();

    // update the user with encrypted token and its expiry
    // we are not having password here, so we need to disable
    // validation.
    await user.save({validateBeforeSave:false});
    // 3. Send the token back to user email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/vi/users/resetPassword/${resetToken}`
    const message= `Plz use below link to reset your password\n\n${resetUrl}\n\n`
    try {
        await sendEmail({
            email:user.email,
            subject:'Password changed request',
            message:message
        })
        res.status(200).json({
            status:'success',
            message:'password reset link sent to the user'
        })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        console.log(error);
        user.save({validateBeforeSave:false});
        return next(new CustomError("There was an error sending password reset email",500))
    }
    
})

exports.resetPassword = asyncErrorHandler(async (req,res,next)=>{

    // 1. Check if the user exists with given token and token not expired
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
                passwordResetToken:token,
                passwordResetTokenExpires:{$gt:Date.now()}
                });
    if(!user){
        next(new CustomError("Token was either invalid or expired",400))
    }

    // 2. Resetting the user password and patching the data
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    user.passwordChangedAt = Date.now();

    user.save();


    // 3. Creating a new token and sending to user for login
    // const newtoken = signToken(user._id)
    // res.status(200).json({
    //     status:"success",
    //     token:newtoken    
    // })
    createSendResponse(user,200,res)
})

exports.updatePassword = asyncErrorHandler(async (req,res,next)=>{
    // 1. get current user from db
        const user = await User.findById(req.user._id).select('+password')
    // 2. Supplied password is correct or not, as an extra security
          // if yes then update with new one
    if(!(await user.comparePasswordIndb(req.body.currentPassword,user.password))){
        return next(new CustomError('Current password provided is wrong', 401))
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // 3. Login and send token
    // const newtoken = signToken(user._id)
    // res.status(200).json({
    //     status:"success",
    //     token:newtoken,
    //     data:{
    //         user
    //     }    
    // })
    createSendResponse(user,200,res)
})
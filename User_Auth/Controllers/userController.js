const User = require('../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('./../Utils/CustomError')
const util = require('util')
const sendEmail = require('./../Utils/email')
const crypto = require('crypto')
const authController = require('./authController')

// 
exports.getAllUsers = asyncErrorHandler(async (req,res,next)=>{
    // There is pre find method defined in userModel which applies on 
    // all types of find queries which has active=true
    const users = await User.find();
    res.status(200).json({
        status:'success',
        count:users.length,
        data:{
            users
        }
    })
})
const signToken = (id)=>{
    return jwt.sign({id:id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
     })
}

const createSendResponse = (user, statusCode, res)=>{
    const token = signToken(user._id)

    const options = {
        maxAge:process.env.LOGIN_EXPIRES,
        //secure:true, // This will be used only in case of https(production)
        httpOnly:true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }
    res.cookie('jwt',token,options)
    
    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user
        }    
    })
}

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
const filterReqObj = (obj, ...allowedFields)=>{
    const newobj = {};
    Object.keys(obj).forEach((key)=>{
        if(allowedFields.includes(key)){
            newobj[key] = obj[key]
        }
    })
    return newobj;
}
// This is used by user himself to update his details
// This is used only to update other details, not password
// For password we have updatePassword above.
exports.updateMe = asyncErrorHandler(async (req,res,next)=>{
    if(req.body.password || req.body.confirmPassword){
        return next(new CustomError('Can not update password using this endpoint', 400)) 
    }
    // Update user details: Only name and email to be updated(exclude Role,password)
    const filterObj = filterReqObj(req.body,'name','email')
    const updatedUser = await User.findByIdAndUpdate(req.user.id,
                                    filterObj,
                                    {runValidators:true,new:true}
                                )
    //createSendResponse(updatedUser,200,res)
    res.status(200).json({
        status:'success',
        data:{
            user:updatedUser
        }
    })
})

exports.deleteMe = asyncErrorHandler(async (req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.user.id,{active:false})
    res.status(204).json({
        status:'success',
        data:null
    })
})
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required field']
    },
    email:{
        type:String,
        required:[true,'Email is required field'],
        unique:true,
        // This is not validator. It will just transform into lowercase before persisting into DB
        lowercase:true,
        validate:[validator.isEmail,'Please enter a valid email.']
    },
    photo:String,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Password is required field'],
        minlength:8,
        // Donot respond password when find all users somewhere in app.
        // unless we explicitly requires as in authController login
        // like : await User.findOne({email:email}).select('+password');
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'Confirm Password is required field'],

        // Custom Validator: It works only for save and create
        validate:{
            validator:function(val){
                return val == this.password;
            },
            message:"Password and Confirm Password does not match"
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetTokenExpires:Date
        
})

// we want to encrypt data only when password newly created
// or modified. In case of update other field, we will not do anything
// like updating email or name 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    // else encrypt using bcryptjs, also called hashing
    this.password = await bcrypt.hash(this.password,12);

    // We are using confirmPassword just for comparison purpose
    // So we make it undefined
    this.confirmPassword = undefined
    next();
})

userSchema.methods.comparePasswordIndb = async function(pswd,pswddb){
    return await bcrypt.compare(pswd,pswddb)
}

userSchema.methods.isPasswordChanged = async function(JWTtimestamp){
    if(this.passwordChangedAt){
        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTtimestamp < passwordChangedTimestamp
    }
    return false;
}

userSchema.methods.createResetPasswordToken = function(){
    // This is plane token, not encrypted one
    const resetToken = crypto.randomBytes(32).toString('hex')

    // persisting encrypted reset token in db
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    
    // expiry token time is 10 minutes(10*60*1000) in millisecinds
    // And persisting in db
    this.passwordResetTokenExpires = Date.now() + 10*60*1000;

    // Note: returning plain, not encrypted one
    return resetToken;
}

const User = mongoose.model('User',userSchema)

module.exports = User;
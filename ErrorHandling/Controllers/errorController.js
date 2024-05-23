const CustomError = require('./../Utils/CustomError')

const devErrors = (res,error)=>{
    res.status(error.statusCode).json({
        status:error.statusCode,
        message:error.message,
        stackTrace:error.stackTrace,
        error:error
    })
}
const castErrorHandler = (err)=>{
    const msg = `Invalid Value:${err.value} for field ${err.path}`;
    return new CustomError(msg,400);
}
const duplicateKeyErrorHandler = (err)=>{
    const msg = `There is already movie with name: ${err.keyValue.name}`;
    return new CustomError(msg,400);
}
const validationErrorHandler = (err)=>{
    const errors = Object.values(err.errors).map((val)=> val.message);
    const errorMessages = errors.join('. ');
    const msg = `Invalid Input Data: ${errorMessages}`;
    return new CustomError(msg,400);
}
validationErrorHandler
const prodErrors = (res,error)=>{
    if(error.isOperational){
        res.status(error.statusCode).json({
            status:error.statusCode,
            message:error.message
        })
    }else{
        res.status(500).json({
            status:'error',
            message:'Something went wrong.Please try later'
        })
    }
    
}

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        devErrors(res,error)
    }
    if(process.env.NODE_ENV === 'production'){
        if(error.name === 'CastError') error = castErrorHandler(error)            
        if(error.code === 11000) error = duplicateKeyErrorHandler(error)
        if(error.name === 'ValidationError') error = validationErrorHandler(error)


        prodErrors(res,error)
        
    }
}

class CustomError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        // Client error: status code is from 400 to 499, Server error: status code is from 500 to 599
        // If client error, status should be 'fail', if Server error, status should be 'error'
        this.status = statusCode >= 400 && statusCode <= 499 ? 'fail' : 'error';

        // We are going to create this CustomError class for operational error, which we can predict
        // we will check using this so that we can send error msg to client ONLY if error is operational 
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;
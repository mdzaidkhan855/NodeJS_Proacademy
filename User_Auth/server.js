const mongoose = require('mongoose')
const dotenv = require('dotenv')

// This config MUST come before we require app
dotenv.config({path:"config.env"})

// To create uncaughtException for example, console.log(x) and x is not defined anywhere.
// Also it should be before the code const app = require('./app'). so that if uncaught exception
// somewhere in app, it will be caught
process.on('uncaughtException', (err)=>{
    console.log("Uncaught exception. shutting down....");
    // In Uncaught exception, server need NOT be closed. so commented, unlike unhandledRejection.
    //server.close(()=>{
        process.exit(1);
    //});
    
})

const app = require('./app')

// Comment catch block as unhandledRejection event handled process.on('unhandledRejection', (err)=>{....
mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
}).then((conn)=>{
    //console.log(conn);
    console.log("DB Connection Successful");
})//.catch((error)=>{
   // console.log(error);
//})


// Create server and listen
const port = process.env.PORT || 3000
const server = app.listen(port,()=>{
    console.log("Server started");
})

// To create unhandledRejection for example, change the db connection string and test it.
process.on('unhandledRejection', (err)=>{
    console.log("Unhandled rejection occured. shutting down....");
    server.close(()=>{
        process.exit(1);
    });
    
})



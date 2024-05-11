const mongoose = require('mongoose')
const dotenv = require('dotenv')

// This config MUST come before we require app
dotenv.config({path:"config.env"})

const app = require('./app')

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
}).then((conn)=>{
    //console.log(conn);
    console.log("DB Connection Successful");
}).catch((error)=>{
    console.log(error);
})




// Create server and listen
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log("Server started");
})
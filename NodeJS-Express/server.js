const dotenv = require('dotenv')

// This config MUST come before we require app
dotenv.config({path:"config.env"})

const app = require('./app')

// Create server and listen
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log("Server started");
})
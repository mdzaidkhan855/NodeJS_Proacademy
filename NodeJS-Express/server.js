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

const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is required filed'],
        unique:true
    },
    description:String,
    duration:{
        type:Number,
        required:[true, 'Duration is required field']
    },
    ratings:{
        type:Number,
        default:1.0
    }
})
const Movie = mongoose.model('Movie',movieSchema)

const testMovie = new Movie({
    name:"Intersteller",
    description:"Thriller movie",
    duration:180
})
testMovie.save().then((doc)=>{
    console.log(doc); 
}).catch(err=>{
    console.log(err)
});
// Create server and listen
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log("Server started");
})
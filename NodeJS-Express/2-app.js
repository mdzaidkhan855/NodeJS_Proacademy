const express = require('express');
const fs = require('fs')
const morgan = require('morgan')
let app = express();

const logger = function(req,res,next){
    console.log("Custom middleware called");
    next();
}

//To use middleware in express, the middleware here is express.json()
// now we use that middleware in express : app.use(express.json())
// This middleware add request body to req object,which is used for post method
app.use(express.json())

// Use morgan middleware
app.use(morgan('dev'))

// This middleware logs
app.use(logger)

// Another middleware: Let's add a property to request object
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})

let moviesJson = fs.readFileSync('./data/movies.json');
// convert into Javascript object
let movies = JSON.parse(moviesJson);

const getAllMovies = (req,res)=>{
    // We format movies response using JSend JSON format.
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt,
        count:movies.length,
        data:{movies:movies}
    })
}

// Approach-1 : using app
// app.route('/api/vi/movies')
//         .get(getAllMovies)

// Approach-2 : mounting routes in express. moviesRouter is middleware
const moviesRouter = express.Router();
moviesRouter.route('/')
        .get(getAllMovies)
// use moviesRouter for a given path 
app.use('/api/vi/movies',moviesRouter)        


// Create server and listen
const port = '5000'
app.listen(port,()=>{
    console.log("Server started");
})
const express = require('express');
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRoutes');
const userRouter = require('./Routes/userRoutes')
const morgan = require('morgan');
const CustomErroor = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController');

// Security packages
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')


let app = express();

app.use(helmet())

// Rate Limit code: starts. 
// All APIs which starts with "api" will have ratelimit 
let limiter = rateLimit({
    max:3,
    windowMs:60*60*1000,
    message:'We have received too many request.Plz try after one hour'
})
app.use('/api',limiter)
// Rate Limit code: ends

//let moviesJson = fs.readFileSync('./data/movies.json');
// convert into Javascript object
//let movies = JSON.parse(moviesJson);

// Refactoring all route handler: starts
// const getAllMovies = (req,res)=>{
//     // We format movies response using JSend JSON format.
//     res.status(200).json({
//         status:"success",
//         count:movies.length,
//         data:{movies:movies}
//     })
// }
// const getMovie = (req,res)=>{
//     // Getting id and converting string into number
//     const id = +req.params.id;
//     let movieById = movies.find((movie)=>movie.id  === id)
//     if(movieById){
//         res.status(200).json({
//             status:"success",
//             data:{movie:movieById}
//         })  
//     }
//     else{
//         res.status(404).json({
//             status:"fail",
//             message:"No movie found with id: " + id
//         }) 
//     }      
// }
// const createMovie = (req,res)=>{

//     const newId = movies[movies.length -1].id + 1;
//     //const newMovie = Object.assign({id:newId},req.body)
//     // One can use separator operator on object also as below
//      const newMovie = {id:newId, ...req.body}
//     movies.push(newMovie);
    
//     fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
//         res.status(201).json({
//             status:"success",
//             data:{movie:newMovie}
//         })
//     })
    
// }
// const updateMovie = (req,res)=>{
//     let id = +req.params.id;
//     let movieToUpdate = movies.find((movie)=>movie.id  === id)

//     if(! movieToUpdate){
//         return res.status(404).json({
//             status:"fail",
//             data:"No movie found with id: " + id
//         })
//     }

//     let index = movies.indexOf(movieToUpdate);
//     Object.assign(movieToUpdate,req.body)
//     movies[index] = movieToUpdate;

//     fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
//         res.status(200).json({
//             status:"success",
//             data:{movie:movieToUpdate}
//         })
//     })    
// }
// const deleteMovie = (req,res)=>{
//     let id = +req.params.id;

//     let movieToDelete = movies.find((movie)=>movie.id  === id)

//     if(!movieToDelete){
//         return res.status(404).json({
//             status:"fail",
//             data:"No movie found with id: " + id + " to delete"
//         })
//     }
//     let index = movies.indexOf(movieToDelete);

//     movies.splice(index, 1);

//     fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
//         res.status(204).json({
//             status:"success",
//             data:{movie:null}
//         })
//     })
// }
// Refactoring all route handler: ends

//To use middleware in express, the middleware here is express.json()
// now we use that middleware in express : app.use(express.json())
// This middleware add request body to req object,which is used for post method

//app.use(express.json())
app.use(express.json({limit:'10kb'}))// For Denial of service(DoS), use limit of data like 10kb

// Mongo santize: it will prevent nosql query
app.use(sanitize())

// xss clean: will clean any html input from malicious code
app.use(xss())
// Http parameter pollution to be prevented
app.use(hpp({whitelist:['duration','ratings','releaseYear','releaseDate','genres']}))

if(process.env.NODE_ENV === 'development')
app.use(morgan('dev'))

// This middleware is used for static files like publi/templated/demo.html
app.use(express.static('./public'))


// Approach -1 
// List of end points. Can comment when used with chaining
// app.get('/api/vi/movies',getAllMovies)
// app.get('/api/vi/movies/:id',getMovie)
// app.post('/api/vi/movies',createMovie)
// app.patch('/api/vi/movies/:id',updateMovie)
// app.delete('/api/vi/movies/:id',deleteMovie)

// Chaining: Refactoring above APIs using the route chaining.
// Approach -2 : using app directly
// app.route('/api/vi/movies')
//         .get(getAllMovies)
//         .post(createMovie)
// app.route('/api/vi/movies/:id')
//         .get(getMovie)
//         .patch(updateMovie)
//         .delete(deleteMovie)

// Approach -3 : using Router as middleware
// const moviesRouter = express.Router();
// moviesRouter.route('/')
//         .get(getAllMovies)
//         .post(createMovie)
// moviesRouter.route('/:id')
//         .get(getMovie)
//         .patch(updateMovie)
//         .delete(deleteMovie)
// app.use('/api/vi/movies',moviesRouter)

// Approach -4 , Creating a separate router: moviesRoutes.js
app.use('/api/vi/movies',moviesRouter)
app.use('/api/vi/auth',authRouter)
app.use('/api/vi/user',userRouter)

// All other routes for which there is no pattern
app.all('*', (req,res,next)=>{
    // res.status(404).json({
    //     status:"fail",
    //     message:`Can't find ${req.originalUrl} on the server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on the server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    const err = new CustomErroor(`Can't find ${req.originalUrl} on the server`,404)
    // Whenever passed any argument to next function, express understands it some error
    next(err);
})

// Global error handling middleware
app.use(globalErrorHandler)

// Create server and listen
// const port = '5000'
// app.listen(port,()=>{
//     console.log("Server started");
// })

module.exports = app;
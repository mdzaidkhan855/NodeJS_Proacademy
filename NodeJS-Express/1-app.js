
const express = require('express');
const fs = require('fs')
let app = express();


let moviesJson = fs.readFileSync('./data/movies.json');
// convert into Javascript object
let movies = JSON.parse(moviesJson);

// Refactoring all route handler: starts
const getAllMovies = (req,res)=>{
    // We format movies response using JSend JSON format.
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{movies:movies}
    })
}
const getMovie = (req,res)=>{
    // Getting id and converting string into number
    const id = +req.params.id;
    let movieById = movies.find((movie)=>movie.id  === id)
    if(movieById){
        res.status(200).json({
            status:"success",
            data:{movie:movieById}
        })  
    }
    else{
        res.status(404).json({
            status:"fail",
            message:"No movie found with id: " + id
        }) 
    }      
}
const createMovie = (req,res)=>{

    const newId = movies[movies.length -1].id + 1;
    //const newMovie = Object.assign({id:newId},req.body)
    // One can use separator operator on object also as below
     const newMovie = {id:newId, ...req.body}
    movies.push(newMovie);
    
    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(201).json({
            status:"success",
            data:{movie:newMovie}
        })
    })
    
}
const updateMovie = (req,res)=>{
    let id = +req.params.id;
    let movieToUpdate = movies.find((movie)=>movie.id  === id)

    if(! movieToUpdate){
        return res.status(404).json({
            status:"fail",
            data:"No movie found with id: " + id
        })
    }

    let index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate,req.body)
    movies[index] = movieToUpdate;

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(200).json({
            status:"success",
            data:{movie:movieToUpdate}
        })
    })    
}
const deleteMovie = (req,res)=>{
    let id = +req.params.id;

    let movieToDelete = movies.find((movie)=>movie.id  === id)

    if(!movieToDelete){
        return res.status(404).json({
            status:"fail",
            data:"No movie found with id: " + id + " to delete"
        })
    }
    let index = movies.indexOf(movieToDelete);

    movies.splice(index, 1);

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(204).json({
            status:"success",
            data:{movie:null}
        })
    })
}
// Refactoring all route handler: ends

//To use middleware in express, the middleware here is express.json()
// now we use that middleware in express : app.use(express.json())
// This middleware add request body to req object,which is used for post method
app.use(express.json())

// List of end points. Can comment when used with chaining
// app.get('/api/vi/movies',getAllMovies)
// app.get('/api/vi/movies/:id',getMovie)
// app.post('/api/vi/movies',createMovie)
// app.patch('/api/vi/movies/:id',updateMovie)
// app.delete('/api/vi/movies/:id',deleteMovie)

// Chaining: Refactoring above APIs using the route chaining.
app.route('/api/vi/movies')
        .get(getAllMovies)
        .post(createMovie)
app.route('/api/vi/movies/:id')
        .get(getMovie)
        .patch(updateMovie)
        .delete(deleteMovie)

// Create server and listen
const port = '5000'
app.listen(port,()=>{
    console.log("Server started");
})
const fs = require('fs')

let moviesJson = fs.readFileSync('./data/movies.json');
// convert into Javascript object
let movies = JSON.parse(moviesJson);

exports.checkId = (req, res, next, value)=>{
    console.log("param id is :" + value);
    const id = +value;
    let movie = movies.find((movie)=>movie.id  === id)
    if(!movie){
        return res.status(404).json({
            status:"fail",
            message:"No movie found with id: " + id
        }) 
    }
    req.movie = movie;
    next();
}

exports.validateBody = (req,res,next)=>{
    if(!req.body.name || !req.body.releaseYear){
        return res.status(400).json({
            status:"fail",
            message:"Not a valid data"
        })
    }
    next();
}

exports.getAllMovies = (req,res)=>{
    // We format movies response using JSend JSON format.
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{movies:movies}
    })
}
exports.getMovie = (req,res)=>{

    // This block has been moved into checkId which is called from middleware
    // Getting id and converting string into number
    // const id = +req.params.id;
    // let movie = movies.find((movie)=>movie.id  === id)
    
    // if(!movie){
    //     return res.status(404).json({
    //         status:"fail",
    //         message:"No movie found with id: " + id
    //     }) 
    // }
    let movie = req.movie;  
    res.status(200).json({
        status:"success",
        data:{movie:movie}
    })     
}
exports.createMovie = (req,res)=>{

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
exports.updateMovie = (req,res)=>{

    // This block has been moved into checkId which is called from middleware
    // let id = +req.params.id;
    // let movieToUpdate = movies.find((movie)=>movie.id  === id)

    // if(! movieToUpdate){
    //     return res.status(404).json({
    //         status:"fail",
    //         data:"No movie found with id: " + id
    //     })
    // }

    let movieToUpdate = req.movie;
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
exports.deleteMovie = (req,res)=>{

    // This block has been moved into checkId which is called from middleware
    // let id = +req.params.id;
    // let movieToDelete = movies.find((movie)=>movie.id  === id)

    // if(!movieToDelete){
    //     return res.status(404).json({
    //         status:"fail",
    //         data:"No movie found with id: " + id + " to delete"
    //     })
    // }

    let movieToDelete = req.movie;
    let index = movies.indexOf(movieToDelete);

    movies.splice(index, 1);

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(204).json({
            status:"success",
            data:{movie:null}
        })
    })
}
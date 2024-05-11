const { Model } = require('mongoose');
const Movie = require('../Models/movieModel')


exports.getAllMovies = (req,res)=>{
    
}
exports.getMovie = (req,res)=>{

    
}
exports.createMovie = async (req,res)=>{

    // Approach-1
    //const testMovie = new Movie({});
    //testMovie.save();
    //Approach -2 
     try {
        const movie = await Movie.create(req.body);
        res.status(201).json({
            status:"success",
            data:{
                // Approach -1
                //movie:movie
                //Approach -2 in ES-6 as property and value same
                movie
            }
        })
     } catch(error) {
        res.status(400).json({
            status:"fail",
            message:error.message
        })
     }   
}
exports.updateMovie = (req,res)=>{

    
}
exports.deleteMovie = (req,res)=>{

   
}
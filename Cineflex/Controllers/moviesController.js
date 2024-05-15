const { Model } = require('mongoose');
const Movie = require('../Models/movieModel')

const excludeField = (requestedObj)=>{
    const excludeFields = ['sort','page','limit','fields'];
    const queryObj = {...requestedObj};
        excludeFields.forEach((field)=>{
            delete queryObj[field]
        })
    return queryObj
}
exports.getAllMovies = async(req,res)=>{
    try {
        // For mongoose < 6.0, you need to exclude the properties
        // otherwise, it works simply by passing req.query.
        /* const excludeFields = ['sort','page','limit','fields'];
        const queryObj = {...req.query};
        excludeFields.forEach((field)=>{
            delete queryObj[field]
        })
        const movies = await Movie.find(queryObj) */

        // Approach-1
        // Advanced Filter Query: .movies/?duration[gte]=110&ratings[gte]=7&price[lte]=50
        //const movies = await Movie.find(req.query)
        let queryStr = JSON.stringify(excludeField(req.query));
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
        const queryObj = JSON.parse(queryStr);
        //console.log("queryObj:", excludeField(queryObj));
        //const movies = await Movie.find(queryObj);

        // Sorting: Add to exsisting URL : &sort=price
        let query = Movie.find(queryObj)
        
        if(req.query.sort){
            query = query.sort(req.query.sort)
            console.log("Query:" + query);
        }        

        // Limiting Fields : Add to exsisting URL : ?sort=price&fields=name,duration,ratings,price
        // To exclude the fields, we need to put minus(-) sign before field
        //                    : ?sort=price&fields=-duration,-ratings,-price
        // Since __v is already excluded so we put this condition in else block
        // Also we CAN NOT add both include and exclude conditions together
        // We can also EXCLUDE using schema for sensitive fields or irrelevant to user 
        // like createdAt : Go to Movies model and declare: select:false
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            // if no fields in URL, exclude __v in the result
            query = query.select('-__v');
        }

        const movies = await query;

        //Approach-2: Problem here is that if we DONOT pass any of query params, it returns null
        // Advanced Filter Query: movies?duration=110&ratings=7&price=40
        // const movies = await Movie.find()
        //                 .where('duration')
        //                 .gte(req.query.duration)
        //                 .where('ratings')
        //                 .gte(req.query.ratings)
        //                 .where('price')
        //                 .lte(req.query.price);                
        res.status(200).json({
            status:"success",
            count:movies.length,
            data:{
                movies:movies
            }
        })
                       
    } catch (error) {
        res.status(400).json({
            status:"fail",
            message:error.message
        })
    }
}
exports.getMovie = async(req,res)=>{
    try {
        console.log(req.params);
        const id = req.params.id
        const movie = await Movie.find({_id:id})
        //const movie = await Movie.findById(id)
        res.status(200).json({
            status:"success",
            data:{
                movie
            }
        })
    } catch (error) {
        res.status(400).json({
            status:"fail",
            message:error.message
        })
    }
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
exports.updateMovie = async(req,res)=>{
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,
                                    req.body,
                                    {new:true,runValidators:true})
        res.status(201).json({
            status:"success",
            data:{
                movie:updatedMovie
            }
        })
    } catch (error) {
        res.status(400).json({
            status:"fail",
            message:error.message
        })
    }
    
}
exports.deleteMovie = async(req,res)=>{
    try {
        await Movie.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status:"success",
            data:null
        })
    } catch (error) {
        res.status(400).json({
            status:"fail",
            message:error.message
        })
    }
   
}
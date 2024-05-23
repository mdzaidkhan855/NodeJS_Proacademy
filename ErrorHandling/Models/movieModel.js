const mongoose = require('mongoose')
const fs = require('fs');
const validator = require('validator')


const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is required filed'],
        unique:true,
        maxlength:[100,'Movie name must not have more than 100 characters'],
        minlength:[4,'Movie name must have at least 4 characters'],
        trim:true,
        // The below from third party library validator
        //validate:[validator.isAlpha, 'Name should contain alphabets']
    },
    description:{
        type:String,
        required:[true, "The description is required field"],
        trim:true
    },
    duration:{
        type:Number,
        required:[true, 'Duration is required field']
    },
    ratings:{
        type:Number,
        // For Reefernce: Buit-in validator
        // min:[1,'Rating should be 1 or greater than 1'],
        // max:[10,'Rating should be 10 or less than 10']

        // Custom validator
        validate:{
            validator:function(value){
                return value >=1 && value <=10
            },
            message:"Rating {VALUE} should be above 1 and below 10"
        }
    },
    totalRating:{
        type:Number
    },
    releaseYear:{
        type:Number,
        required:[true, 'Release Year is required field']
    },
    releaseDate:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    genres:{
        type:[String],
        required:[true, "Generes is required field"],
        // Keep for reference
        // enum:{
        //     values:["Action","Sci-Fi","Thriller","Comedy","Crime","Adventure","Romance","Drama","Biography"],
        //     message:'The genres does not exist'
        // }
    },
    directors:{
        type:[String],
        required:[true, "Directors is required field"]
    },
    coverImage:{
        type:String,
        required:[true, "Cover Image is required field"]
    },
    actors:{
        type:[String],
        required:[true, "Actors is required field"]
    },
    price:{
        type:Number,
        required:[true, "Price is required field"]
    },
    createdBy:String
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
})

// Just like Express Middleware, we can have Mongodb document middleware as below
// The below method is called when we use save() or create() method.
// insertMany and findByIdAndUpdate DOEs NOT trigger save eevent
movieSchema.pre('save',function(next){
    // this keyword points to a document
    this.createdBy = 'Mursheed'
    next();
})
movieSchema.post('save',function(doc,next){
    const content = ` A new movie document with name ${doc.name} has been created by ${doc.createdBy}`
    fs.writeFileSync('./Log/log.txt',content, {flag:'a'},(error)=>{
        console.log(error.message);
    })
    next();
})

// Mongodb Query Middleware for find query
// movieSchema.pre('find', function(next){
//     // this keyword points to a query obj. Find all moview whose releaseDate is less than current date
//     this.find({releaseDate:{$lte:Date.now()}})
//     next();
// })
// The below middleware applies for all types of find query:find, findById, findByIdAndUpdate etc.
movieSchema.pre(/^find/, function(next){
    // this keyword points to a query obj. Find all moview whose releaseDate is less than current date
    this.find({releaseDate:{$lte:Date.now()}});
    this.startTime = Date.now();
    next();
})
movieSchema.post(/^find/, function(docs, next){
    // this keyword points to a query obj. Find all moview whose releaseDate is less than current date
    this.find({releaseDate:{$lte:Date.now()}})
    this.endTime = Date.now();

    console.log("The find query took :" + (this.endTime -this.startTime) + " milliseconds" );
    next();
})

// middleware on aggreation object: It will apply on 2 aggregate API of movieController: getMovieStats, getMoviesByGenre
movieSchema.pre('aggregate',function(next){
    // this keyword points to a aggregation object
    //this.pipeline().unshift({$match:{releaseDate:{$lte:new Date()}}})
    next();
})




const Movie = mongoose.model('Movie',movieSchema)

module.exports = Movie
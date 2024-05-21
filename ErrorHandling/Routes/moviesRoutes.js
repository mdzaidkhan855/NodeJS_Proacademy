const express = require('express')
const {getAllMovies,createMovie,getMovie,
        updateMovie,deleteMovie,
        getHighestRated, getMovieStats, getMoviesByGenre} = require('../Controllers/moviesController')

const router = express.Router();

// param middleware
//router.param('id',checkId)


// Aliasing routes
router.route('/highest-rated')
        .get(getHighestRated,getAllMovies)

// Route for aggregate
router.route('/movie-stats')
        .get(getMovieStats)
router.route('/movies-by-genre/:genre')
        .get(getMoviesByGenre)

        
router.route('/')
        .get(getAllMovies)
        .post(createMovie)
router.route('/:id')
        .get(getMovie)
        .patch(updateMovie)
        .delete(deleteMovie)


module.exports = router
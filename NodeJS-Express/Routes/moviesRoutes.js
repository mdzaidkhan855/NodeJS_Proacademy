const express = require('express')
const {getAllMovies,createMovie,getMovie,
        updateMovie,deleteMovie,checkId, validateBody} = require('../Controllers/moviesController')

const router = express.Router();

// param middleware
router.param('id',checkId)

router.route('/')
        .get(getAllMovies)
        .post(validateBody,createMovie)
router.route('/:id')
        .get(getMovie)
        .patch(updateMovie)
        .delete(deleteMovie)


module.exports = router
var express = require('express');
var router = express.Router();
const request = require('request');
const dotenv = require('dotenv');

const result = dotenv.config();
const apiKey = process.env.API_KEY;
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl
  next();
})


/* GET home page. */
router.get('/', function(req, res, next) {
  request.get(nowPlayingUrl, (error, response, movieData) => {
    // Obtenemos la informacion en movieData 
    const parseData = JSON.parse(movieData);
    console.log(parseData)
    res.render('index', {
      parseData: parseData.results
    });
  })
});

router.get('/movie/:id', (req, res, next) => {
    // res.json(req.params.id)
    const movieId = req.params.id;
    const thisMovieURL = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
    // res.send(thisMovieURL)
    request.get(thisMovieURL,(error, response, movieData) => {
      console.log(movieData)
      const parsedData = JSON.parse(movieData)
      console.log(parsedData)
      res.render('single-movie', {
        parsedData: parsedData
      })
    })
})

router.post('/search', (req, res, ext) => {
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}/?query=${userSearchTerm}&api_key=${apiKey}`;

  // res.send(movieUrl)

  request.get(movieUrl,(error, response, movieData) => {
    const parseData = JSON.parse(movieData);
    if(cat == 'person') {
      parseData.results = parseData.results[0].known_for
    } 
    res.render('index', {
      parseData: parseData.results
    })
  })

})

module.exports = router;

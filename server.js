'use strict';


const express = require('express');
require('dotenv').config();

const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT || 3002;

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description.toLowerCase()}`;
  }
}

class Movies {
  constructor(obj) {
    this.title = obj.title;
    this.overview = obj.overview;
    this.poster = obj.post_path;
  }
}

const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

app.get('/weather', async (request, response, next) => {

  try {

    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
    let weatherResults = await axios.get(url);

    let weatherData = weatherResults.data.data.map(day => new Forecast(day));

    response.status(200).send(weatherData);

  } catch (error) {
    next(error);
  }
});

app.get('/movies', async (request, response, next) => {
  try {
    let city = request.query.city_name;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}&language=en-US&page=1&include_adult=false`;

    let movieResults = await axios.get(url);
    let movieData = movieResults.data.results.map(movie => new Movies(movie));
    response.status(200).send(movieData);

  } catch(error) {
    next(error);
  }
});

app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.use('*', (error, request, response) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`We are up and running on port ${PORT}`));

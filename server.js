'use strict';


const express = require('express');
require('dotenv').config();
const data = require('./data/weather.json');

const cors = require('cors');

const PORT = process.env.PORT || 3002;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description.toLowerCase()}`;
  }
}

const app = express();
app.use(cors());

app.get('/weather', (request, response, next) => {

  try {
    let city = request.query.city;
    
    let weatherData = data.find(city => city.toLowerCase() === response.data.city_name.toLowerCase())
    response.status(200).send(weatherData);
  } catch (error) {
    next(error);
  }
});

app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.use('*', (error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`We are up and running on port ${PORT}`));

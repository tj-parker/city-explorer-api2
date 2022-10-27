'use strict';


const express = require('express');
require('dotenv').config();
const data = require('./data/weather.json');

const cors = require('cors');

const PORT = process.env.PORT || 3002;

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description.toLowerCase()}`;
  }
}

const app = express();
app.use(cors());

app.get('/weather', (request, response, next) => {
  let cityName = request.query.searchQuery;
  let lat = request.query.lat;
  let lon = request.query.lon;
  try {
    let cityData = data.find(city => city.city_name === cityName);
    let groomedData = cityData.data.map(day => new Forecast(day));
    response.status(200).send(groomedData);
  } catch (error) {
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

const express = require('express');
const app = express();
const http = require('http');
require('dotenv').config();

const LOCAL_URL = '127.0.0.1';
const LOCAL_PORT = 8080;
const APP_URL = '127.0.0.1';
const APP_PORT = 5500;

var wApi = [];
async function getWeather(weather_url) {

    let settings = { method: "GET", mode: "cors", timeout: "3000" };
    const response = await fetch(weather_url, settings);
    const weather = await response.json();
    wApi.push(weather);
}

app.use(express.json());

app.listen(
    LOCAL_PORT,
    () => console.log(`Backend alive on ${LOCAL_URL}:${LOCAL_PORT}`)
);

app.get('/wetter', async (req, res) => {

    wApi = [];
    /* Allow CORS from AngularJS SPA. */
    res.set('Access-Control-Allow-Origin', `http://${APP_URL}:${APP_PORT}`);
    var city = req.query.city;
    if(!city){
        res.status(400).send({message: 'Specify a city!'})
    }
    var days = req.query.days;
    if(!days){
	    res.status(400).send({message: 'Specify forecast length!'})
    }

    let url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPIKEY}&q=${city}&days=${days}&aqi=no`;
    await getWeather(url);

    res.status(200).send( wApi[0] );
});

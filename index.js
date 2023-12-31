const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
require('dotenv').config();


const LOCAL_PORT = process.env.PORT;
const APP_PORT = process.env.APP_PORT;
const APP_URL = process.env.APP_URL;

app.use(express.json());
app.use(cors({ origin: '*' }));

var wApi = [];
async function getWeather(weather_url) {

    let settings = { method: "GET", mode: "cors", timeout: "3000" };
    const response = await fetch(weather_url, settings);
    const weather = await response.json();
    wApi.push(weather);
}



app.get('/', (req,res) => {
    res.status(200).send(JSON.stringify({ status: 'OK' }));
});

app.get('/wetter', async (req, res) => {

    wApi = [];
    /* Allow CORS from AngularJS SPA. */
    //res.set('Access-Control-Allow-Origin', `http://${APP_URL}:${APP_PORT}`);
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

app.listen(
    LOCAL_PORT,
    () => console.log(`Backend alive on port ${LOCAL_PORT}`)
);
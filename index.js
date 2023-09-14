const express = require('express');
const app = express();
const PORT = 8080;
//const fetch = require('node-fetch');
const http = require('http');
require('dotenv').config();

var wApi = [];
async function getWeather(weather_url) {

    let settings = { method: "GET", mode: "cors", timeout: "3000" };
    const response = await fetch(weather_url, settings);
    const weather = await response.json();
    wApi.push(weather);
}

app.use(express.json());

app.listen(
    PORT,
    () => console.log(`it's alive on http://127.0.0.1:${PORT}`)
);

app.get('/tshirt', (req, res) => {

    res.status(200).send({
        tshirt: '🎽',
        size: 'large'
    })
});


app.get('/wetter', async (req, res) => {

    console.log('got a wetter request');
    wApi = [];
    /* Allow CORS from AngularJS SPA. */
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    var city = req.query.city;
    if(!city){
        res.status(400).send({message: 'Specify a city!'})
    }
    var days = req.query.days;
    if(!days){
	res.status(400).send({message: 'Specify forecast length!'})
    }
    console.log(`city: ${city}`);
    console.log(`days: ${days}`);

    let url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPIKEY}&q=${city}&days=${days}&aqi=no`;
    //let url = 'http://api.weather.gov';
    //wApi.push('{ "forecast-data": "default data" }');

    console.log(url);
    //http.get(url, (res) => {
    //    let body = '';

    //    res.on('data', (chunk) => {
    //        body += chunk;
    //    });

    //    res.on('end', () => {
    //        try {
    //            let json = JSON.parse(body);
    //            // Do stuff.
    //            console.log(json);
    //        } catch(error) {
    //            console.error('TRY error: ' + error.message);
    //        };
    //    });
    
    //}).on('error', (error) => {
    //    console.error('GET error: ' + error.message);
    //})

    //let settings = { method: "GET", timeout: "1000" };
    //fetch(url, settings)
    //    .then(res => res.json())
    //    .then((json) => {
    //        console.log(json);
    //    });

    await getWeather(url);
    console.log(wApi.length);

    console.log('Done. Sending response.');

    res.status(200).send( wApi[0] );
});

app.post('/tshirt/:id', (req, res) => {
    const {id} = req.params;
    const {logo} = req.body;

    if (!logo) {
        res.status(418).send({message: 'We need a logo!'})
    }

    res.send({
        tshirt: `🎽 with your ${logo.logo} and ID of ${id}. Also ${logo.blurb}`,
    })
});

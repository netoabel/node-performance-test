import express from 'express';
import fetch from 'node-fetch';

const app = express();
const SERVER_PORT = 3000;
const API_URI = 'http://localhost:3001';

app.listen(SERVER_PORT, () => {
    console.log('BFF server running.');
});

app.get('/', getSomeDataFromTheAPI);

async function getSomeDataFromTheAPI(req, res) {
    var startTimeInMs = Date.now();

    console.log('New incoming request. Getting data...');

    const firstThing = await request(`${API_URI}/slow-endpoint`);
    const secondThing = await request(`${API_URI}/slowest-endpoint`);
    const thirdThing = await request(`${API_URI}/slow-endpoint`);
    const fourthThing = await request(`${API_URI}/slow-endpoint`);
    const fifthThing = await request(`${API_URI}/slow-endpoint`);

    const timeElapsedInMs = Date.now() - startTimeInMs;

    const response = { timeElapsedInMs, firstThing, secondThing, thirdThing, fourthThing, fifthThing };

    res.send(response);

    console.log(`Response sent. (${timeElapsedInMs} ms)`);
}

async function request(url) {
    const data = await fetch(url);
    const jsonParsedData = await data.json();

    return jsonParsedData;
}
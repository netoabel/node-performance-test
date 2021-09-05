import express from 'express';
import fetch from 'node-fetch';

const app = express();
const SERVER_PORT = 3000;
const API_URL = 'http://localhost:3001/slow-endpoint';

const latencies = {
    slow: {
        min: process.env.SLOW_ENDPOINT_MIN_SECONDS || 0.3,
        max: process.env.SLOW_ENDPOINT_MAX_SECONDS || 3
    },
    slowest: {
        min: process.env.SLOWEST_ENDPOINT_MIN_SECONDS || 10,
        max: process.env.SLOWEST_ENDPOINT_MAX_SECONDS || 30
    }
};

app.listen(SERVER_PORT, () => {
    console.log('BFF server running.');
});

app.get('/', getSomeDataFromTheAPI);

async function getSomeDataFromTheAPI(req, res) {
    var startTimeInMs = Date.now();

    console.log('New incoming request. Getting data...');

    const firstThing = await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`);
    const secondThing = await request(`${API_URL}?min=${latencies.slowest.min}&max=${latencies.slowest.max}`);
    const thirdThing = await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`);
    const fourthThing = await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`);
    const fifthThing = await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`);

    const timeElapsedInMs = Date.now() - startTimeInMs;

    const response = { timeElapsedInMs, firstThing, secondThing, thirdThing, fourthThing, fifthThing };

    res.send(response);

    console.log(`Response sent. (${timeElapsedInMs / 1000} seconds)`);
}

async function request(url) {
    const data = await fetch(url);
    const jsonParsedData = await data.json();

    return jsonParsedData;
}
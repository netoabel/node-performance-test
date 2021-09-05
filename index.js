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

    const response = {
        slow1: await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`),
        slowest: await request(`${API_URL}?min=${latencies.slowest.min}&max=${latencies.slowest.max}`),
        slow2: await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`),
        slow3: await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`),
        slow4: await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`),
        slow5: await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`),
        slow6: await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`),
        slow7: await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`),
        slow8: await request(`${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`),
    }

    const timeElapsedInSeconds = (Date.now() - startTimeInMs) / 1000;

    res.send({ timeElapsedInSeconds, ...response });

    console.log(`Response sent. (${timeElapsedInSeconds / 1000} seconds)`);
}

async function request(url) {
    const data = await fetch(url);
    const jsonParsedData = await data.json();

    return jsonParsedData;
}
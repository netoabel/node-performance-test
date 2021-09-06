import express from 'express';
import fetch from 'node-fetch';

const app = express();
const SERVER_PORT = 3000;
const API_URL = 'http://localhost:3001/slow-endpoint';

const NUM_SLOW_REQUESTS = 8;
const NUM_SLOWEST_REQUESTS = 1;

const MEMORY_FILLER_SIZE_IN_BYTES = 400000;

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
    console.log('New incoming request. Getting data...');

    const memoryFiller = fillSomeMemory();

    var startTimeInMs = Date.now();

    const response = await aggregateDataSequentially();

    const timeElapsedInSeconds = (Date.now() - startTimeInMs) / 1000;

    res.send({ timeElapsedInSeconds, ...response });

    console.log(`Response sent. (${timeElapsedInSeconds} seconds)`);
}

function fillSomeMemory() {
    return new ArrayBuffer(MEMORY_FILLER_SIZE_IN_BYTES);
}

async function aggregateDataSequentially() {
    const slowEndpoint = `${API_URL}?min=${latencies.slow.min}&max=${latencies.slow.max}`;
    const slowestEndpoint = `${API_URL}?min=${latencies.slowest.min}&max=${latencies.slowest.max}`;

    const slowEndpointResults = await requestMultipleTimesSequentially(slowEndpoint, NUM_SLOW_REQUESTS);
    const slowestEndpointResults = await requestMultipleTimesSequentially(slowestEndpoint, NUM_SLOWEST_REQUESTS);

    return [...slowEndpointResults, ...slowestEndpointResults];
}

async function requestMultipleTimesSequentially(url, count) {
    const result = [];
    for (let i = 0; i < count; i++) {
        const response = await request(url);
        result.push(response);
    }
    return result;
}

async function request(url) {
    const data = await fetch(url);
    const jsonParsedData = await data.json();

    return jsonParsedData;
}
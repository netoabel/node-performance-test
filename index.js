import express from 'express';
import fetch from 'node-fetch';
import config from './config.js';

const app = express();

app.listen(config.serverPort, () => {
    console.log('BFF server running.');
});

app.get('/', getSomeDataFromTheAPI);

async function getSomeDataFromTheAPI(req, res) {
    console.log('New incoming request. Getting data...');

    const fakePayload = fillSomeMemory(config.fakePayloadSizeInKB);

    var startTimeInMs = Date.now();

    const response = await getDataSequentially();

    const timeElapsedInSeconds = (Date.now() - startTimeInMs) / 1000;

    res.send({ timeElapsedInSeconds, ...response, fakePayload });

    console.log(`Response sent. (${timeElapsedInSeconds} seconds)`);
}

function fillSomeMemory(sizeInKB) {
    return new ArrayBuffer(sizeInKB);
}

async function getDataSequentially() {
    const slowEndpoint = `${config.apiUrl}?min=${config.latencies.slow.min}&max=${config.latencies.slow.max}`;
    const slowestEndpoint = `${config.apiUrl}?min=${config.latencies.slowest.min}&max=${config.latencies.slowest.max}`;

    const slowEndpointResults = await requestMultipleTimesSequentially(slowEndpoint, config.slowRequestsCount);
    const slowestEndpointResults = await requestMultipleTimesSequentially(slowestEndpoint, config.slowestRequestsCount);

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
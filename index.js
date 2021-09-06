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

    const response = await getData();

    const timeElapsedInSeconds = (Date.now() - startTimeInMs) / 1000;

    res.send({ timeElapsedInSeconds, ...response, fakePayload });

    console.log(`Response sent. (${timeElapsedInSeconds} seconds)`);
}

function fillSomeMemory(sizeInKB) {
    return new ArrayBuffer(sizeInKB);
}

async function getData() {
    const endpoints = {
        slow: getEndpointUrl('slow'),
        slowest: getEndpointUrl('slowest')
    }

    return config.isSequential ? await getDataSequentially(endpoints) : await getDataInParallel(endpoints);
}

function getEndpointUrl(latency) {
    return `${config.apiUrl}?min=${config.latencies[latency].min}&max=${config.latencies[latency].max}`
}

async function getDataSequentially(endpoints) {
    const slowEndpointResults = await requestMultipleTimesSequentially(endpoints.slow, config.slowRequestsCount);
    const slowestEndpointResults = await requestMultipleTimesSequentially(endpoints.slowest, config.slowestRequestsCount);

    return [...slowEndpointResults, ...slowestEndpointResults];
}

async function getDataInParallel(endpoints) {
    const slowEndpointResults = requestMultipleTimesInParallel(endpoints.slow, config.slowRequestsCount);
    const slowestEndpointResults = requestMultipleTimesInParallel(endpoints.slowest, config.slowestRequestsCount);

    const result = await Promise.all([slowEndpointResults, slowestEndpointResults]);

    return result;
}

async function requestMultipleTimesSequentially(url, count) {
    const result = [];
    for (let i = 0; i < count; i++) {
        const response = await request(url);
        result.push(response);
    }
    return result;
}

async function requestMultipleTimesInParallel(url, count) {
    const requestPromises = [];
    for (let i = 0; i < count; i++) {
        requestPromises.push(request(url));
    }
    return Promise.all(requestPromises);
}

async function request(url) {
    const data = await fetch(url);
    const jsonParsedData = await data.json();

    return jsonParsedData;
}
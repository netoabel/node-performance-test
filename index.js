const express = require('express');
const axios = require('axios').default;
const config = require('./config.js');
const helper = require('./helper.js');

const app = express();
app.use(express.static('.clinic'));

app.listen(config.serverPort, () => {
    console.log('BFF server running.');
});

app.get('/', getSomeDataFromTheAPI);

async function getSomeDataFromTheAPI(req, res) {
    console.log('New incoming request. Getting data...');

    const fakePayload = fillSomeMemory(config.fakePayloadSizeInKB);

    const { result, timeElapsedInSeconds } = await helper.runAndGetTimeElapsed(getData);

    console.log(`Response sent (${timeElapsedInSeconds})`);

    res.json({ timeElapsedInSeconds, ...result, fakePayload });
}

function fillSomeMemory(sizeInKB) {
    let fakeString = "";
    const sizeInBytes = sizeInKB * 1000;

    for (let i = 0; i < sizeInBytes; i++) {
        fakeString += "a";
    }

    return fakeString;
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
    const response = await axios.get(url);

    return response.data;
}
const express = require('express');
const helper = require('./helper.js');
const Chance = require('chance');

const chance = new Chance();

const app = express();
const SERVER_PORT = 3001;

const DEFAULT_RESPONSE_TIME_MIN = 0.01;
const DEFAULT_RESPONSE_TIME_MAX = 0.5;

app.listen(SERVER_PORT, () => {
    console.log('API server running.');
});

app.get('/slow-endpoint', slowEndpoint);

async function slowEndpoint(req, res) {
    console.log('[/slow-endpoint] New incoming request.');

    const minTimeInSeconds = req.query?.min || DEFAULT_RESPONSE_TIME_MIN;
    const maxTimeInSeconds = req.query?.max || DEFAULT_RESPONSE_TIME_MAX;

    const { timeElapsedInSeconds } = await helper.runAndGetTimeElapsed(waitSomeSeconds, minTimeInSeconds, maxTimeInSeconds);

    res.json({ message: `It took ${timeElapsedInSeconds} seconds to load!` });
    console.log(`Response sent. (${timeElapsedInSeconds} seconds)`);
}

async function waitSomeSeconds(min, max) {
    console.log(`min: ${min} max: ${max}`);

    const timeInSeconds = getRandomNumberInRange(min, max);

    console.log(`Running some heavy stuff for ${timeInSeconds} seconds...`);

    await timeout(timeInSeconds * 1000);
}

function getRandomNumberInRange(min, max) {
    return chance.floating({ min, max });
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
import express from 'express';
import Chance from 'chance';

const chance = new Chance();

const app = express();
const SERVER_PORT = 3001;

app.listen(SERVER_PORT, () => {
    console.log('API server running.');
});

app.get('/slow-endpoint', slowEndpoint);

function slowEndpoint(req, res) {
    console.log('[/slow-endpoint] New incoming request.');

    const minTimeInSeconds = req.query?.min || 0.01;
    const maxTimeInSeconds = req.query?.max || 0.5;

    respondAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, res);
}

function respondAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, res) {
    doAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, (err, timeElapsedInSeconds) => {
        res.json({ message: `It took ${timeElapsedInSeconds} seconds to load!` });

        console.log(`Response sent. (${timeElapsedInSeconds} seconds)`);
    });
}

function doAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, callback) {
    var startTimeInMs = Date.now();

    waitSomeSeconds(minTimeInSeconds, maxTimeInSeconds, () => {
        const timeElapsedInSeconds = (Date.now() - startTimeInMs) / 1000;
        callback(null, timeElapsedInSeconds);
    });
}

function waitSomeSeconds(min, max, callback) {
    console.log(`min: ${min} max: ${max}`)
    const timeInSeconds = getRandomNumberInRange(min, max);

    console.log(`Running some heavy stuff for ${timeInSeconds} seconds...`);
    setTimeout(callback, timeInSeconds * 1000);
}

function getRandomNumberInRange(min, max) {
    return chance.floating({ min, max });
}
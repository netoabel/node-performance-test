import express from 'express';

const app = express();
const SERVER_PORT = 3001;

app.listen(SERVER_PORT, () => {
    console.log('API server running.');
});

app.get('/slow-endpoint', slowEndpoint);
app.get('/slowest-endpoint', slowestEndpoint);

function slowEndpoint(req, res) {
    console.log('[/slow-endpoint] New incoming request.');

    const minTimeInMs = process.env.SLOW_ENDPOINT_MIN_TIME_MS || 10;
    const maxTimeInMs = process.env.SLOW_ENDPOINT_MAX_TIME_MS || 3000;

    respondAfterSomeTime(minTimeInMs, maxTimeInMs, res);
}

function slowestEndpoint(req, res) {
    console.log('[/slowest-endpoint] New incoming request.');

    const minTimeInMs = process.env.SLOWEST_ENDPOINT_MIN_TIME_MS || 10000;
    const maxTimeInMs = process.env.SLOWEST_ENDPOINT_MAX_TIME_MS || 30000;

    respondAfterSomeTime(minTimeInMs, maxTimeInMs, res);
}

function respondAfterSomeTime(minTimeInMs, maxTimeInMs, res) {
    doAfterSomeTime(minTimeInMs, maxTimeInMs, (err, timeElapsedInMs) => {
        res.json({ message: `It took ${timeElapsedInMs} ms to load!` });

        console.log(`Response sent. (${timeElapsedInMs} ms)`);
    });
}

function doAfterSomeTime(minTimeInMs, maxTimeInMs, callback) {
    var startTimeInMs = Date.now();

    waitSomeSeconds(minTimeInMs, maxTimeInMs, () => {
        const timeElapsedInMs = Date.now() - startTimeInMs;
        callback(null, timeElapsedInMs);
    });
}

function waitSomeSeconds(min, max, callback) {
    const timeInMs = getRandomIntegerInRange(min, max);

    console.log(`Running some heavy stuff for ${timeInMs} ms...`);
    setTimeout(callback, timeInMs);
}

function getRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
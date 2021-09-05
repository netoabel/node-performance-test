import express from 'express';

const app = express();
const SERVER_PORT = 3001;

app.listen(SERVER_PORT, () => {
    console.log('API server running.');
});

app.get('/slow-endpoint', slowEndpoint);
app.get('/slowest-endpoint', slowestEndpoint);

function slowEndpoint(req, res){
    console.log('[/slow-endpoint] New incoming request.');

    const minTimeInSeconds = 1;
    const maxTimeInSeconds = 5;

    respondAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, res);
}

function slowestEndpoint(req, res){
    console.log('[/slowest-endpoint] New incoming request.');

    const minTimeInSeconds = 3;
    const maxTimeInSeconds = 30;

    respondAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, res);
}

function respondAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, res){
    doAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, (err, timeElapsedInMs) => {
        res.json({ message: `It took ${timeElapsedInMs} ms to load!` });
        
        console.log(`Response sent. (${timeElapsedInMs} ms)`);
    });
}

function doAfterSomeTime(minTimeInSeconds, maxTimeInSeconds, callback){
    var startTimeInMs = Date.now();

    waitSomeSeconds(minTimeInSeconds, maxTimeInSeconds, () => {
        const timeElapsedInMs = Date.now() - startTimeInMs;
        callback(null, timeElapsedInMs);
    });
}

function waitSomeSeconds(min, max, callback) {
    const seconds = getRandomIntegerInRange(min, max);
    const miliseconds = seconds * 1000;

    console.log(`Running some heavy stuff for ${seconds} seconds...`);
    setTimeout(callback, miliseconds);
}

function getRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
import express from 'express';
const app = express();
const SERVER_PORT = 3000;

const MIN_RESPONSE_TIME_IN_SECONDS = 3;
const MAX_RESPONSE_TIME_IN_SECONDS = 10;

app.get('/slow-endpoint', slowEndpoint);
app.get('/fast-endpoint', fastEndpoint);

app.listen(SERVER_PORT, () => {
    console.log('Server running.');
})

function fastEndpoint(req, res){
    console.log('[Fast Endpoint] New incoming request.');

    res.json({ hello: 'world' });
    console.log('[Fast Endpoint] Response sent.');
}

function slowEndpoint(req, res){
    console.log('[Slow Endpoint] New incoming request.');

    waitSomeSeconds(MIN_RESPONSE_TIME_IN_SECONDS, MAX_RESPONSE_TIME_IN_SECONDS, () => {
        res.json({ hello: 'world' });
        console.log('[Slow Endpoint] Response sent.');
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
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    serverPort: process.env.NODE_PORT,
    apiUrl: process.env.API_URL,
    isSequential: process.env.SEQUENTIAL_REQUESTS == 'true',
    slowRequestsCount: parseInt(process.env.SLOW_REQUESTS_COUNT),
    slowestRequestsCount: parseInt(process.env.SLOWEST_REQUESTS_COUNT),
    fakePayloadSizeInKB: parseInt(process.env.FAKE_PAYLOAD_SIZE_KB),
    latencies: {
        slow: {
            min: parseFloat(process.env.SLOW_ENDPOINT_MIN_SECONDS),
            max: parseFloat(process.env.SLOW_ENDPOINT_MAX_SECONDS)
        },
        slowest: {
            min: parseFloat(process.env.SLOWEST_ENDPOINT_MIN_SECONDS),
            max: parseFloat(process.env.SLOWEST_ENDPOINT_MAX_SECONDS)
        },
        apiDefaults: {
            min: parseFloat(process.env.API_DEFAULT_MIN_LATENCY_SECONDS),
            max: parseFloat(process.env.API_DEFAULT_MAX_LATENCY_SECONDS)
        }
    }
};
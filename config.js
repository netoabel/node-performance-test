import dotenv from 'dotenv';
dotenv.config();

const config = {
    serverPort: process.env.NODE_PORT,
    apiUrl: process.env.API_URL,
    isSequential: process.env.SEQUENTIAL_REQUESTS == 'true',
    slowRequestsCount: process.env.SLOW_REQUESTS_COUNT,
    slowestRequestsCount: process.env.SLOWEST_REQUESTS_COUNT,
    fakePayloadSizeInKB: process.env.FAKE_PAYLOAD_SIZE_KB,
    latencies: {
        slow: {
            min: process.env.SLOW_ENDPOINT_MIN_SECONDS,
            max: process.env.SLOW_ENDPOINT_MAX_SECONDS
        },
        slowest: {
            min: process.env.SLOWEST_ENDPOINT_MIN_SECONDS,
            max: process.env.SLOWEST_ENDPOINT_MAX_SECONDS
        }
    }
};

export default config;
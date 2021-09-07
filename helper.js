async function runAndGetTimeElapsed(callback, ...params) {
    var startTimeInMs = Date.now();
    const result = await callback(...params);
    const timeElapsedInSeconds = (Date.now() - startTimeInMs) / 1000;
    return {result, timeElapsedInSeconds};
}

module.exports = {
    runAndGetTimeElapsed
}
export function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

export function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

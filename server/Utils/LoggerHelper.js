class LoggerHelper {
    log(...params) {
        console.log(`${new Date()}`, params);
    }

    info(message, ...params) {
        console.error(`[INFO] ${new Date()}`, message, params);
    }
}

module.exports = LoggerHelper;

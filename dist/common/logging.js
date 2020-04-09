"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const config = require("config");
exports.logger = new winston.Logger();
const env = config.util.getEnv('NODE_ENV');
// Development Logger
if (env === 'development') {
    exports.logger.add(winston.transports.Console, {
        type: 'verbose',
        colorize: true,
        prettyPrint: true,
        handleExceptions: true,
        humanReadableUnhandledException: true
    });
}
process.on('unhandledRejection', function (reason, p) {
    exports.logger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
//# sourceMappingURL=logging.js.map
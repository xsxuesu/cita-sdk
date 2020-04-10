"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cita_sdk_1 = require("@cryptape/cita-sdk");
const config = require("config");
const logging_1 = require("../common/logging");
class Peer {
    constructor() {
        this.peer = cita_sdk_1.default(config.get('Peer.Url').toString());
        logging_1.logger.info("${config.get('Peer.Url').toString()} as connected!");
    }
}
exports.Peer = Peer;
//# sourceMappingURL=Peer.js.map
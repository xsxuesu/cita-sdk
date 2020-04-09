"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express_1 = require("./Express");
const logging_1 = require("../common/logging");
const config = require("config");
class Application {
    constructor() {
        this.express = new Express_1.ExpressConfig();
        const port = config.get('express.port');
        // const port = "8080";
        this.server = this.express.app.listen(port, () => {
            logging_1.logger.info(`
        ------------
        Server Started!
        Express: http://localhost:${port}
        Swagger Docs: http://localhost:${port}/docs
        Swagger Spec: http://localhost:${port}/api-docs
        ------------
      `);
        });
    }
}
exports.Application = Application;
//# sourceMappingURL=Application.js.map
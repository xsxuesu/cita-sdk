"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const yaml = require("js-yaml");
const cors = require("cors");
const config = require("config");
const logging_1 = require("../common/logging");
const routing_controllers_1 = require("routing-controllers");
const swaggerTools = require("swagger-tools");
class ExpressConfig {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.setupSwagger();
        this.setupControllers();
    }
    setupSwagger() {
        // resolve the spec
        const spath = path.resolve('swagger.yml');
        const file = fs.readFileSync(spath, 'utf8');
        const spec = yaml.safeLoad(file);
        // init jwt middleware
        const jwtSecret = config.get('auth.jwt_secret').toString();
        logging_1.logger.info(`jwtSecret`, jwtSecret);
        // const jwtSecret = "alslslslkdkdkkd";
        // let jwt = express_jwt({
        //  secret: new Buffer(jwtSecret, 'base64')
        // });
        // setup middleware swagger middleware in express
        swaggerTools.initializeMiddleware(spec, (middleware) => {
            this.app.use(middleware.swaggerMetadata());
            this.app.use(middleware.swaggerValidator({
                validateResponse: true
            }));
            /*
            this.app.use(middleware.swaggerSecurity({
              jwt_token: (req, authOrSecDef, scopes, cb) => {
                jwt(req, req.res, (err) => {
                  if (req.userName === undefined) {
                    return cb(new Error('Access Denied!'));
                  } else {
                    logger.info(`${req.userName} authorized`, req.userName);
                    return cb(null);
                  }
                });
              }
            }));
            */
            this.app.use(middleware.swaggerUi());
        });
    }
    setupControllers() {
        const controllersPath = path.resolve('dist', 'controllers');
        logging_1.logger.info(`controllersPath = ${controllersPath} `);
        routing_controllers_1.useExpressServer(this.app, {
            controllerDirs: [controllersPath + "/*{.js,.ts}"]
        });
    }
}
exports.ExpressConfig = ExpressConfig;
//# sourceMappingURL=Express.js.map
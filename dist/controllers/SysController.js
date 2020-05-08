"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const Peer = require("../config/Peer");
const config = require("config");
const logging_1 = require("../common/logging");
const path = require("path");
const fs = require("fs");
let SysController = class SysController {
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logging_1.logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    txContract(address) {
        return __awaiter(this, void 0, void 0, function* () {
            // logger.info(`contractname : ${contractname}`);
            const contractPath = path.join("./contract", "PermissionManagement.abi");
            // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
            const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
            logging_1.logger.info(`contractinfo : ${abiJson}`);
            const TxPermissionContract = "0xffffffffffffffffffffffffffffffffff020004";
            // const result = this.peer.base.personal.unlockAccount(from, password);
            const con = new this.peer.base.Contract(abiJson, TxPermissionContract);
            const privateKey = config.get('adminPrivateKey').toString();
            const from = config.get('adminAddress').toString();
            const metaData = yield this.peer.base.getMetaData();
            logging_1.logger.info(`metaData : ${JSON.stringify(metaData)}`);
            const blockNumber = yield this.peer.base.getBlockNumber();
            const transaction = {
                from: from,
                privateKey: privateKey,
                nonce: 999999,
                quota: 999999,
                version: metaData.version,
                validUntilBlock: blockNumber + 30,
                value: '0x0',
            };
            const receipt = yield con.methods.setAuthorizations(address, ["ffffffffffffffffffffffffffffffffff021000"]).send(transaction);
            return { "receipt": receipt };
        });
    }
    deployContract(address) {
        return __awaiter(this, void 0, void 0, function* () {
            // logger.info(`contractname : ${contractname}`);
            const contractPath = path.join("./contract", "PermissionManagement.abi");
            // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
            const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
            logging_1.logger.info(`contractinfo : ${abiJson}`);
            const TxPermissionContract = "0xffffffffffffffffffffffffffffffffff020004";
            // const result = this.peer.base.personal.unlockAccount(from, password);
            const con = new this.peer.base.Contract(abiJson, TxPermissionContract);
            const privateKey = config.get('adminPrivateKey').toString();
            const from = config.get('adminAddress').toString();
            const metaData = yield this.peer.base.getMetaData();
            logging_1.logger.info(`metaData : ${JSON.stringify(metaData)}`);
            const blockNumber = yield this.peer.base.getBlockNumber();
            const transaction = {
                from: from,
                privateKey: privateKey,
                nonce: 999999,
                quota: 999999,
                version: metaData.version,
                validUntilBlock: blockNumber + 30,
                value: '0x0',
            };
            const receipt = yield con.methods.setAuthorizations(address, ["ffffffffffffffffffffffffffffffffff021001"]).send(transaction);
            return { "receipt": receipt };
        });
    }
};
__decorate([
    routing_controllers_1.Post('/permissiontx'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "txContract", null);
__decorate([
    routing_controllers_1.Post('/permissioncontract'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "deployContract", null);
SysController = __decorate([
    routing_controllers_1.JsonController("/sys"),
    __metadata("design:paramtypes", [])
], SysController);
exports.SysController = SysController;
//# sourceMappingURL=SysController.js.map
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
const config = require("config");
const Peer = require("../config/Peer");
const logging_1 = require("../common/logging");
const path = require("path");
const fs = require("fs");
const web3 = require("web3");
let Users = class Users {
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logging_1.logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    getTransaction(abiName, addr) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractPath = path.join("./contract", abiName);
            const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
            logging_1.logger.info(`contractinfo : ${abiJson}`);
            const con = new this.peer.base.Contract(abiJson, addr);
            const privateKey = config.get('adminPrivateKey').toString();
            const from = config.get('adminAddress').toString();
            const metaData = yield this.peer.base.getMetaData();
            logging_1.logger.info(`metaData : ${JSON.stringify(metaData)}`);
            const blockNumber = yield this.peer.base.getBlockNumber();
            const transaction = {
                from: from,
                privateKey: privateKey,
                nonce: 999999,
                quota: 99999999,
                version: metaData.version,
                validUntilBlock: blockNumber + 30,
                value: '0x0',
            };
            return { "con": con, "tx": transaction };
        });
    }
    //0x12707fDE828feD188970a5Bb06f8F5B507A6f735
    //0xf809356dc8b9dd8f445906726ee30b898b4302854f219e4a5c053acc0b5eee23
    signMessage(address, message, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let singedMessage = yield this.peer.base.personal.sign(message, address, password);
            return { "singedMessage": singedMessage };
        });
    }
    createAddress(password) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.peer.base.accounts.create(password);
            logging_1.logger.info(`create address : ${JSON.stringify(result)}`);
            return { "address": result.address, "privateKey": result.privateKey };
        });
    }
    unlockAddress(address, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.peer.base.accounts.unlockAccount(address, password);
            logging_1.logger.info(`create address : ${JSON.stringify(result)}`);
            return { "result": result };
        });
    }
    //common/Admin.sol
    //0xffffffffffffffffffffffffffffffffff02000c
    adminContract(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractPath = path.join("./contract", "Admin.abi");
            const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
            logging_1.logger.info(`contractinfo : ${abiJson}`);
            const BatchContract = "0xffffffffffffffffffffffffffffffffff02000c";
            const con = new this.peer.base.Contract(abiJson, BatchContract);
            const receipt = yield con.methods.isAdmin(address).call();
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            return { "receipts": receipt };
        });
    }
    //update
    updateadminContract(from, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractPath = path.join("./contract", "Admin.abi");
            const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
            const BatchContract = "0xffffffffffffffffffffffffffffffffff02000c";
            const con = new this.peer.base.Contract(contractinfo, BatchContract);
            const blockNumber = yield this.peer.base.getBlockNumber();
            const metaData = yield this.peer.base.getMetaData();
            logging_1.logger.info(`metaData : ${JSON.stringify(metaData)}`);
            const privateKey = '0xf97a6a9cfeade639d798f005ad9d8a43241f5799cddad7bb331de89ae297dbe1';
            const transaction = {
                from: from,
                privateKey: privateKey,
                nonce: 999999,
                quota: 9999999,
                version: metaData.version,
                validUntilBlock: blockNumber + 30,
                value: '0x0',
            };
            const receipt = yield con.methods.update(address).send(transaction);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
        });
    }
    // 
    //update
    newGroupContract(_origin, _name, _accounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const conTx = this.getTransaction("GroupManagement.abi", "0xFFFffFFfffffFFfffFFffffFFFffFfFffF02000a");
            const con = (yield conTx).con;
            const transaction = (yield conTx).tx;
            const name_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_name));
            const receipt = yield con.methods.newGroup(_origin, name_bytes, _accounts).send(transaction);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
        });
    }
};
__decorate([
    routing_controllers_1.Post('/sign'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")), __param(1, routing_controllers_1.BodyParam("message")), __param(2, routing_controllers_1.BodyParam("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], Users.prototype, "signMessage", null);
__decorate([
    routing_controllers_1.Post('/create'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Users.prototype, "createAddress", null);
__decorate([
    routing_controllers_1.Post('/unlock'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")), __param(1, routing_controllers_1.BodyParam("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Users.prototype, "unlockAddress", null);
__decorate([
    routing_controllers_1.Post('/isadmin'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Users.prototype, "adminContract", null);
__decorate([
    routing_controllers_1.Post('/updateadmin'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("from")),
    __param(1, routing_controllers_1.BodyParam("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], Users.prototype, "updateadminContract", null);
__decorate([
    routing_controllers_1.Post('/newgroup'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("origin")),
    __param(1, routing_controllers_1.BodyParam("name")),
    __param(2, routing_controllers_1.BodyParam("accounts")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], Users.prototype, "newGroupContract", null);
Users = __decorate([
    routing_controllers_1.JsonController("/personal"),
    __metadata("design:paramtypes", [])
], Users);
exports.Users = Users;
//# sourceMappingURL=UserController.js.map
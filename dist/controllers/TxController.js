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
let TxController = class TxController {
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logging_1.logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    //0x12707fDE828feD188970a5Bb06f8F5B507A6f735
    //0xf809356dc8b9dd8f445906726ee30b898b4302854f219e4a5c053acc0b5eee23
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            logging_1.logger.info("get balance address:", address);
            let balance = yield this.peer.base.getBalance(address);
            return { "balance": balance };
        });
    }
    getTransactionCount(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            let txCount = yield this.peer.base.getTransactionCount(hash);
            return { "transactionCount": txCount };
        });
    }
    postSign(address, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let signMessage = yield this.peer.base.sign(message, address);
            return { "signedMessage": signMessage };
        });
    }
    send(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let sendMessage = yield this.peer.base.sendTransaction(transaction);
            return sendMessage;
        });
    }
    sendSignedTx(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            let sendMessage = yield this.peer.base.sendSignedTransaction(txhash);
            return sendMessage;
        });
    }
    getTxReceipt(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            let receipt = yield this.peer.base.getTransactionReceipt(txhash);
            return receipt;
        });
    }
    getTxProof(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            let receipt = yield this.peer.base.getTransactionProof(txhash);
            return receipt;
        });
    }
    getTx(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            let receipt = yield this.peer.base.getTransaction(txhash);
            return receipt;
        });
    }
};
__decorate([
    routing_controllers_1.Get('/getbalance/:address'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TxController.prototype, "getBalance", null);
__decorate([
    routing_controllers_1.Get('/gettxcount/:hash'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("hash")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TxController.prototype, "getTransactionCount", null);
__decorate([
    routing_controllers_1.Post('/sign'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")), __param(1, routing_controllers_1.BodyParam("message")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TxController.prototype, "postSign", null);
__decorate([
    routing_controllers_1.Post('/send'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("transaction")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TxController.prototype, "send", null);
__decorate([
    routing_controllers_1.Post('/sendtxhash'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("txhash")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TxController.prototype, "sendSignedTx", null);
__decorate([
    routing_controllers_1.Get('/getreceipt/:txhash'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("txhash")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TxController.prototype, "getTxReceipt", null);
__decorate([
    routing_controllers_1.Get('/getproof/:txhash'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("txhash")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TxController.prototype, "getTxProof", null);
__decorate([
    routing_controllers_1.Get('/gettx/:txhash'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("txhash")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TxController.prototype, "getTx", null);
TxController = __decorate([
    routing_controllers_1.JsonController("/tx"),
    __metadata("design:paramtypes", [])
], TxController);
exports.TxController = TxController;
//# sourceMappingURL=TxController.js.map
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
let ContractController = class ContractController {
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logging_1.logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    deployContract(contractname, from, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // logger.info(`contractname : ${contractname}`);
            const contractPath = path.join("./contract", contractname);
            // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
            const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
            // logger.info(`contractinfo : ${contractinfo}`);
            const abiJson = contractinfo.abi;
            const bytecode = contractinfo.bytecode;
            // const result = this.peer.base.personal.unlockAccount(from, password);
            const newContract = new this.peer.base.Contract(abiJson);
            const privateKey = '0xf97a6a9cfeade639d798f005ad9d8a43241f5799cddad7bb331de89ae297dbe1';
            const metaData = yield this.peer.base.getMetaData();
            logging_1.logger.info(`metaData : ${JSON.stringify(metaData)}`);
            const blockNumber = yield this.peer.base.getBlockNumber();
            //chainId: metaData.chainId,
            //
            const transaction = {
                from: from,
                privateKey: privateKey,
                nonce: 999999,
                quota: 999999,
                version: metaData.version,
                validUntilBlock: blockNumber + 70,
                value: '0x0',
            };
            const txRes = yield newContract.deploy({ data: bytecode, arguments: [], }).send(transaction);
            // const privateKey = '0xe45101cbb6f63219be644ec0592e199d0928c33d1fc3cbaf86db7153dcf0a2df'
            const receipt = yield this.peer.listeners.listenToTransactionReceipt(txRes.hash);
            // set contract address to contract instance
            newContract.options.address = receipt.contractAddress;
            return { "contractAddress": receipt.contractAddress };
        });
    }
    callContract(contractname, contract, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractPath = path.join("./contract", contractname);
            const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
            // logger.info(`contractinfo : ${contractinfo}`);
            const abiJson = contractinfo.abi;
            const con = new this.peer.base.Contract(abiJson, contract);
            const receipt = yield con.methods.get().call({ from: from });
            return { "receipt": receipt };
        });
    }
    sendContract(contractname, contract, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractPath = path.join("./contract", contractname);
            const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
            // logger.info(`contractinfo : ${contractinfo}`);
            const abiJson = contractinfo.abi;
            // contract.methods.myMethod(parameters).send(transaction)
            const con = new this.peer.base.Contract(abiJson, contract);
            const blockNumber = yield this.peer.base.getBlockNumber();
            const metaData = yield this.peer.base.getMetaData();
            logging_1.logger.info(`metaData : ${JSON.stringify(metaData)}`);
            const privateKey = '0xf97a6a9cfeade639d798f005ad9d8a43241f5799cddad7bb331de89ae297dbe1';
            const transaction = {
                from: from,
                privateKey: privateKey,
                nonce: 999999,
                quota: 999999,
                version: metaData.version,
                validUntilBlock: blockNumber + 30,
                value: '0x0',
            };
            const receipt = yield con.methods.set(blockNumber).send(transaction);
            return { "receipt": receipt };
        });
    }
};
__decorate([
    routing_controllers_1.Post('/deploy'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("contract")), __param(1, routing_controllers_1.BodyParam("from")), __param(2, routing_controllers_1.BodyParam("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "deployContract", null);
__decorate([
    routing_controllers_1.Post('/call'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("contractname")), __param(1, routing_controllers_1.BodyParam("contractadd")), __param(2, routing_controllers_1.BodyParam("from")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "callContract", null);
__decorate([
    routing_controllers_1.Post('/send'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("contractname")), __param(1, routing_controllers_1.BodyParam("contractadd")), __param(2, routing_controllers_1.BodyParam("from")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "sendContract", null);
ContractController = __decorate([
    routing_controllers_1.JsonController("/contract"),
    __metadata("design:paramtypes", [])
], ContractController);
exports.ContractController = ContractController;
//# sourceMappingURL=ContractController.js.map
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
let ContractController = class ContractController {
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logging_1.logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    deployContract(abi, code, from, chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const abiJson = JSON.parse(abi);
            const bytecode = code;
            const privateKey = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
            const transaction = {
                from: from,
                privateKey,
                nonce: 999999,
                quota: 1e10,
                chainId: chainId,
                version: 2,
                validUntilBlock: 999999,
                value: '0x0',
            };
            // create contract instance
            const newContract = new this.peer.base.Contract(abiJson);
            // deploy contract and get transaction result
            const txRes = yield newContract.deploy({ data: bytecode, arguments: [], }).send(transaction);
            // get transaction receipt by transaction hash
            //listeners.listenToTransactionReceipt(result.hash).then(console.log)
            const receipt = yield this.peer.listeners.listenToTransactionReceipt(txRes.hash);
            // set contract address to contract instance
            newContract.options.address = receipt.contractAddress;
            return { "contractAddress": receipt.contractAddress };
        });
    }
    callContract(abi, contract, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const abijson = JSON.parse(abi);
            const con = new this.peer.base.Contract(abijson, contract);
            // call method
            // get method is specified by contract through abi
            // contract.methods.myMethod(paramters).call(transaction)
            // get transaction receipt by transaction hash
            const receipt = yield con.methods.get().call({ from: from });
            return receipt;
        });
    }
    sendContract(abi, contract, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const abijson = JSON.parse(abi);
            const con = new this.peer.base.Contract(abijson, contract);
            // send method
            // set method is specified by contract through abi
            // contract.methods.myMethod(parameters).send(transaction)
            const receipt = yield con.methods.set().send({ from: from });
            return receipt;
        });
    }
};
__decorate([
    routing_controllers_1.Post('/deploy'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("abi")), __param(1, routing_controllers_1.Param("code")), __param(2, routing_controllers_1.Param("from")),
    __param(3, routing_controllers_1.Param("chainId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "deployContract", null);
__decorate([
    routing_controllers_1.Post('/call'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("abi")), __param(1, routing_controllers_1.Param("contract")), __param(2, routing_controllers_1.Param("from")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "callContract", null);
__decorate([
    routing_controllers_1.Post('/send'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("abi")), __param(1, routing_controllers_1.Param("contract")), __param(2, routing_controllers_1.Param("from")),
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
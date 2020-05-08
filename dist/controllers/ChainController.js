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
let ChainController = class ChainController {
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logging_1.logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    getPeerCount() {
        return __awaiter(this, void 0, void 0, function* () {
            let peerCount = yield this.peer.base.peerCount();
            logging_1.logger.info(`PEER COUNT : ${peerCount}`);
            return { "peerCount": peerCount };
        });
    }
    getMetaData() {
        return __awaiter(this, void 0, void 0, function* () {
            let metaData = yield this.peer.base.getMetaData();
            return { "metaData": metaData };
        });
    }
    getAbi(contract) {
        return __awaiter(this, void 0, void 0, function* () {
            logging_1.logger.info("get abi contract address:", contract);
            let abi = yield this.peer.base.getAbi(contract, 'latest');
            return { "abi": abi };
        });
    }
    getBlock(index) {
        return __awaiter(this, void 0, void 0, function* () {
            logging_1.logger.info("get block index:", index);
            let blockinfo = yield this.peer.base.getBlockByNumber(index);
            return { "blockinfo": blockinfo };
        });
    }
    getBlockByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            logging_1.logger.info("get block hash:", hash);
            let blockinfo = yield this.peer.base.getBlockByHash(hash);
            return { "blockinfo": blockinfo };
        });
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            let blockNumber = yield this.peer.base.getBlockNumber();
            return { "blockNumber": blockNumber };
        });
    }
    getLogs(abi, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            // const abi = [
            //     {
            //       indexed: false,
            //       name: '_sender',
            //       type: 'address',
            //     },
            //     {
            //       indexed: false,
            //       name: '_text',
            //       type: 'string',
            //     },
            //     {
            //       indexed: true,
            //       name: '_time',
            //       type: 'uint256',
            //     },
            //   ]
            //   const filter = {
            //     address: '0x35bD452c37d28becA42097cFD8ba671C8DD430a1',
            //     fromBlock: '0x0',
            //   }
            let logs = yield this.peer.base.getLogs(filter, abi);
            return logs;
        });
    }
    newMsgFilter(topics) {
        return __awaiter(this, void 0, void 0, function* () {
            // const topics = {
            //     topics: ['0x8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3'],
            //   }
            let fileterId = yield this.peer.base.newMessageFilter(topics);
            return { "fileterId": fileterId };
        });
    }
    newBlockFilter() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileterId = yield this.peer.base.newBlockFilter();
            return { "fileterId": fileterId };
        });
    }
    getFilterChanges(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let logs = yield this.peer.base.getFilterChanges(id);
            return logs;
        });
    }
    getFilterLogs(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let logs = yield this.peer.base.getFitlerLogs(id);
            return logs;
        });
    }
    deleteMessageFilter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.peer.base.deleteMessageFilter(id);
            return { "hadDelete": result, "filterId": id };
        });
    }
    signTrsaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.peer.base.signer(tx);
            return { "signedTrasaction": result };
        });
    }
};
__decorate([
    routing_controllers_1.Get('/peercount'),
    routing_controllers_1.ContentType("application/json"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getPeerCount", null);
__decorate([
    routing_controllers_1.Get('/metadata'),
    routing_controllers_1.ContentType("application/json"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getMetaData", null);
__decorate([
    routing_controllers_1.Get('/getabi/:contract'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("contract")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getAbi", null);
__decorate([
    routing_controllers_1.Get('/getblock/:index'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("index")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getBlock", null);
__decorate([
    routing_controllers_1.Get('/getblockbyhash/:hash'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("hash")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getBlockByHash", null);
__decorate([
    routing_controllers_1.Get('/getblocknumber'),
    routing_controllers_1.ContentType("application/json"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getBlockNumber", null);
__decorate([
    routing_controllers_1.Post('/getlogs'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("abi")), __param(1, routing_controllers_1.BodyParam("filter")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getLogs", null);
__decorate([
    routing_controllers_1.Post('/filtermsg'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("topics")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "newMsgFilter", null);
__decorate([
    routing_controllers_1.Post('/filterblock'),
    routing_controllers_1.ContentType("application/json"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "newBlockFilter", null);
__decorate([
    routing_controllers_1.Get('/filterchanges/:id'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getFilterChanges", null);
__decorate([
    routing_controllers_1.Get('/filterlogs/:id'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getFilterLogs", null);
__decorate([
    routing_controllers_1.Get('/filterdelete/:id'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "deleteMessageFilter", null);
__decorate([
    routing_controllers_1.Post('/signtx'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("trasaction")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "signTrsaction", null);
ChainController = __decorate([
    routing_controllers_1.JsonController("/chain"),
    __metadata("design:paramtypes", [])
], ChainController);
exports.ChainController = ChainController;
//# sourceMappingURL=ChainController.js.map
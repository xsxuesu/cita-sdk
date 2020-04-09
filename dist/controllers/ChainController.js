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
const cita_sdk_1 = require("@cryptape/cita-sdk");
const config = require("config");
const logging_1 = require("../common/logging");
let ChainController = class ChainController {
    constructor() {
        this.peer = cita_sdk_1.default(config.get('Peer.Url').toString());
        logging_1.logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    getPeerCount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return response.json({ "peerCount": this.peer.base.peerCount() });
        });
    }
    getMetaData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return response.json({ "metaData": this.peer.base.getMetaData() });
        });
    }
    getAbi(contract, response) {
        return __awaiter(this, void 0, void 0, function* () {
            logging_1.logger.info("get abi contract address:", contract);
            return response.json({ "abi": this.peer.base.getAbi(contract, 'latest') });
        });
    }
};
__decorate([
    routing_controllers_1.Get('/peercount'),
    __param(0, routing_controllers_1.Req()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getPeerCount", null);
__decorate([
    routing_controllers_1.Get('/metadata'),
    __param(0, routing_controllers_1.Req()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getMetaData", null);
__decorate([
    routing_controllers_1.Get('/getabi/:contract'),
    __param(0, routing_controllers_1.Param("contract")), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChainController.prototype, "getAbi", null);
ChainController = __decorate([
    routing_controllers_1.Controller("/chain"),
    __metadata("design:paramtypes", [])
], ChainController);
exports.ChainController = ChainController;
//# sourceMappingURL=ChainController.js.map
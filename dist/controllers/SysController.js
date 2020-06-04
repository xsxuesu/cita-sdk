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
const web3 = require("web3-utils");
const abi = require("web3-eth-abi");
let SysController = class SysController {
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logging_1.logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    getConTx(abi, addr) {
        return __awaiter(this, void 0, void 0, function* () {
            // logger.info(`contractname : ${contractname}`);
            const contractPath = path.join("./contract", abi);
            // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
            const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
            // logger.info(`contractinfo : ${abiJson}`);
            const con = new this.peer.base.Contract(abiJson, addr);
            const privateKey = config.get('adminPrivateKey').toString();
            const from = config.get('adminAddress').toString();
            const metaData = yield this.peer.base.getMetaData();
            logging_1.logger.info(`metaData : ${JSON.stringify(metaData)}`);
            const blockNumber = yield this.peer.base.getBlockNumber();
            logging_1.logger.info(`from : ${from}`);
            const transaction = {
                from: from,
                privateKey: privateKey,
                nonce: 999999,
                quota: 999999,
                version: metaData.version,
                validUntilBlock: blockNumber + 30,
                value: '0x0',
            };
            return { "con": con, "tx": transaction };
        });
    }
    txContract(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("PermissionManagement.abi", "0xffffffffffffffffffffffffffffffffff020004");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const receipt = yield con.methods.setAuthorizations(address, ["ffffffffffffffffffffffffffffffffff021000"]).send(transaction);
            return { "receipt": receipt };
        });
    }
    deployContract(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("PermissionManagement.abi", "0xffffffffffffffffffffffffffffffffff020004");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const receipt = yield con.methods.setAuthorizations(address, ["ffffffffffffffffffffffffffffffffff021001"]).send(transaction);
            return { "receipt": receipt };
        });
    }
    canceltxContract(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("PermissionManagement.abi", "0xffffffffffffffffffffffffffffffffff020004");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const receipt = yield con.methods.cancelAuthorizations(address, ["ffffffffffffffffffffffffffffffffff021000"]).send(transaction);
            return { "receipt": receipt };
        });
    }
    cancelContract(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("PermissionManagement.abi", "0xffffffffffffffffffffffffffffffffff020004");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const receipt = yield con.methods.cancelAuthorizations(address, ["ffffffffffffffffffffffffffffffffff021001"]).send(transaction);
            return { "receipt": receipt };
        });
    }
    multitxContract(address, _values) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("BatchTx.abi", "0xffffffffffffffffffffffffffffffffff02000e");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            var receipts = [];
            var body = [];
            var _addrFun;
            for (let index = 0; index < _values.length; index++) {
                const _value = web3.utils.hexToBytes(web3.utils.toHex(_values[index]));
                var _encode = abi.encodeFunctionCall({
                    name: 'set',
                    type: 'function',
                    inputs: [{
                            "internalType": "uint256",
                            "name": "x",
                            "type": "uint256"
                        }]
                }, [_value]);
                logging_1.logger.info(`_value : ${_value}`);
                logging_1.logger.info(`_encode : ${_encode}`);
                logging_1.logger.info(`_encode : ${web3.utils.hexToBytes(_encode).length}`);
                const rlplength = web3.utils.toHex(web3.utils.hexToBytes(_encode).length);
                logging_1.logger.info(`rlplength : ${rlplength}`);
                const left_rlp_length = web3.utils.padLeft(rlplength, 8);
                logging_1.logger.info(`left_rlp_length : ${left_rlp_length}`);
                //${left_rlp_length.replace("0x","")}
                if (_addrFun == undefined) {
                    _addrFun = `0x${address.replace("0x", "")}${left_rlp_length.replace("0x", "")}${_encode.replace("0x", "")}`;
                }
                else {
                    _addrFun = `${_addrFun}${address.replace("0x", "")}${left_rlp_length.replace("0x", "")}${_encode.replace("0x", "")}`;
                }
            }
            logging_1.logger.info(`_addrFun : ${_addrFun}`);
            const _addrFunBytes = web3.utils.hexToBytes(_addrFun);
            const receipt = yield con.methods.multiTxs(_addrFunBytes).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            return { "receipts": receipt };
        });
    }
    multitxContract3(address, _ids, _stages, _values) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("BatchTx.abi", "0xffffffffffffffffffffffffffffffffff02000e");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            var _addrFun;
            for (let index = 0; index < _ids.length; index++) {
                const _id = web3.utils.hexToBytes(web3.utils.utf8ToHex(_ids[index]));
                const _stage = web3.utils.hexToBytes(web3.utils.utf8ToHex(_stages[index]));
                var _encode = abi.encodeFunctionCall({
                    name: 'setLists',
                    type: 'function',
                    inputs: [{
                            "internalType": "bytes",
                            "name": "_id",
                            "type": "bytes"
                        }, {
                            "internalType": "bytes",
                            "name": "_v",
                            "type": "bytes"
                        }]
                }, [_id, _stage]);
                logging_1.logger.info(`_encode : ${_encode}`);
                const rlplength = web3.utils.toHex(web3.utils.hexToBytes(_encode).length);
                logging_1.logger.info(`rlplength : ${rlplength}`);
                const left_rlp_length = web3.utils.padLeft(rlplength, 8);
                logging_1.logger.info(`left_rlp_length : ${left_rlp_length}`);
                if (_addrFun == undefined) {
                    _addrFun = `0x${address.replace("0x", "")}${left_rlp_length.replace("0x", "")}${_encode.replace("0x", "")}`;
                }
                else {
                    _addrFun = `${_addrFun}${address.replace("0x", "")}${left_rlp_length.replace("0x", "")}${_encode.replace("0x", "")}`;
                }
            }
            logging_1.logger.info(`_addrFun:${_addrFun}`);
            const _addrFunBytes = web3.utils.hexToBytes(_addrFun);
            const receipt = yield con.methods.multiTxs(_addrFunBytes).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            return { "receipts": receipt };
        });
    }
    websiteContract3(_website) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("SysConfig.abi", "0xFFfffFFfFfFffFFfFFfffFffFfFFFffFFf020000");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const receipt = yield con.methods.setWebsite(_website).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            return { "receipts": receipt };
        });
    }
    chainnameContract(_chainname) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("SysConfig.abi", "0xFFfffFFfFfFffFFfFFfffFffFfFFFffFFf020000");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const receipt = yield con.methods.setChainName(_chainname).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            return { "receipts": receipt };
        });
    }
    operatorContract(_operator) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("SysConfig.abi", "0xFFfffFFfFfFffFFfFFfffFffFfFFFffFFf020000");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const receipt = yield con.methods.setOperator(_operator).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            return { "receipts": receipt };
        });
    }
    versionContract(_version) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("VersionManager.abi", "0xFffFffFffFfFFfFfffFffffffffFffFfFF021028");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const receipt = yield con.methods.setVersion(_version).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            return { "receipts": receipt };
        });
    }
    roleContract(_role, _addrs) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("RoleManager.abi", "0xffffffffffffffffffffffffffffffffff020007");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
            // const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
            const receipt = yield con.methods.newRole(role_bytes, _addrs).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
        });
    }
    delroleContract(_role) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("RoleManager.abi", "0xffffffffffffffffffffffffffffffffff020007");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
            const receipt = yield con.methods.deleteRole(role_bytes).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
        });
    }
    //updateRoleName
    updateroleContract(_addr_role, _role) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("RoleManager.abi", "0xffffffffffffffffffffffffffffffffff020007");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
            const receipt = yield con.methods.updateRoleName(_addr_role, role_bytes).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
        });
    }
    //addPermissions
    addPermissionContract(_addr_role, _addrs) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("RoleManager.abi", "0xffffffffffffffffffffffffffffffffff020007");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            //const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
            const receipt = yield con.methods.addPermissions(_addr_role, _addrs).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
        });
    }
    //deletePermissions
    delPermissionContract(_addr_role, _addrs) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("RoleManager.abi", "0xffffffffffffffffffffffffffffffffff020007");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            //const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
            const receipt = yield con.methods.deletePermissions(_addr_role, _addrs).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
        });
    }
    //deletePermissions
    cancelRoleContract(_account, _role) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("RoleManager.abi", "0xffffffffffffffffffffffffffffffffff020007");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            //const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
            const receipt = yield con.methods.cancelRole(_account, _role).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
        });
    }
    //clearRole
    clearRoleContract(_account) {
        return __awaiter(this, void 0, void 0, function* () {
            const contx = this.getConTx("RoleManager.abi", "0xffffffffffffffffffffffffffffffffff020007");
            const con = (yield contx).con;
            const transaction = (yield contx).tx;
            //const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
            const receipt = yield con.methods.clearRole(_account).send(transaction);
            logging_1.logger.info(`receipt:${JSON.stringify(receipt)}`);
            const listeners = yield this.peer.listeners.listenToTransactionReceipt(receipt.hash);
            return { "listener": listeners };
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
__decorate([
    routing_controllers_1.Post('/cancelpermissiontx'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "canceltxContract", null);
__decorate([
    routing_controllers_1.Post('/cancelpermissioncontract'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "cancelContract", null);
__decorate([
    routing_controllers_1.Post('/multitx'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")),
    __param(1, routing_controllers_1.BodyParam("values")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "multitxContract", null);
__decorate([
    routing_controllers_1.Post('/multitx3'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("address")),
    __param(1, routing_controllers_1.BodyParam("ids")),
    __param(2, routing_controllers_1.BodyParam("stages")),
    __param(3, routing_controllers_1.BodyParam("values")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Array, Array]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "multitxContract3", null);
__decorate([
    routing_controllers_1.Post('/setwebsite'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("website")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "websiteContract3", null);
__decorate([
    routing_controllers_1.Post('/setchainname'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("chainname")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "chainnameContract", null);
__decorate([
    routing_controllers_1.Post('/setoperator'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("operator")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "operatorContract", null);
__decorate([
    routing_controllers_1.Post('/setversion'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("version")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "versionContract", null);
__decorate([
    routing_controllers_1.Post('/newrole'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("role")),
    __param(1, routing_controllers_1.BodyParam("addresses")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "roleContract", null);
__decorate([
    routing_controllers_1.Post('/deleterole'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "delroleContract", null);
__decorate([
    routing_controllers_1.Post('/updaterole'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("addrole")),
    __param(1, routing_controllers_1.BodyParam("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "updateroleContract", null);
__decorate([
    routing_controllers_1.Post('/addpermission'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("addrole")),
    __param(1, routing_controllers_1.BodyParam("addrs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "addPermissionContract", null);
__decorate([
    routing_controllers_1.Post('/delpermission'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("addrole")),
    __param(1, routing_controllers_1.BodyParam("addrs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "delPermissionContract", null);
__decorate([
    routing_controllers_1.Post('/canclerole'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("account")),
    __param(1, routing_controllers_1.BodyParam("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "cancelRoleContract", null);
__decorate([
    routing_controllers_1.Post('/clearrole'),
    routing_controllers_1.ContentType("application/json"),
    __param(0, routing_controllers_1.BodyParam("account")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysController.prototype, "clearRoleContract", null);
SysController = __decorate([
    routing_controllers_1.JsonController("/sys"),
    __metadata("design:paramtypes", [])
], SysController);
exports.SysController = SysController;
//# sourceMappingURL=SysController.js.map
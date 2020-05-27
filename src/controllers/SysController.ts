import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';
import * as path from 'path';
import * as fs from 'fs';
import * as web3 from 'web3';
import * as abi from 'web3-eth-abi';

@JsonController("/sys")
export class SysController {
    peer: any;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }

    @Post('/permissiontx')
    @ContentType("application/json")
    async txContract(@BodyParam("address") address: string) {
        // logger.info(`contractname : ${contractname}`);
        const contractPath = path.join("./contract","PermissionManagement.abi");
        // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
        const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
        logger.info(`contractinfo : ${abiJson}`);
        const TxPermissionContract = "0xffffffffffffffffffffffffffffffffff020004";
        // const result = this.peer.base.personal.unlockAccount(from, password);
        const con = new this.peer.base.Contract(abiJson, TxPermissionContract);
        const privateKey = config.get('adminPrivateKey').toString();
        const from = config.get('adminAddress').toString();
        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);
        const blockNumber = await this.peer.base.getBlockNumber();

        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 999999,
          version: metaData.version,
          validUntilBlock: blockNumber+30,
          value: '0x0',
        };
        const receipt = await con.methods.setAuthorizations(address,["ffffffffffffffffffffffffffffffffff021000"]).send(transaction);
        return {"receipt":receipt};
    }


    @Post('/permissioncontract')
    @ContentType("application/json")
    async deployContract(@BodyParam("address") address: string) {
        // logger.info(`contractname : ${contractname}`);
        const contractPath = path.join("./contract","PermissionManagement.abi");
        // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
        const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
        logger.info(`contractinfo : ${abiJson}`);
        const TxPermissionContract = "0xffffffffffffffffffffffffffffffffff020004";
        // const result = this.peer.base.personal.unlockAccount(from, password);
        const con = new this.peer.base.Contract(abiJson, TxPermissionContract);
        const privateKey = config.get('adminPrivateKey').toString();
        const from = config.get('adminAddress').toString();
        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);
        const blockNumber = await this.peer.base.getBlockNumber();

        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 999999,
          version: metaData.version,
          validUntilBlock: blockNumber+30,
          value: '0x0',
        };
        const receipt = await con.methods.setAuthorizations(address,["ffffffffffffffffffffffffffffffffff021001"]).send(transaction);
        return {"receipt":receipt};
    }


    @Post('/multitx')
    @ContentType("application/json")
    async multitxContract(
      @BodyParam("address") address: string,
      @BodyParam("values") _values:Number[]
    ) {
        const contractPath = path.join("./contract","BatchTx.abi");
        const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
        logger.info(`contractinfo : ${abiJson}`);
        const BatchContract = "0xffffffffffffffffffffffffffffffffff02000e";

        const con = new this.peer.base.Contract(abiJson, BatchContract);
        const privateKey = config.get('adminPrivateKey').toString();
        const from = config.get('adminAddress').toString();
        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);
        const blockNumber = await this.peer.base.getBlockNumber();

        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 99999999,
          version: metaData.version,
          validUntilBlock: blockNumber+30,
          value: '0x0',
        };

        var receipts = [];
        var body = [] ;
        var _addrFun ;
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
          logger.info(`_value : ${_value}`);
          logger.info(`_encode : ${_encode}`);
          logger.info(`_encode : ${web3.utils.hexToBytes(_encode).length}`);
          const rlplength = web3.utils.toHex(web3.utils.hexToBytes(_encode).length);
          logger.info(`rlplength : ${rlplength}`);
          const left_rlp_length = web3.utils.padLeft(rlplength, 8);
          logger.info(`left_rlp_length : ${left_rlp_length}`);
          //${left_rlp_length.replace("0x","")}
          if (_addrFun == undefined){
            _addrFun = `0x${address.replace("0x","")}${left_rlp_length.replace("0x","")}${_encode.replace("0x","")}`;
          }else{
            _addrFun = `${_addrFun}${address.replace("0x","")}${left_rlp_length.replace("0x","")}${_encode.replace("0x","")}`;
          }
        }
        logger.info(`_addrFun : ${_addrFun}`);
        const _addrFunBytes = web3.utils.hexToBytes(_addrFun);
        const receipt = await con.methods.multiTxs(_addrFunBytes).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }



    @Post('/multitx3')
    @ContentType("application/json")
    async multitxContract3(
      @BodyParam("address") address: string,
      @BodyParam("ids") _ids:String[],
      @BodyParam("stages") _stages:String[],
      @BodyParam("values") _values:String[]
    ) {
        const contractPath = path.join("./contract","BatchTx.abi");
        const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
        logger.info(`contractinfo : ${abiJson}`);
        const BatchContract = "0xffffffffffffffffffffffffffffffffff02000e";

        const con = new this.peer.base.Contract(abiJson, BatchContract);
        const privateKey = config.get('adminPrivateKey').toString();
        const from = config.get('adminAddress').toString();
        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);
        const blockNumber = await this.peer.base.getBlockNumber();

        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 99999999,
          version: metaData.version,
          validUntilBlock: blockNumber+30,
          value: '0x0',
        };

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
            },{
              "internalType": "bytes",
              "name": "_v",
              "type": "bytes"
              }]}, [_id,_stage]);
          logger.info(`_encode : ${_encode}`);
          const rlplength = web3.utils.toHex(web3.utils.hexToBytes(_encode).length);
          logger.info(`rlplength : ${rlplength}`);
          const left_rlp_length = web3.utils.padLeft(rlplength, 8);
          logger.info(`left_rlp_length : ${left_rlp_length}`);
          if (_addrFun == undefined){
            _addrFun = `0x${address.replace("0x","")}${left_rlp_length.replace("0x","")}${_encode.replace("0x","")}`;
          }else{
            _addrFun = `${_addrFun}${address.replace("0x","")}${left_rlp_length.replace("0x","")}${_encode.replace("0x","")}`;
          }
        }
        logger.info(`_addrFun:${_addrFun}`)
        const _addrFunBytes = web3.utils.hexToBytes(_addrFun);
        const receipt = await con.methods.multiTxs(_addrFunBytes).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }
}
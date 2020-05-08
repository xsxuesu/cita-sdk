import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';
import * as path from 'path';
import * as fs from 'fs';

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
}
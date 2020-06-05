import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';
import * as path from 'path';
import * as fs from 'fs';
import * as web3 from 'web3';

@JsonController("/demo")
export class DemoController {
    peer: any;
    addr:string;
    abi:string;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        this.addr = "0x56439a0e50eD84126863e1dBd8D6D6eE8949b950";
        this.abi = "FactoryInfo.json";
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }
    
    async getConTx(abi:string,addr:string,prikey:string,from:string){
        // logger.info(`contractname : ${contractname}`);
        const contractPath = path.join("./contract",abi);
        // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
        const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
        // logger.info(`contractinfo : ${abiJson}`);
        const con = new this.peer.base.Contract(abiJson.abi, addr);
        const privateKey = prikey;
        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);
        const blockNumber = await this.peer.base.getBlockNumber();
        logger.info(`from : ${from}`);
        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 999999,
          version: metaData.version,
          validUntilBlock: blockNumber+30,
          value: '0x0',
        };
        return {"con":con,"tx":transaction};
      }
    
      @Post('/setstorage')
      @ContentType("application/json")
      async setStorage(
          @BodyParam("storageaddr") _addr: string,
          @BodyParam("privatekey") privatekey:string,
          @BodyParam("from") from:string){
        if (privatekey == ""){
          privatekey = config.get('adminPrivateKey').toString();
          from = config.get('adminAddress').toString();
        }
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const tx = (await contx).tx;
  
        const receipt = await con.methods.setStorageAddress(_addr).send(tx);
        const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
        return {"listener":listeners};
      }

    @Post('/entryfactory')
    @ContentType("application/json")
    async entryFactory(
        @BodyParam("id") _id: string,
        @BodyParam("date") _date:string,
        @BodyParam("cert") _cert:string,
        @BodyParam("level") _lvl:string,
        @BodyParam("entryhash") _inhash:string,
        @BodyParam("weight") _w:string,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
        privatekey = config.get('adminPrivateKey').toString();
        from = config.get('adminAddress').toString();
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;

      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const date_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_date));
      const cert_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_cert));
      const lvl_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_lvl));
      const hash_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_inhash));
      const weight_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_w));

      const receipt = await con.methods.setInFactory(id_bytes,date_bytes,cert_bytes,lvl_bytes,hash_bytes,weight_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/outfactory')
    @ContentType("application/json")
    async outFactory(
        @BodyParam("id") _id: string,
        @BodyParam("date") _date:string,
        @BodyParam("outhash") _outhash:string,
        @BodyParam("weight") _w:string,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
        privatekey = config.get('adminPrivateKey').toString();
        from = config.get('adminAddress').toString();
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const date_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_date));
      const hash_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_outhash));
      const weight_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_w));

      const receipt = await con.methods.setOutFactory(id_bytes,date_bytes,hash_bytes,weight_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getinfo')
    @ContentType("application/json")
    async getAllinfo(
        @BodyParam("id") _id: string){
      const privatekey = config.get('adminPrivateKey').toString();
      const from = config.get('adminAddress').toString();
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const receipt = await con.methods.getInfo(id_bytes).call();
      const titls = receipt["0"];
      const values = receipt["1"];
      var titls_z = [];
      var value_z = [];
      var result = {};
      for (let index = 0; index < titls.length; index++) {
        const title = titls[index];
        const value = values[index];
        result[web3.utils.hexToUtf8(title)] = web3.utils.hexToUtf8(value);
      }
      return result;
    }
}
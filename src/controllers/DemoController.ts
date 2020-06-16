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
    privateKey:string;
    from:string;
    remote:boolean;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        this.abi = "FactoryInfo.json";

        this.remote = SDK.remote;
        if (this.remote == true){
          this.privateKey = config.get('adminPrivateKeySm2').toString();
          this.from = config.get('adminAddressSm2').toString();
          // this.addr = "0xB4482582746089254531F8fE0AE8EfeeAd29899b";
          this.addr = "0x79FC95dA8773A690B0c14498Fd236D14372b6657";
        }else{
          this.privateKey = config.get('remotePrivateKey').toString();
          this.from = config.get('remoteAddress').toString();
          this.addr = "0x06218505BF6cD4d114c79a40889C0E4e5c5E841A";
        }

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
          cryptoTx:1,
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
          privatekey = this.privateKey;
          from = this.from;
        }
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const tx = (await contx).tx;
  
        const receipt = await con.methods.setStorageAddress(_addr).send(tx);
        const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
        return {"listener":listeners};
      }

    ///setInFactory
    ///(bytes memory _id,bytes memory _date,bytes memory _cano,
    // bytes memory _cacert,bytes memory _driver,
    // bytes memory _drivercert,
    // bytes memory _weight)

    @Post('/entryfactory')
    @ContentType("application/json")
    async entryFactory(
        @BodyParam("id") _id: string,
        @BodyParam("date") _date:string,
        @BodyParam("carno") _carno:string,
        @BodyParam("carcert") _carcert:string,
        @BodyParam("driver") _driver:string,
        @BodyParam("drivercert") _drivercert:string,
        @BodyParam("weight") _w:string,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
        privatekey = this.privateKey;
          from = this.from;
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;

      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const date_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_date));
      const carno_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_carno));
      const carcert_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_carcert));
      const driver_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_driver));
      const drivercert_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_drivercert));
      const weight_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_w));

      const receipt = await con.methods.setInFactory(id_bytes,date_bytes,carno_bytes,carcert_bytes,driver_bytes,drivercert_bytes,weight_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getentryfactory')
    @ContentType("application/json")
    async getentryfactory(
        @BodyParam("id") _id: string){
        const privatekey = this.privateKey;
        const from = this.from;
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
        const receipt = await con.methods.getInFactoryInfo(id_bytes).call();
        const titls = receipt["0"];
        const values = receipt["1"];
        var result = {};
        for (let index = 0; index < titls.length; index++) {
          const title = titls[index];
          const value = values[index];
          result[web3.utils.hexToUtf8(title)] = web3.utils.hexToUtf8(value);
        }
        return result;
    }

    //setInPic(bytes memory _id,bytes memory _pic)
    @Post('/entrypic')
    @ContentType("application/json")
    async entrypic(
        @BodyParam("id") _id: string,
        @BodyParam("pichash") _pic:string,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
        privatekey = this.privateKey;
        from = this.from;
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;

      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const pichash_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_pic));

      const receipt = await con.methods.setInPic(id_bytes,pichash_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getentrypic')
    @ContentType("application/json")
    async getentrypic(
        @BodyParam("id") _id: string){
        const privatekey = this.privateKey;
        const from = this.from;
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
        const receipt = await con.methods.getInPic(id_bytes).call();
        return receipt;
    }

    //setContractHash(bytes memory _id,bytes memory _contracthash)
    @Post('/setcontract')
    @ContentType("application/json")
    async setcontract(
        @BodyParam("id") _id: string,
        @BodyParam("contracthash") _pic:string,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
        privatekey = this.privateKey;
        from = this.from;
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;

      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const contract_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_pic));

      const receipt = await con.methods.setContractHash(id_bytes,contract_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getcontract')
    @ContentType("application/json")
    async getcontract(
        @BodyParam("id") _id: string){
        const privatekey = this.privateKey;
        const from = this.from;
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
        const receipt = await con.methods.getContractHash(id_bytes).call();
        return receipt;
    }


    //setOutPic(bytes memory _id,bytes memory _pic)

    @Post('/setoutpic')
    @ContentType("application/json")
    async setoutpic(
        @BodyParam("id") _id: string,
        @BodyParam("pichash") _pic:string,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
        privatekey = this.privateKey;
        from = this.from;
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;

      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const pic_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_pic));

      const receipt = await con.methods.setOutPic(id_bytes,pic_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getoutpic')
    @ContentType("application/json")
    async getoutpic(
        @BodyParam("id") _id: string){
        const privatekey = this.privateKey;
        const from = this.from;
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
        const receipt = await con.methods.getOutPic(id_bytes).call();
        return receipt;
    }

    //setQc(bytes memory _id,bytes memory _qclevel,bytes memory _qcperson)
    @Post('/setqc')
    @ContentType("application/json")
    async setqc(
        @BodyParam("id") _id: string,
        @BodyParam("qclevel") _qclevel:string,
        @BodyParam("qcperson") _qcperson:string,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
        privatekey = this.privateKey;
        from = this.from;
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;

      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const qclevel_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_qclevel));
      const qcperson_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_qcperson));

      const receipt = await con.methods.setQc(id_bytes,qclevel_bytes,qcperson_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getqc')
    @ContentType("application/json")
    async getqc(
        @BodyParam("id") _id: string){
        const privatekey = this.privateKey;
        const from = this.from;
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
        const receipt = await con.methods.getQc(id_bytes).call();
        const titls = receipt["0"];
        const values = receipt["1"];
        var result = {};
        for (let index = 0; index < titls.length; index++) {
          const title = titls[index];
          const value = values[index];
          result[web3.utils.hexToUtf8(title)] = web3.utils.hexToUtf8(value);
        }
        return result;
    }

    //setOutFactory(bytes memory _id,bytes memory _date,bytes memory _weight)
    @Post('/outfactory')
    @ContentType("application/json")
    async outFactory(
        @BodyParam("id") _id: string,
        @BodyParam("date") _date:string,
        @BodyParam("weight") _w:string,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
        privatekey = this.privateKey;
        from = this.from;
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const date_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_date));
      //const hash_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_outhash));
      const weight_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_w));

      const receipt = await con.methods.setOutFactory(id_bytes,date_bytes,weight_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getoutfactory')
    @ContentType("application/json")
    async getoutfactory(
        @BodyParam("id") _id: string){
        const privatekey = this.privateKey;
        const from = this.from;
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
        const receipt = await con.methods.getOutFactoryInfo(id_bytes).call();
        const titls = receipt["0"];
        const values = receipt["1"];
        var result = {};
        for (let index = 0; index < titls.length; index++) {
          const title = titls[index];
          const value = values[index];
          result[web3.utils.hexToUtf8(title)] = web3.utils.hexToUtf8(value);
        }
        return result;
    }

    //setFund(bytes memory _id,bytes memory _pichash,bytes memory _fundid,bytes memory _fundvalue)
    @Post('/setfund')
    @ContentType("application/json")
    async setFundFactory(
        @BodyParam("id") _id: string,
        @BodyParam("picHash") _pichash:string,
        @BodyParam("fundId") _fundId:string,
        @BodyParam("fundValue") _fundValue:number,
        @BodyParam("privatekey") privatekey:string,
        @BodyParam("from") from:string){
      if (privatekey == ""){
          privatekey = this.privateKey;
          from = this.from;
      }
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const tx = (await contx).tx;
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const pic_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_pichash));
      const fund_id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_fundId));
      const fund_value_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_fundValue.toString()));

      const receipt = await con.methods.setFund(id_bytes,pic_bytes,fund_id_bytes,fund_value_bytes).send(tx);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getfund')
    @ContentType("application/json")
    async getfund(
        @BodyParam("id") _id: string){
        const privatekey = this.privateKey;
        const from = this.from;
        const contx = this.getConTx(this.abi,this.addr,privatekey,from);
        const con = (await contx).con;
        const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
        const receipt = await con.methods.getFund(id_bytes).call();
        const titls = receipt["0"];
        const values = receipt["1"];
        var result = {};
        for (let index = 0; index < titls.length; index++) {
          const title = titls[index];
          const value = values[index];
          result[web3.utils.hexToUtf8(title)] = web3.utils.hexToUtf8(value);
        }
        return result;
    }

    @Post('/getallinfo')
    @ContentType("application/json")
    async getAllinfo(
        @BodyParam("id") _id: string){
       const   privatekey = this.privateKey;
       const  from = this.from;
      const contx = this.getConTx(this.abi,this.addr,privatekey,from);
      const con = (await contx).con;
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const receipt = await con.methods.getInfo(id_bytes).call();
      const titls = receipt["0"];
      const values = receipt["1"];
      var result = {};
      for (let index = 0; index < titls.length; index++) {
        const title = titls[index];
        const value = values[index];
        result[web3.utils.hexToUtf8(title)] = web3.utils.hexToUtf8(value);
      }
      return result;
    }
}
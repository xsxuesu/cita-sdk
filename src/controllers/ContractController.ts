import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';
import * as path from 'path';
import * as fs from 'fs';
import * as web3 from 'web3';

@JsonController("/contract")
export class ContractController {
    peer: any;
    privateKey:string;
    from:string;
    remote:boolean;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        this.remote = SDK.remote;
        if (this.remote == true){
          this.privateKey = config.get('adminPrivateKey').toString();
          this.from = config.get('adminAddress').toString();
        }else{
          this.privateKey = config.get('remotePrivateKey').toString();
          this.from = config.get('remoteAddress').toString();
        }
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }

    @Post('/sm2deploy')
    @ContentType("application/json")
    async sm2deployContract(@BodyParam("contract") contractname:string
    ) {
        // logger.info(`contractname : ${contractname}`);
        const contractPath = path.join("./contract",contractname);
        // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
        const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
        // logger.info(`contractinfo : ${contractinfo}`);
        const abiJson  = contractinfo.abi;
        const bytecode = contractinfo.bytecode;

        // const result = this.peer.base.personal.unlockAccount(from, password);
        const newContract = new this.peer.base.Contract(abiJson);
        const privateKey = this.privateKey;
        const from = this.from;
        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);
        const blockNumber = await this.peer.base.getBlockNumber();
        //chainId: metaData.chainId,
        //
        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 9999999,
          version: metaData.version,
          validUntilBlock: blockNumber+70,
          value: '0x0',
          cryptoTx:1,
        };

        const txRes = await newContract.deploy({data: bytecode,arguments: [],}).send(transaction);
        const receipt = await this.peer.listeners.listenToTransactionReceipt(txRes.hash);
          // set contract address to contract instance
        newContract.options.address = receipt.contractAddress;
        logger.info(receipt);
        return {"contractAddress":receipt.contractAddress}
    }

    @Post('/deploy')
    @ContentType("application/json")
    async deployContract(@BodyParam("contract") contractname:string,@BodyParam("from") from:string,@BodyParam("password") password:string
    ) {
        // logger.info(`contractname : ${contractname}`);
        const contractPath = path.join("./contract",contractname);
        // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
        const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
        // logger.info(`contractinfo : ${contractinfo}`);
        const abiJson  = contractinfo.abi;
        const bytecode = contractinfo.bytecode;

        // const result = this.peer.base.personal.unlockAccount(from, password);
        const newContract = new this.peer.base.Contract(abiJson);
        const privateKey = this.privateKey;

        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);

        const blockNumber = await this.peer.base.getBlockNumber();
        //chainId: metaData.chainId,
        //
        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 9999999,
          version: metaData.version,
          validUntilBlock: blockNumber+70,
          value: '0x0',
          cryptoTx:1,
        };

        const txRes = await newContract.deploy({data: bytecode,arguments: [],}).send(transaction);
        const receipt = await this.peer.listeners.listenToTransactionReceipt(txRes.hash);
          // set contract address to contract instance
        newContract.options.address = receipt.contractAddress;
        logger.info(receipt);
        return {"contractAddress":receipt.contractAddress}
    }

    @Post('/call')
    @ContentType("application/json")
    async callContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string,@BodyParam("from") from:string){
      const contractPath = path.join("./contract",contractname);

      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const receipt = await con.methods.get().call({from:from})
        
      return {"receipt":receipt};
    }

    @Post('/supply')
    @ContentType("application/json")
    async supplyContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string,@BodyParam("from") from:string){
      const contractPath = path.join("./contract",contractname);

      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const receipt = await con.methods.totalSupply().call({from:from})
        
      return {"receipt":receipt};
    }

    @Post('/balance')
    @ContentType("application/json")
    async balanceContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string,@BodyParam("from") from:string){
      const contractPath = path.join("./contract",contractname);

      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const receipt = await con.methods.balanceOf(from).call({from:from})
        
      return {"receipt":receipt};
    }

    @Post('/getname')
    @ContentType("application/json")
    async getnameContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string,@BodyParam("from") from:string){
      const contractPath = path.join("./contract",contractname);

      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const receipt = await con.methods.getName().call({from:from})
      
      return {"receipt":web3.utils.hexToUtf8(receipt)};
    }

    @Post('/getstock')
    @ContentType("application/json")
    async getstockContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string,@BodyParam("from") from:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;
      const con = new this.peer.base.Contract(abiJson, contract);
      const stockinfo = await con.methods.getStock(from).call({from:from})
      logger.info(`stockinfo : ${stockinfo}`);
      stockinfo["0"] = web3.utils.hexToUtf8(stockinfo["0"]);
      stockinfo["1"] = web3.utils.hexToUtf8(stockinfo["1"]);
      return {"stockinfo":stockinfo};
    }

    @Post('/send')
    @ContentType("application/json")
    async sendContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;
        // contract.methods.myMethod(parameters).send(transaction)

      const con = new this.peer.base.Contract(abiJson, contract);

      const blockNumber = await this.peer.base.getBlockNumber();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      const privateKey = this.privateKey;
      const from = this.from;
      const transaction = {
        from: from,
        privateKey:privateKey,
        nonce: 999999,
        quota: 999999,
        version: metaData.version,
        validUntilBlock: blockNumber+30,
        value: '0x0',
      };

      const receipt = await con.methods.set(blockNumber).send(transaction);
      
      return {"receipt":receipt};
    }

    @Post('/access')
    @ContentType("application/json")
    async accessContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string,
    @BodyParam("senderConAddress") conaddress:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;
        // contract.methods.myMethod(parameters).send(transaction)

      const con = new this.peer.base.Contract(abiJson, contract);

      const blockNumber = await this.peer.base.getBlockNumber();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      const privateKey = this.privateKey;
      const from = this.from;
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

      const receipt = await con.methods.allowAccess(conaddress).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      
      return {"listener":listeners};
    }

    @Post('/transfer')
    @ContentType("application/json")
    async transferContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string,
    @BodyParam("from") from:string,
    @BodyParam("to") _to:string,
    @BodyParam("value") value:Number){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const blockNumber = await this.peer.base.getBlockNumber();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      const privateKey = '0xf97a6a9cfeade639d798f005ad9d8a43241f5799cddad7bb331de89ae297dbe1';

      const transaction = {
        from: from,
        privateKey:privateKey,
        nonce: 999999,
        quota: 999999,
        version: metaData.version,
        validUntilBlock: blockNumber+30,
        value: '0x0',
      };

      const receipt = await con.methods.transfer(_to,value).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      
      return {"listener":listeners};
    }

    @Post('/setstock')
    @ContentType("application/json")
    async setstockContract(@BodyParam("contractname") contractname: string,
    @BodyParam("contractadd") contract:string,
    @BodyParam("name") name:string,
    @BodyParam("telno") telno:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const blockNumber = await this.peer.base.getBlockNumber();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      const privateKey = this.privateKey;
      const from = this.from;
      const transaction = {
        from: from,
        privateKey:privateKey,
        nonce: 999999,
        quota: 999999,
        version: metaData.version,
        validUntilBlock: blockNumber+30,
        value: '0x0',
      };
      
      const namebytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(name));
      const telnobytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(telno));
      const receipt = await con.methods.setStock(from,namebytes,telnobytes).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

///////////////////////======================================
    @Post('/setstorage')
    @ContentType("application/json")
    async setstorageContract(@BodyParam("contractname") contractname: string,
    @BodyParam("contractadd") contract:string,
    @BodyParam("id") _id:string,
    @BodyParam("stage") _stage:string,@BodyParam("value") _value:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const blockNumber = await this.peer.base.getBlockNumber();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      const privateKey = this.privateKey;
      const from = this.from;
      const transaction = {
        from: from,
        privateKey:privateKey,
        nonce: 999999,
        quota: 999999,
        version: metaData.version,
        validUntilBlock: blockNumber+30,
        value: '0x0',
      };
      
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const stage_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_stage));
      const value_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_value));
      const receipt = await con.methods.setStorage(id_bytes,stage_bytes,value_bytes).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/getstorage')
    @ContentType("application/json")
    async getstorageContract(@BodyParam("contractname") contractname: string,
    @BodyParam("contractadd") contract:string,
    @BodyParam("from") from:string,@BodyParam("id") _id:string,
    @BodyParam("stage") _stage:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;
      const con = new this.peer.base.Contract(abiJson, contract);
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const stage_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_stage));
      
      const stockinfo = await con.methods.getStorage(id_bytes,stage_bytes).call({from:from})
      logger.info(`stockinfo : ${stockinfo}`);
      stockinfo["0"] = stockinfo["0"];
      stockinfo["1"] = web3.utils.hexToUtf8(stockinfo["1"]);
      stockinfo["2"] = web3.utils.hexToUtf8(stockinfo["2"]);
      stockinfo["3"] = web3.utils.hexToUtf8(stockinfo["3"]);
      return {"storageinfo":stockinfo};
    }


    ///////////////////////======================================
    @Post('/setmapstorage')
    @ContentType("application/json")
    async setmapstorageContract(@BodyParam("contractname") contractname: string,
    @BodyParam("contractadd") contract:string,
    @BodyParam("id") _id:string,
    @BodyParam("stage") _stage:string,
    @BodyParam("keys") _keys:String[],
    @BodyParam("values") _values:String[]){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      logger.info(`contractinfo ---------------`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const blockNumber = await this.peer.base.getBlockNumber();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      const privateKey = this.privateKey;
      const from = this.from;
      const transaction = {
        from: from,
        privateKey:privateKey,
        nonce: 999999,
        quota: 9999999,
        version: metaData.version,
        validUntilBlock: blockNumber+30,
        value: '0x0',
      };
      
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const stage_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_stage));

      // logger.info(_keys.length);
      logger.info(`_keys ---------------：${_keys}`);
      logger.info(`_values ---------------：${_values}`);

      var keys_bytes : Buffer[]= new Array();
      for (let index = 0; index < _keys.length; index++) {
        const element = _keys[index];
        keys_bytes.push(web3.utils.hexToBytes(web3.utils.utf8ToHex(element)));
      }

      var values_bytes : Buffer[]= new Array();
      for (let index = 0; index < _values.length; index++) {
        const element = _values[index];
        values_bytes.push(web3.utils.hexToBytes(web3.utils.utf8ToHex(element)));
      }

      const receipt = await con.methods.setMapStorage(id_bytes,stage_bytes,keys_bytes,values_bytes).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    

    @Post('/getmapstorage')
    @ContentType("application/json")
    async getmapstorageContract(@BodyParam("contractname") contractname: string,
    @BodyParam("contractadd") contract:string,
    @BodyParam("from") from:string,@BodyParam("id") _id:string,
    @BodyParam("stage") _stage:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;
      const con = new this.peer.base.Contract(abiJson, contract);
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));
      const stage_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_stage));
      
      const stockinfo = await con.methods.getMapStorage(id_bytes,stage_bytes).call({from:from})
      logger.info(`stockinfo : ${stockinfo}`);
      stockinfo["0"] = stockinfo["0"];
      stockinfo["1"] = web3.utils.hexToUtf8(stockinfo["1"]);
      stockinfo["2"] = web3.utils.hexToUtf8(stockinfo["2"]);
      var keys = new Array();
      stockinfo["3"].forEach(element => {
        keys.push(web3.utils.hexToUtf8(element));
      });
      var values = new Array();
      stockinfo["4"].forEach(element => {
        values.push(web3.utils.hexToUtf8(element));
      });
      stockinfo["3"] = keys;
      stockinfo["4"] = values;
      return {"storageinfo":stockinfo};
    }


    ////////SetList
    ///////////////////////======================================
    @Post('/setlist')
    @ContentType("application/json")
    async setlistContract(@BodyParam("contractname") contractname: string,
    @BodyParam("contractadd") contract:string,
    @BodyParam("id") _id:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      logger.info(`contractinfo ---------------`);
      const abiJson  = contractinfo.abi;

      const con = new this.peer.base.Contract(abiJson, contract);

      const blockNumber = await this.peer.base.getBlockNumber();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      const privateKey = this.from;
      const from = this.from;
      const transaction = {
        from: from,
        privateKey:privateKey,
        nonce: 999999,
        quota: 9999999,
        version: metaData.version,
        validUntilBlock: blockNumber+30,
        value: '0x0',
      };
      
      const id_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_id));


      const receipt = await con.methods.setList(id_bytes).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }


    @Post('/getlist')
    @ContentType("application/json")
    async getlistContract(@BodyParam("contractname") contractname: string,
    @BodyParam("contractadd") contract:string,
    @BodyParam("from") from:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;
      const con = new this.peer.base.Contract(abiJson, contract);
 
      const listinfo = await con.methods.getList().call({from:from})
      logger.info(`listinfo : ${listinfo}`);
      return {"listinfo":listinfo};
    }
}
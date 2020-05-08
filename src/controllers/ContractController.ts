import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';
import * as path from 'path';
import * as fs from 'fs';

@JsonController("/contract")
export class ContractController {
    peer: any;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
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
        const privateKey = '0xf97a6a9cfeade639d798f005ad9d8a43241f5799cddad7bb331de89ae297dbe1';

        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);

        const blockNumber = await this.peer.base.getBlockNumber();
        //chainId: metaData.chainId,
        //
        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 999999,
          version: metaData.version,
          validUntilBlock: blockNumber+70,
          value: '0x0',
        };

        const txRes = await newContract.deploy({data: bytecode,arguments: [],}).send(transaction);

        // const privateKey = '0xe45101cbb6f63219be644ec0592e199d0928c33d1fc3cbaf86db7153dcf0a2df'
        

        const receipt = await this.peer.listeners.listenToTransactionReceipt(txRes.hash);
          // set contract address to contract instance
        newContract.options.address = receipt.contractAddress;

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

    @Post('/send')
    @ContentType("application/json")
    async sendContract(@BodyParam("contractname") contractname: string,@BodyParam("contractadd") contract:string,@BodyParam("from") from:string){
      const contractPath = path.join("./contract",contractname);
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${contractinfo}`);
      const abiJson  = contractinfo.abi;
        // contract.methods.myMethod(parameters).send(transaction)

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

      const receipt = await con.methods.set(blockNumber).send(transaction);
      
      return {"receipt":receipt};
    }
}
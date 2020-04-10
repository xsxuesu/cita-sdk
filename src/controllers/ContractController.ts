import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';

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
    async deployContract(@Param("abi") abi: string,@Param("code") code:string,@Param("from") from:string,
    @Param("chainId") chainId: string
    ) {
        const abiJson  = JSON.parse(abi);
        const bytecode = code ;
        const privateKey = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        const transaction = {
            from: from,
            privateKey,
            nonce: 999999,
            quota: 1e10,
            chainId: chainId,
            version: 2,
            validUntilBlock: 999999,
            value: '0x0',
          }
          // create contract instance
        const newContract = new this.peer.base.Contract(abiJson);
          // deploy contract and get transaction result
        const txRes = await newContract.deploy({data: bytecode,arguments: [],}).send(transaction);
          // get transaction receipt by transaction hash
          //listeners.listenToTransactionReceipt(result.hash).then(console.log)
        const receipt = await this.peer.listeners.listenToTransactionReceipt(txRes.hash);
          // set contract address to contract instance
        newContract.options.address = receipt.contractAddress;

        return {"contractAddress":receipt.contractAddress}
    }


    @Post('/call')
    @ContentType("application/json")
    async callContract(@Param("abi") abi: string,@Param("contract") contract:string,@Param("from") from:string){
        const abijson = JSON.parse(abi);
        const con = new this.peer.base.Contract(abijson, contract)
          
          // call method
          // get method is specified by contract through abi
          // contract.methods.myMethod(paramters).call(transaction)
          // get transaction receipt by transaction hash
        const receipt = await con.methods.get().call({from:from})
        
        return receipt
    }

    @Post('/send')
    @ContentType("application/json")
    async sendContract(@Param("abi") abi: string,@Param("contract") contract:string,@Param("from") from:string){
        const abijson = JSON.parse(abi);
        const con = new this.peer.base.Contract(abijson, contract)
        // send method
        // set method is specified by contract through abi
        // contract.methods.myMethod(parameters).send(transaction)
        const receipt = await con.methods.set().send({from:from})
        return receipt
    }
}
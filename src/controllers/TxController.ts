import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';

@JsonController("/tx")
export class TxController {
    peer: any;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }

    @Get('/getbalance/:address')
    @ContentType("application/json")
    async getBalance(@Param("address") address: string) {
        logger.info("get balance address:",address);
        let balance = await this.peer.base.getBalance(address);
        return {"balance":balance};    
    }

    @Get('/gettxcount/:hash')
    @ContentType("application/json")
    async getTransactionCount(@Param("hash") hash: string) {
        let txCount = await this.peer.base.getTransactionCount(hash)
        return {"transactionCount":txCount};    
    }

    @Post('/sign')
    @ContentType("application/json")
    async postSign(@BodyParam("address") address: string,@BodyParam("message") message: string){
        let signMessage = await this.peer.base.sign(message, address);
        return {"signedMessage":signMessage} ;    
    }

    @Post('/send')
    @ContentType("application/json")
    async send(@BodyParam("transaction") transaction: any){
        let sendMessage = await this.peer.base.sendTransaction(transaction);
        return sendMessage ;    
    }

    @Post('/sendtxhash')
    @ContentType("application/json")
    async sendSignedTx(@BodyParam("txhash") txhash: string){
        let sendMessage = await this.peer.base.sendSignedTransaction(txhash);
        return sendMessage ;    
    }

    @Get('/getreceipt/:txhash')
    @ContentType("application/json")
    async getTxReceipt(@Param("txhash") txhash: string) {
        let receipt = await this.peer.base.getTransactionReceipt(txhash);
        return receipt;    
    }

    @Get('/getproof/:txhash')
    @ContentType("application/json")
    async getTxProof(@Param("txhash") txhash: string) {
        let receipt = await this.peer.base.getTransactionProof(txhash);
        return receipt;    
    }

    @Get('/gettx/:txhash')
    @ContentType("application/json")
    async getTx(@Param("txhash") txhash: string) {
        let receipt = await this.peer.base.getTransaction(txhash);
        return receipt;    
    }
  
}
import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';

@JsonController("/chain")
export class ChainController {
    peer: any;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }

    @Get('/peercount')
    @ContentType("application/json")
    async getPeerCount() {
        let peerCount = await this.peer.base.peerCount();
        logger.info(`PEER COUNT : ${peerCount}`);
        return {"peerCount":peerCount} ;    
    }

    @Get('/metadata')
    @ContentType("application/json")
    async getMetaData() {
        let metaData = await this.peer.base.getMetaData();
        return {"metaData":metaData};    
    }

    @Get('/getabi/:contract')
    @ContentType("application/json")
    async getAbi(@Param("contract") contract: string) {
        logger.info("get abi contract address:",contract);
        let abi = await this.peer.base.getAbi(contract, 'latest')
        return {"abi":abi};    
    }

    @Get('/getblock/:index')
    @ContentType("application/json")
    async getBlock(@Param("index") index: number) {
        logger.info("get block index:",index);
        let blockinfo = await this.peer.base.getBlockByNumber(index);
        return {"blockinfo":blockinfo};
    }

    @Get('/getblockbyhash/:hash')
    @ContentType("application/json")
    async getBlockByHash(@Param("hash") hash: string){
        logger.info("get block hash:",hash);
        let blockinfo = await this.peer.base.getBlockByHash(hash);
        return {"blockinfo":blockinfo};
    }

    @Get('/getblocknumber')
    @ContentType("application/json")
    async getBlockNumber(){
        let blockNumber = await this.peer.base.getBlockNumber();
        return {"blockNumber":blockNumber} ;    
    }

    @Post('/getlogs')
    @ContentType("application/json")
    async getLogs(@BodyParam("abi") abi : any,@BodyParam("filter") filter : any){
        // const abi = [
        //     {
        //       indexed: false,
        //       name: '_sender',
        //       type: 'address',
        //     },
        //     {
        //       indexed: false,
        //       name: '_text',
        //       type: 'string',
        //     },
        //     {
        //       indexed: true,
        //       name: '_time',
        //       type: 'uint256',
        //     },
        //   ]
        //   const filter = {
        //     address: '0x35bD452c37d28becA42097cFD8ba671C8DD430a1',
        //     fromBlock: '0x0',
        //   }
       let logs =  await this.peer.base.getLogs(filter, abi);
       return logs
    }

    @Post('/filtermsg')
    @ContentType("application/json")
    async newMsgFilter(@BodyParam("topics") topics: any){
        // const topics = {
        //     topics: ['0x8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3'],
        //   }
        let fileterId = await this.peer.base.newMessageFilter(topics);  
        return {"fileterId":fileterId} ;  
    }

    @Post('/filterblock')
    @ContentType("application/json")
    async newBlockFilter(){
        let fileterId = await this.peer.base.newBlockFilter();
        return {"fileterId":fileterId} ;  
    }

    @Get('/filterchanges/:id')
    @ContentType("application/json")
    async getFilterChanges(@Param("id") id: string){
        let logs = await this.peer.base.getFilterChanges(id)
        return logs ;  
    }

    @Get('/filterlogs/:id')
    @ContentType("application/json")
    async getFilterLogs(@Param("id") id: string){
        let logs = await this.peer.base.getFitlerLogs(id)
        return logs ;  
    }

    @Get('/filterdelete/:id')
    @ContentType("application/json")
    async deleteMessageFilter(@Param("id") id: string){
        let result = await this.peer.base.deleteMessageFilter(id)
        return {"hadDelete":result,"filterId":id} ;  
    }

    @Post('/signtx')
    @ContentType("application/json")
    async signTrsaction(@BodyParam("trasaction") tx: any){
        let result = await this.peer.base.signer(tx);
        return {"signedTrasaction":result} ;  
    }

    
}
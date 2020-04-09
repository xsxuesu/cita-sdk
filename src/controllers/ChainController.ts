import { Controller, Get,Post,Req, Res,Param } from 'routing-controllers';
import * as Swagger from 'swagger-client';
import CITASDK from '@cryptape/cita-sdk'
import * as config from 'config';
import { logger } from '../common/logging';


@Controller("/chain")
export class ChainController {
    peer: any;
    constructor() {
        this.peer = CITASDK(config.get('Peer.Url').toString());
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }

    @Get('/peercount')
    async getPeerCount(@Req() request: any, @Res() response: any): Promise<any> {
        return response.json({"peerCount":this.peer.base.peerCount()}) ;    
    }

    @Get('/metadata')
    async getMetaData(@Req() request: any, @Res() response: any): Promise<any> {
        return response.json({"metaData":this.peer.base.getMetaData()}) ;    
    }

    @Get('/getabi/:contract')
    async getAbi(@Param("contract") contract: string, @Res() response: any): Promise<any> {
        logger.info("get abi contract address:",contract);
        return response.json(this.peer.base.getAbi(contract, 'latest')) ;    
    }


    @Get('/getbalance/:address')
    async getBalance(@Param("address") address: string, @Res() response: any): Promise<any> {
        logger.info("get balance address:",address);
        return response.json(this.peer.base.getBalance(address)) ;    
    }

    @Get('/getblock/:index')
    async getBlock(@Param("index") index: number, @Res() response: any): Promise<any> {
        logger.info("get block index:",index);
        return response.json(this.peer.base.getBlock(index)) ;    
    }
}
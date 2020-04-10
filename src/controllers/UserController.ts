import {Post,BodyParam ,JsonController,ContentType} from 'routing-controllers';
import * as config from 'config';
import * as Peer from '../config/Peer';
import { logger } from '../common/logging';

@JsonController("/personal")
export class Users {
    peer: any;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }

    @Post('/sign')
    @ContentType("application/json")
    async signMessage(@BodyParam("address") address: string,@BodyParam("message") message: string, @BodyParam("password") password: string) {
        let singedMessage = await this.peer.base.personal.sign(message, address,password);
        return {"singedMessage":singedMessage}; 
    }
}
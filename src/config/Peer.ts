import CITASDK from '@cryptape/cita-sdk'
import * as config from 'config';
import { logger } from '../common/logging';

export class Peer {
    peer: any;
    remote:boolean;
    constructor() {
        this.peer = CITASDK(config.get('Peer.Url').toString());
        this.remote = config.get('Remote');
        logger.info("${config.get('Peer.Url').toString()} as connected!");
    }
}

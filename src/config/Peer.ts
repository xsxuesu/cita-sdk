import CITASDK from '@cryptape/cita-sdk'
import * as config from 'config';
import { logger } from '../common/logging';

export class Peer {
    peer: any;
    constructor() {
        this.peer = CITASDK(config.get('Peer.Url').toString());
        logger.info("${config.get('Peer.Url').toString()} as connected!");
    }
}

import { Controller, Get,Post } from 'routing-controllers';
import * as Swagger from 'swagger-client';
import CITASDK from '@cryptape/cita-sdk'
import * as config from 'config';
import { logger } from '../common/logging';

const citaSDK = CITASDK(config.get('Peer.Url').toString());

@Controller("/user")
export class Users {
    client: any;
    constructor() {
        this.client = new Swagger({
            url: 'http://petstore.swagger.io/v2/swagger.json',
            usePromise: true
        });

        logger.info(`client url `,`http://petstore.swagger.io/v2/swagger.json`);
    }

    @Get('/')
    async get(): Promise<any> {
        let client = await this.client;
        let user = await client.user.getUserByName({ username: "user1"});
        return user;        
    }
}
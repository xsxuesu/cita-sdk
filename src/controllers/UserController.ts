import { Controller, Get,Post } from 'routing-controllers';
import * as Swagger from 'swagger-client';
import CITASDK from '@cryptape/cita-sdk'
import * as config from 'config';

const peerUrl = config.get('Peer.Url').toString();
console.log("peerUrl:",peerUrl);
const infolevel = config.get('LogLevel').toString();
console.log("infolevel:",infolevel);


const citaSDK = CITASDK('http://localhost:1337')

@Controller("/user")
export class Users {
    client: any;
    constructor() {
        this.client = new Swagger({
            url: 'http://petstore.swagger.io/v2/swagger.json',
            usePromise: true
        });
    }

    @Get('/')
    async get(): Promise<any> {
        let client = await this.client;
        let user = await client.user.getUserByName({ username: "user1"});
        return user;        
    }
}
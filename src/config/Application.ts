import { ExpressConfig } from './Express';
import { logger } from '../common/logging';
import * as config from 'config';

export class Application {

  server: any;
  express: ExpressConfig;

  constructor()  {
    this.express = new ExpressConfig();
    const http:string = config.get('express.http');
    const port:number = config.get('express.port');
    // const port = "8080";
    this.server = this.express.app.listen(port,http, () => {
      logger.info(`
        ------------
        Server Started!
        Express: http://${http}:${port}
        ------------
      `);
    });
  }
}
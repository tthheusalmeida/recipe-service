import express, { Express } from "express";
import { expressConfig } from "../../config/express";
import router from "../../router";

class Server {
  private app: Express = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(router);
  }

  start() {
    this.initServer();
  }

  private initServer() {
    this.app.listen(expressConfig.port, () => {
      console.log(`Server is running... [PORT:${expressConfig.port}]`);
    });

    this.app;
  }
}

export default Server;

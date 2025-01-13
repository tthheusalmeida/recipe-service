import router from "../../router";
import express, { Express } from "express";
import { expressConfig } from "../../config/express";
import DataBase from "../../database";

class Server {
  private app: Express = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(router);
  }

  start() {
    this.initServer();
    this.initDataBase();
  }

  private initServer() {
    this.app.listen(expressConfig.port, () => {
      console.log(`Server is running... [PORT:${expressConfig.port}]`);
    });

    this.app;
  }

  private async initDataBase() {
    const db = new DataBase();
    await db.connect();
  }
}

export default Server;

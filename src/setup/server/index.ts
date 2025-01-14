import cors from "cors";
import express, { Express } from "express";
import router from "../../router";
import { expressConfig } from "../../config/express";
import DataBase from "../../database";

class Server {
  private app: Express = express();
  private corsOptions: any = {
    origin: expressConfig.corsAllowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-passkey"],
  };

  constructor() {
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(router);
  }

  start() {
    this.initServer();
    this.initDataBase();
  }

  public getApp() {
    return this.app;
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

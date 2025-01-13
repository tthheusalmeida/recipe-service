import mongoose from "mongoose";
import { databaseConfig } from "../config/express";

class DataBase {
  private uri = databaseConfig.uri as string;

  async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log("DB connected!");
    } catch (error) {
      console.error("Error to connect DB:", error);
      process.exit(1);
    }
  }
}

export default DataBase;

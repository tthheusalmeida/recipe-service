import Server from "./server";

class Setup {
  private server: Server;

  constructor() {
    this.server = new Server();
  }

  boot() {
    this.server.start();
  }
}

export default Setup;

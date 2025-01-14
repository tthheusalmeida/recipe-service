import Setup from "./setup";

const app = new Setup();
app.boot();

export default (req: any, res: any) => {
  const expressApp = app["server"].getApp();
  return expressApp(req, res);
};

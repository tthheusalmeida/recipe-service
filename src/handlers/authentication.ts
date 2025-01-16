import { Request, Response, NextFunction } from "express";
import { RESPONSE_STATUS_CODE } from "../utils/constants";
import { expressConfig } from "../config/express";

export function verifyPasskey(req: Request, res: Response, next: NextFunction) {
  const passkey = req.headers["x-passkey"];

  if (!passkey) {
    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      result: "Ausência do [x-passkey]!",
    };

    res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
    return;
  }

  if (passkey !== expressConfig.passkey) {
    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      result: "[x-passkey] inválido!",
    };

    res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json(jsonResult);
    return;
  }

  next();
}

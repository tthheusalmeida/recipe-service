import { Request, Response, NextFunction } from "express";
import { RESPONSE_STATUS_CODE } from "./constants";
import { expressConfig } from "../config/express";

export function verifyPasskey(req: Request, res: Response, next: NextFunction) {
  const passkey = req.headers["x-passkey"];

  if (!passkey) {
    res
      .status(RESPONSE_STATUS_CODE.BAD_REQUEST)
      .json({ mensagem: "Missing passkey" });
    return;
  }

  if (passkey !== expressConfig.passkey) {
    res
      .status(RESPONSE_STATUS_CODE.UNAUTHORIZED)
      .json({ mensagem: "Invalid Passkey" });
    return;
  }

  next();
}

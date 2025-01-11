import { Request, Response } from "express";

export function test(request: Request, response: Response) {
  response.send([]);
}

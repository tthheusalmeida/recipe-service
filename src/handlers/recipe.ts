import { Request, Response, NextFunction } from "express-serve-static-core";
import { RESPONSE_STATUS_CODE } from "../utils/constants";

export function getRecipe(request: Request, response: Response) {
  response.send([
    {
      id: "123",
      name: "barao de dois",
    },
    {
      id: "123",
      name: "barao de dois",
    },
  ]);
}

export function createRecipe(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!request.body) {
    response.sendStatus(RESPONSE_STATUS_CODE.BAD_REQUEST);
  }

  console.log("Body: ", request.body);

  response.sendStatus(RESPONSE_STATUS_CODE.OK);
}

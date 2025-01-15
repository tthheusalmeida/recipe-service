import { Request, Response, NextFunction } from "express-serve-static-core";
import { RESPONSE_STATUS_CODE } from "../utils/constants";
import LoginAttempt from "../models/attempt";
import User from "../models/user";

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 3600 * 1000; // 1 hour in milliseconds

export async function rateLimiterUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ip = req.ip;
    const { email } = req.body;

    let loginAttempt = await LoginAttempt.findOne({ ip });
    if (loginAttempt) {
      const timeSinceLastAttempt =
        Date.now() - new Date(loginAttempt.lastAttempt).getTime();

      if (
        loginAttempt.attempts >= MAX_ATTEMPTS &&
        timeSinceLastAttempt < BLOCK_DURATION
      ) {
        const jsonResult = {
          uri: `${req.baseUrl}${req.url}`,
          error: "Too many login attempts. Please try again after 1 hour.",
        };

        res.status(RESPONSE_STATUS_CODE.TOO_MANY_REQUEST).json(jsonResult);
      }

      if (timeSinceLastAttempt >= BLOCK_DURATION) {
        loginAttempt.attempts = 0;
      }

      loginAttempt.attempts += 1;
      loginAttempt.lastAttempt = new Date();
    } else {
      loginAttempt = new LoginAttempt({
        ip,
        email,
        attempts: 1,
        lastAttempt: new Date(),
      });
    }

    await loginAttempt.save();
    next();
  } catch (error) {
    console.log("❌ Error: ", error);
    next(error);
  }
}

export async function resetLoginAttempts(ip: string, email: string) {
  try {
    await LoginAttempt.findOneAndDelete({ ip, email });
  } catch (error) {
    console.log("❌ Error: ", error);
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("User not find: ", error);
    return null;
  }
}

export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    const isThereUser = user !== null;

    if (!isThereUser) {
      const jsonResult = {
        uri: `${req.baseUrl}${req.url}`,
        error: "User not found",
      };

      res.status(RESPONSE_STATUS_CODE.NOT_FOUND).json(jsonResult);
      next();
      return;
    }

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      message: "Authenticated user",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    };

    const ip = req.ip as string;
    resetLoginAttempts(ip, email);

    res.status(RESPONSE_STATUS_CODE.OK).json(jsonResult);
    next();
  } catch (error) {
    console.log("❌ Error: ", error);
    next(error);
  }
}

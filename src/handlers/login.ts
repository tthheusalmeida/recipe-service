import { Request, Response, NextFunction } from "express-serve-static-core";
import { RESPONSE_STATUS_CODE } from "../utils/constants";
import { sendCodeVerification } from "../utils/nodemailer";
import LoginAttempt from "../models/attempt";
import User from "../models/user";

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 3600 * 1000; // 1 hour in milliseconds
const ONE_MINUTE = 1 * 60 * 1000;

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
          error: "Muitas tentativas de login. Tente novamente após 1 hora.",
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

export async function resetLoginAttempts(ip: string) {
  try {
    await LoginAttempt.findOneAndDelete({ ip });
  } catch (error) {
    console.log("❌ Error: ", error);
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("Usuário não encontrado: ", error);
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
        error: "Usuário não encontrado",
      };

      res.status(RESPONSE_STATUS_CODE.NOT_FOUND).json(jsonResult);
      next();
      return;
    }

    const generateVerificationCode = () => {
      const ramdomNum = Math.floor(Math.random() * 1000000);
      return ramdomNum.toString().padStart(6, "0");
    };

    const verificationCode = generateVerificationCode();

    user["verificationCode"] = verificationCode;
    user["verificationCodeExpiresAt"] = new Date(Date.now() + ONE_MINUTE); // 1 minute

    await sendCodeVerification(user.email, user.name, verificationCode);
    await user.save();

    const ip = req.ip as string;
    await resetLoginAttempts(ip);

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      message: "Usuário autenticado",
      user,
    };

    res.status(RESPONSE_STATUS_CODE.OK).json(jsonResult);
    next();
  } catch (error) {
    console.log("❌ Error: ", error);
    next(error);
  }
}

export async function verifyCodeVerification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user } = req.body;
  if (!user) {
    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Falta usuário.",
    };

    res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
    return;
  }

  if (!user?.email) {
    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Falta e-mail do usuário.",
    };

    res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
    return;
  }

  if (!user?.name) {
    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Falta nome do usuário.",
    };

    res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
    return;
  }

  if (!user?.verificationCode) {
    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Falta código do usuário.",
    };

    res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
    return;
  }

  const { email, verificationCode } = user;
  try {
    const dbUser = await findUserByEmail(email);
    const isThereUser = user !== null;

    if (!isThereUser) {
      const jsonResult = {
        uri: `${req.baseUrl}${req.url}`,
        error: "Usuário não encontrado",
      };

      res.status(RESPONSE_STATUS_CODE.NOT_FOUND).json(jsonResult);
      return;
    }

    const dateNow = new Date().getTime();
    const codeExpiresAt = dbUser?.verificationCodeExpiresAt
      ? new Date(dbUser?.verificationCodeExpiresAt).getTime()
      : new Date(Date.now() + BLOCK_DURATION).getTime();

    if (
      verificationCode !== dbUser?.verificationCode ||
      dateNow > codeExpiresAt
    ) {
      const jsonResult = {
        uri: `${req.baseUrl}${req.url}`,
        error: "Código inválido ou expirado.",
      };

      res.status(RESPONSE_STATUS_CODE.NOT_FOUND).json(jsonResult);
      return;
    }

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      message: "Código válido!",
    };

    res.status(RESPONSE_STATUS_CODE.OK).json(jsonResult);
    return;
  } catch (error) {
    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Código não é válido",
    };

    console.log("❌ Error: ", error);

    res.status(RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR).json(jsonResult);
    return;
  }
}

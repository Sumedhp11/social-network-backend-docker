import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { parse } from "cookie";
import { ErrorHandler } from "../utils/ErrorClass";
import { Socket } from "socket.io";
import { access_token } from "../helpers/constants";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authAccessToken = req.cookies[access_token];

  if (!authAccessToken) {
    return next(
      new ErrorHandler("Authentication token is missing or invalid", 401)
    );
  }

  try {
    const decodedData = jwt.verify(
      authAccessToken,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (!decodedData) {
      return next(new ErrorHandler("Invalid Token", 401));
    }

    const { userId, email } = decodedData;
    req.user = {
      email,
      userId,
    };
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid Token", 401));
  }
};

export const socketAuthMiddleware = async (socket: Socket, next: any) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("Authentication token is missing or invalid"));
    }
    const parsedCookies = parse(cookies);
    const token = parsedCookies[access_token];
    if (!token) return next(new ErrorHandler("Token not Found", 400));
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (!decodedData) {
      return next(new ErrorHandler("Invalid Token", 401));
    }

    const { userId, email } = decodedData;
    socket.data.user = {
      email,
      userId,
    };
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Invalid Token", 401));
  }
};

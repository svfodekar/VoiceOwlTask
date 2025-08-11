import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import util from "../utils/commanUtil";

export interface AuthRequest extends Request { user?: any;}

function jwtAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   throw util.customError("Authorization token is missing", 401);
    // }

    // const token = authHeader.split(" ")[1];
    // const secret = process.env.JWT_SECRET;

    // if (!secret) {
    //   throw util.customError("JWT secret not configured", 500);
    // }

    // const decoded = jwt.verify(token, secret);
    // req.user = decoded;

    next();
  } catch (err) {
    return util.sendResponse(
      res,
      (err as any).statusCode || 401,
      (err as any).message || "Invalid token"
    );
  }
}

export default jwtAuth;
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
// import { pool } from "../db";
import config from "../config";
import dbQuery from "../utility/sqlPool";
import errorResponse from "../utility/errorResponse";

dotenv.config();

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {


      // 1. Check the token
      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({
          success: false,
          messsage: "Unauthorized access!",
        });
      }

      // 2. Verify token
      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;


      // 3. Find the user into database
      const userData = await dbQuery(
        `
        SELECT * FROM users WHERE id=$1
        
    `,
        [decoded.id],
      );

      const user = userData.rows[0];

      // console.log("authuser",user);

      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          messsage: "User not found !!!",
        });
      }


      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          messsage: "Forbidden Access!",
        });
      }


      next();
    } catch (error: unknown) {
    errorResponse(res, error);
  }
  };
};
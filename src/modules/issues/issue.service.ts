import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db"
import type { Request, Response } from "express"
// import type { Issue } from "./issue.interface";

const createIssueIntoDB = async(req: Request, res: Response) => {
    
    const {title, description , type} = req.body ; 

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
      // console.log(decoded)

      // 3. Find the user into database
      const userData = await pool.query(
        `
        SELECT * FROM users WHERE id=$1
        
    `,
        [decoded.id],
      );
    const user = await pool.query(`
        SELECT * FROM   users WHERE id=$1
    `,[ decoded.id])

    if (user.rows.length === 0) {
        throw new Error("User does not exist")
    }
    const result = await pool.query(`
        INSERT INTO issues(title, description , type, reporter_id) VALUES($1,$2,$3, $4)
        RETURNING *
    `,
    [title, description , type, decoded.id ]
    )
    return result
}



export const issueService = {
    createIssueIntoDB
}
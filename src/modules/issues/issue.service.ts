import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import type { IQUery } from "./issue.interface";
import dbQuery from "../../utility/sqlPool";

const createIssueIntoDB = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;

  const token = req.headers.authorization;

  // 2. Verify token
  const decoded = jwt.verify(
    token as string,
    config.secret as string,
  ) as JwtPayload;

  // 3. Find the user into database

  const user = await dbQuery(
    `
        SELECT * FROM   users WHERE id=$1
    `,
    [decoded.id],
  );

  if (user.rows.length === 0) {
    throw new Error("User does not exist");
  }
  const result = await  dbQuery(
    `
        INSERT INTO issues(title, description , type, reporter_id) VALUES($1,$2,$3, $4)
        RETURNING *
    `,
    [title, description, type, decoded.id],
  );
  return result;
};

const getAllIssuesFromDB = async (query: IQUery) => {

  const { sort = "newest", type, status } = query;

  let sql = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }


  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }


  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }


  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const result = await dbQuery(sql, values);

  return result;
};





const getSingleIssueFromDB = async (
  id: string,
  req: Request,
  res: Response,
) => {
    // 1. Get token
  const token = req.headers.authorization;

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

  const result = await dbQuery(
    `
            SELECT * FROM issues WHERE id=$1
        `,
    [id],
  );

  const reporterID = result.rows[0].reporter_id;

  const reporterData = await dbQuery(
    `
        SELECT * FROM users WHERE id=$1
        
        `,
    [reporterID],
  );

  const userInfo = userData.rows[0];
  if (userInfo.id === decoded.id || decoded.role === "maintainer") {
    return {
      result,
      reporterData,
    };
  } else {
    sendResponse(res, {
      statusCode: 403,
      success: false,
      message: "Forbidden Access!",
    });
  }
};

const updateIssueFromDB = async (id: string, req: Request, res: Response) => {
  const { title, description, type, status } = req.body;
    // 1. get toket
  const token = req.headers.authorization;

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

  const updatedIssue = await dbQuery(
    `
            SELECT * FROM issues WHERE id=$1
        `,
    [id],
  );

  if (
    userData.rows.length !== 0 &&
    userData.rows[0].id === updatedIssue.rows[0].reporter_id &&
    updatedIssue.rows[0].status === "open" && 
    userData.rows[0].role === "contributor"
  ) {
    const result = await dbQuery(
      `
            UPDATE  issues 
            SET 
            title=COALESCE($1,title), 
            description=COALESCE($2,description),
            type= COALESCE($3,type),
            status=COALESCE($4,status),
            updated_at= NOW()
            WHERE  id=$5
            RETURNING *
        `,
      [title, description, type, status, id],
    );
    return result;
  } else if (
    userData.rows.length !== 0 &&
    userData.rows[0].role === "maintainer"
  ) {
    const result = await dbQuery(
      `
            UPDATE  issues 
            SET 
            title=COALESCE($1,title), 
            description=COALESCE($2,description),
            type= COALESCE($3,type),
            status=COALESCE($4,status),
            updated_at= NOW()
            WHERE  id=$5
            RETURNING *
        `,
      [title, description, type, status, id],
    );
    return result;
  } else {
    sendResponse(res, {
      statusCode: 403,
      success: false,
      message: "Forbidden Access!",
    });
  }
};

const deleteIssuesFromDB = async (id: string, req: Request, res: Response) => {
  const token = req.headers.authorization;

  // 2. Verify token
  const decoded = jwt.verify(
    token as string,
    config.secret as string,
  ) as JwtPayload;

  if (decoded.role === "maintainer") {
    const result = await dbQuery(
      `
        DELETE FROM issues WHERE id=$1
    `,
      [id],
    );
    return result;
  } else {
    sendResponse(res, {
      statusCode: 403,
      success: false,
      message: "Forbidden Access!",
    });
  }
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssuesFromDB
};

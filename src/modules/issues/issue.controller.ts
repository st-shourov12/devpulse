import type { Request, Response } from "express";

import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";
import errorResponse from "../../utility/errorResponse";
// import { pool } from "../../db";
import dbQuery from "../../utility/sqlPool";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDB(req, res);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",

      data: result.rows[0],
    });
  } catch (error: unknown) {
    errorResponse(res, error);
  }
};

const getAllIsssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);

    const rowResult = await Promise.all(
      result.rows.map(async (i) => {
        const reporterResult = await dbQuery(
          `
        SELECT id, name, role
        FROM users
        WHERE id = $1
      `,
          [i.reporter_id],
        );

        return {
          id: i.id,
          title: i.title,
          description: i.description,
          type: i.type,
          status: i.status,

          reporter: reporterResult.rows[0],

          created_at: i.created_at,
          updated_at: i.updated_at,
        };
      }),
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: rowResult
    });
  } catch (error: unknown) {
    errorResponse(res, error);
  }
};

const getSingleIssues = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.getSingleIssueFromDB(
      id as string,
      req,
      res,
    );

    if (result?.result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found",
      });
    }

    const issueData = {
      id: result?.result.rows[0].id,
      title: result?.result.rows[0].title,
      description: result?.result.rows[0].description,
      type: result?.result.rows[0].type,
      status: result?.result.rows[0].status,
      reporter: {
        id: result?.reporterData.rows[0].id,
        name: result?.reporterData.rows[0].name,
        role: result?.reporterData.rows[0].role,
      },
      created_at: result?.result.rows[0].created_at,
      updated_at: result?.result.rows[0].updated_at,
    };
    sendResponse(res, {
      statusCode: 200,
      success: true,

      data: issueData,
    });
  } catch (error: unknown) {
    errorResponse(res, error);
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await issueService.updateIssueFromDB(id as string, req, res);

    if (result?.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue Not Found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result?.rows[0],
    });
  } catch (error: unknown) {
    errorResponse(res, error);
  }
};

const deleteIssues = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await issueService.deleteIssuesFromDB(
      id as string,
      req,
      res,
    );

    if (result?.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issues Not Found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: unknown) {
    errorResponse(res, error);
  }
};

export const issueController = {
  createIssue,
  getAllIsssue,
  getSingleIssues,
  updateIssue,
  deleteIssues,
};

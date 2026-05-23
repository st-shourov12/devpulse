import type { Request, Response } from "express";

import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  try {
    // const request = [req.body, req.headers]
    const result = await issueService.createIssueIntoDB(req, res);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",

      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllIsssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIsssuesFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users Retrive successfully",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
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
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
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
        message: "User Not Found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result?.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
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
    res.status(204).json({
      success: true,
      message: "Issue deleted successfully",
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIsssue,
  getSingleIssues,
  updateIssue,
  deleteIssues,
};

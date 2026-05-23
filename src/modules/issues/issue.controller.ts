import type { Request, Response } from "express";

import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  try {
    // const request = [req.body, req.headers]
    const result = await issueService.createIssueIntoDB(req , res)
    
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
    
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }

}

export const issueController = {
  createIssue,
  getAllIsssue,
};
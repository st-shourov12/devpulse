
import type { Response } from "express";
import sendResponse from "./sendResponse";

const errorResponse = (res :Response, error : unknown) => {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
      error,
    });
}

export default errorResponse;
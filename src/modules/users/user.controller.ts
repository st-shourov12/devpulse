import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { userService } from "./user.service";

const creatUser = async (req: Request, res: Response) => {
  const { name, email, password, created_at, updated_at } = req.body;

  try {
    const result = await userService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: `User registered successfully`,

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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();
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

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string);

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found",
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users Retrive successfully",
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

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, role, updated_at } = req.body;

  try {
    const result = await userService.updateUserFromDB(req.body, id as string);

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUserFromDB(id as string);

    if (result.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found",
      });
    }
    res.status(204).json({
      success: true,
      message: "User deleted successfully",
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

export const userController = {
  creatUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};

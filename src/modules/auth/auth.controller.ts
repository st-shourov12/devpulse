import type { Request, Response } from "express";
import { authService } from "./auth.service";
import errorResponse from "../../utility/errorResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    const { refreshToken, user, accessToken } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });

    delete user.password;
    const resData = {
      token: result.accessToken,
      user: user,
    };

    res.status(200).json({
      success: true,
      message: `Login successful`,

      data: resData,
    });
  } catch (error: unknown) {
    errorResponse(res, error)
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateRefreshToken(
      req.cookies.refreshToken,
    );

    // const {refreshToken} = result ;
    // res.cookie("refreshToken", refreshToken, {
    //   secure : false,
    //   httpOnly : true,
    //   sameSite : 'lax'

    // })

    res.status(200).json({
      success: true,
      message: `Access Token genarated`,

      data: result,
    });
  } catch (error: unknown) {
    errorResponse(res, error);
  }
};

export const authController = {
  loginUser,
  refreshToken,
};

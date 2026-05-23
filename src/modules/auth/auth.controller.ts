import type { Request, Response } from "express"
import { authService } from "./auth.service";

const loginUser = async (req : Request, res : Response) => {
    try {
        const result = await authService.loginUserIntoDB(req.body);

        const {refreshToken,user,accessToken} = result ;
        res.cookie("refreshToken", refreshToken, {
          secure : false,
          httpOnly : true,
          sameSite : 'lax'

        })

        
        delete user.password;
        const resData = {
          token : result.accessToken,
          user : user

        }



        res.status(200).json({
          success : true,
          message: `Login successful`,
    
          data: resData,
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          message: error.message,
          error: error,
        });
      }
}


const refreshToken = async (req : Request, res : Response) => {
  try {
        const result = await authService.generateRefreshToken(req.cookies.refreshToken);

        // const {refreshToken} = result ;
        // res.cookie("refreshToken", refreshToken, {
        //   secure : false,
        //   httpOnly : true,
        //   sameSite : 'lax'

        // })



        res.status(200).json({
          success : true,
          message: `Access Token genarated`,
    
          data: result,
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          message: error.message,
          error: error,
        });
      }
}

export const authController = {
    loginUser,
    refreshToken,
  
}
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import config from "../../config";
import dbQuery from "../../utility/sqlPool";


const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await  dbQuery(
    `
        SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  

  if (userData.rows.length === 0) {
    throw new Error("Invalid Cridential!");
  }
  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Wrong Password!");
  }
  // console.log(matchPassword);

  // generate token

  const jwtPayload = {
    id: user?.id,
    name: user?.name,
    
    role: user?.role
  };

  const secret = config.secret;
  const refreshSecret = config.refresh_secret;

  const accessToken = jwt.sign(jwtPayload, secret as string, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtPayload, refreshSecret as string, {
    expiresIn: "1d",
  });
  // console.log(accessToken);


  return { accessToken, refreshToken , user };
};

const generateRefreshToken = async (token: string) => {
  try {
    // 1. check the token

    if (!token) {
      throw new Error("Unauthorized");
    }

    // 2. Verify token
    const decoded = jwt.verify(
      token as string,
      process.env.JSONSECRET as string,
    ) as JwtPayload;




    // 3. Find the user into database
    const userData = await  dbQuery(
      `
            SELECT * FROM users WHERE email=$1
            
        `,
      [decoded.email],
    );
    delete userData.rows[0].password ;

    const user = userData.rows[0];

    console.log(user);

    if (userData.rows.length === 0) {
      throw new Error("User Not Found");
    }
   
    

    const jwtPayload = {
      id: user?.id,
      name: user?.name,
      
      role: user?.role,
    };

    // const secret = process.env.JSONSECRET;
    const refreshSecret = config.refresh_secret;

    const accessToken = jwt.sign(jwtPayload, refreshSecret as string, {
      expiresIn: "1d",
    });

    return accessToken
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const authService = {
  loginUserIntoDB,
  generateRefreshToken,
};
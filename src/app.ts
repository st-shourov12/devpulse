import express, {
  type Application,
  type Request,
  type Response,
} from "express";


import cors from 'cors'
import { userRoute } from "./modules/users/user.route";
import { issueRoute } from "./modules/issues/issue.route";
import { authRoute } from "./modules/auth/auth.route";
import { logger } from "./middleware/logger";



const app: Application = express();


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);


const corsOptions = {
  origin : "http://localhost:3000",
  optionSuccessStatus : 200
}
app.use(cors(corsOptions))


app.get("/", (req: Request, res: Response) => {

  res.status(200).json({
    message: "Devpulse server",
    author: "Shourov",
  });
});


app.use('/api', userRoute);
app.use('/api/issues', issueRoute);
app.use('/api/auth', authRoute)



export default app;
import express, {
  type Application,
  type Request,
  type Response,
} from "express";


import cors from 'cors'
import { userRoute } from "./modules/users/user.route";
import { issueRoute } from "./modules/issues/issue.route";



const app: Application = express();


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
  origin : "http://localhost:5000",
  optionSuccessStatus : 200
}
app.use(cors(corsOptions))


app.get("/", (req: Request, res: Response) => {

  res.status(200).json({
    message: "Express server",
    author: "Shourov",
  });
});


app.use('/api', userRoute);
app.use('/api/issues', issueRoute);



export default app;
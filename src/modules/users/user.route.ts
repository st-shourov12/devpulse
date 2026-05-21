import {Router} from "express"
import { userController } from "./user.controller";

const router = Router();

router.post("/auth/signup", userController.creatUser)

router.get("/users" , userController.getAllUsers)

router.get("/users/:id" , userController.getSingleUser);

router.put("/users/:id", userController.updateUser);

router.delete("/users/:id", userController.deleteUser)


export const userRoute = router
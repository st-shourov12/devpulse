import {Router} from "express"
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { URole } from "../../type/user.type";

const router = Router();

router.post("/auth/signup", userController.creatUser)

router.get("/users" ,auth(URole.contributor, URole.maintainer), userController.getAllUsers)

router.get("/users/:id" ,auth(URole.contributor, URole.maintainer), userController.getSingleUser);

router.put("/users/:id",auth(URole.maintainer), userController.updateUser);

router.delete("/users/:id", auth(URole.maintainer), userController.deleteUser)


export const userRoute = router
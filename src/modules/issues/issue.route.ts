import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth";
import { URole } from "../../type/user.type";

const router = Router()

router.post('/',auth(URole.contributor, URole.maintainer), issueController.createIssue)
router.get('/', auth(URole.contributor, URole.maintainer), issueController.getAllIsssue)
router.get('/:id', auth(URole.contributor, URole.maintainer), issueController.getSingleIssues )

export const issueRoute = router
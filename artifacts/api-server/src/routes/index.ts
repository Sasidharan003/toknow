import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import lawsRouter from "./laws";
import schemesRouter from "./schemes";
import servicesRouter from "./services";
import complaintsRouter from "./complaints";
import newsRouter from "./news";
import chatRouter from "./chat";
import documentsRouter from "./documents";
import learningRouter from "./learning";
import bookmarksRouter from "./bookmarks";
import authRouter from "./auth";
import lawyersRouter from "./lawyers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(lawsRouter);
router.use(schemesRouter);
router.use(servicesRouter);
router.use(complaintsRouter);
router.use(newsRouter);
router.use(chatRouter);
router.use(documentsRouter);
router.use(learningRouter);
router.use(bookmarksRouter);
router.use(authRouter);
router.use(lawyersRouter);

export default router;

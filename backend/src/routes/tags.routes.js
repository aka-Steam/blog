import { Router } from "express";
import { PostController } from "../controllers/index.js";

const router = Router()

router.get('/', PostController.getLastTags);

export { router }

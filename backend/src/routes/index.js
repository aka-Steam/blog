import { Router } from "express";

import { router as UserRouter } from './user.routes.js';
import { router as PostRouter } from './post.routes.js';
import { router as TagsRouter } from './tags.routes.js'

const router = Router();

router.use('/auth', UserRouter);
router.use('/posts', PostRouter);
router.use('/tags', TagsRouter);

export { router }
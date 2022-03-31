import Router from 'koa-router';
const router = new Router();

import {isReady, isLive} from './service';

router.head("/ready", isReady);
router.head("/live", isLive);

export { router };


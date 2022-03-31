/* eslint-disable @typescript-eslint/no-var-requires */

import * as Router from "koa-router";

export class RouteMapper {
  
  constructor(private rootRouter: Router, public basePath: string = "../features"){}

  addRouter(path: string, feature: string) {
    const router = require(`${this.basePath}/${feature}/router`);
    this.rootRouter.use(path, router);
  }

}

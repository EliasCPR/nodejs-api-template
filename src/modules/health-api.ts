/* eslint-disable @typescript-eslint/no-explicit-any */
import Koa from "koa";
import Router from "koa-router";

import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import favicon from 'koa-favicon';
import cors  from '@koa/cors';

import { Next, Context } from "koa";

import { RouteMapper } from "../utils/route-mapper";
import Bootable from "../utils/bootable";
import ConfigHandler from "../utils/config-handler";
import Logger from "./logger";

export default class LiveReadinessApi implements Bootable {

  config: ConfigHandler;
  logger: Logger;

  async boot(){

    return new Promise<any>((resolve, reject) => {
      const app = new Koa();
      const rootRouter = new Router();
      
      const PORT = this.config.contents.HEALTH_PORT || process.env.HEALTH_PORT || process.env.health_port || 3001;
      
      const routeMapper = new RouteMapper(rootRouter, "..");
  
      routeMapper.addRouter("/health", "healthcheck");
      
      app
        .use(cors())
        .use(async (ctx: Context, next: Next) => {
          ctx.config = this.config.contents;
          await next();
        })
        .use(async (ctx: Context, next: Next) => {
          ctx.log = this.logger;
          await next();
        })
        .use(favicon())
        .use(json())
        .use(logger())
        .use(bodyParser())
        .use(rootRouter.routes())
        .use(rootRouter.allowedMethods())
      
      app.on('error', (e) => {
        reject(e);
      });
      
      try {
        const server = app.listen(PORT);
        server.on('error', (e) => {
          reject(e);
        });
        server.on('listening', () => {
          console.log("Healthcheck API listening on port", PORT);
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  
}

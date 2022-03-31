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

import {readdirSync} from 'fs';
import Logger from "./logger";
import Mongoose from "./mongoose";

import AuthMiddleware from "./auth-middleware";

const amw = new AuthMiddleware();

export default class FeatureApi implements Bootable {

  config: ConfigHandler;
  koaApp: Koa = new Koa();
  logger: Logger;
  mongoose: Mongoose;

  async boot(){
    const PORT = this.config.contents.PORT || process.env.PORT || process.env.port || 3000;

    const {
      autoDiscoveryFeatures, 
      autoDiscoveryFeaturesBasePath, 
      routes} = this.config.contents.featureApi || {};

    const { baseUri } = this.config.contents.featureApi || "";
    
    return new Promise<any>((resolve, reject) => {
      const rootRouter = new Router({prefix: baseUri});
      const routeMapper = new RouteMapper(rootRouter);

      if( autoDiscoveryFeatures ) {
        const featuresBasePath = autoDiscoveryFeaturesBasePath || './src/features';
        readdirSync(featuresBasePath, {withFileTypes: true})
          .filter(e => e.isDirectory())
          .map(d => d.name)
          .forEach(feature => {
            console.log(`[Feature API] Auto adding feature '${feature}' on path '${baseUri}/${feature}'`);
            routeMapper.addRouter(`/${feature}`, feature)
          });
      }
      
      
      routes && routes.forEach(route => {
        console.log(`[Feature API] Adding route '${route.name}' on path '${baseUri}/${route.path}'`);
        routeMapper.addRouter(route.path, route.name);
      });
      
      this.koaApp
        .use(logger())
        .use(cors())
        .use(amw.mw())
        .use(async (ctx: Context, next: Next) => {
          ctx.config = this.config.contents;
          await next();
        })
        .use(async (ctx: Context, next: Next) => {
          ctx.log = this.logger;
          await next();
        })
        .use(async (ctx: Context, next: Next) => {
          ctx.mongoose = this.mongoose;
          await next();
        })
        .use(favicon())
        .use(json())
        .use(bodyParser())
        .use(rootRouter.routes())
        .use(rootRouter.allowedMethods());
      
      try {
        this.koaApp.on('error', (e) => {
          console.error("Unable to process request", e);
        });
        
        const server = this.koaApp.listen(PORT);
        server.on('error', (e) => {
          reject(e);
        });
        server.on('listening', () => {
          console.log("Feature API listening on port", PORT);
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  
}

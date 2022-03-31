import { Context, Next } from "koa";
import ConfigHandler from "../utils/config-handler";
import { readFileSync } from "fs";
import { verify } from "jsonwebtoken";

export default class AuthMiddleware {
  config: ConfigHandler;
  privateKey: string;
  allowedPaths: Array<{ method: string; path: string }>;

  constructor() {
    this.privateKey = readFileSync("./config/private.key").toString();
    this.allowedPaths = [{ method: "POST", path: "/nodejs-api-template/auth" }];
  }

  mw() {
    const pk = this.privateKey;
    const isAllowed = (method: string, path: string) =>
      this.allowedPaths.filter(
        (a) => a.method === method && a.path === path
      ).length > 0;

    return async (ctx: Context, next: Next) => {
      if ( !isAllowed(ctx.method, ctx.path) ){
        const jwt = ctx.headers.authorization?.split(" ")[1];
        try {
          const payload = verify(jwt, pk);
          ctx.user = payload;
        } catch (e) {
          ctx.status = 401;
          return;
        }  
      } else {
        console.log("Auth bypassed", ctx.method, ctx.path);
      }

      await next();
    };
  }

}

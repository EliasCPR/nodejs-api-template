import { Next, Context } from "koa";

export async function isLive(ctx: Context, next: Next) {
  ctx.status = 200;
  await next();
}

export async function isReady(ctx: Context, next: Next) {
  ctx.status = 200;
  await next();
}

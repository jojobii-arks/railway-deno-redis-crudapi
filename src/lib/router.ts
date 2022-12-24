import { Application, createHttpError, isHttpError } from "~oak/mod.ts";
import { Router } from "~oak/mod.ts";
import { z, ZodError } from "~zod/mod.ts";
import redis from "$lib/clients/redis.ts";
import castJson from "$lib/utils/castJson.ts";

const router = new Router()
  .get("/", async ({ response }) => {
    response.body = await redis.smembers("notes");
  })
  .post("/", async ({ request, response }) => {
    const body = await castJson(request);

    const { note } = z.object({
      note: z.string().min(1, "required"),
    }).parse(body);

    const status = await redis.sadd("notes", note);
    switch (status) {
      case 1:
        response.body = { message: `note added: '${note}'` };
        break;
      case 0:
        throw createHttpError(409, `note already exists: '${note}'`);
    }
  })
  .delete("/", async ({ request, response }) => {
    const body = await castJson(request);

    const { note } = z.object({
      note: z.string().min(1, "required"),
    }).parse(body);

    const status = await redis.srem("notes", note);
    switch (status) {
      case 1:
        response.body = { message: `note removed: '${note}'` };
        break;
      case 0:
        throw createHttpError(404, `note doesn't exist: '${note}'`);
    }
  });

export const init = (app: Application) => {
  app.use(async (context, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof ZodError) {
        context.response.body = { error: err };
        context.response.status = 400;
      } else if (isHttpError(err)) {
        context.response.body = { error: err.message };
        context.response.status = err.status;
      } else {
        context.response.body = { error: err.message };
        context.response.status = 500;
      }
      context.response.type = "json";
    }
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
};

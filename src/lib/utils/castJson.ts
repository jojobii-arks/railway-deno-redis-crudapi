import { createHttpError } from "~oak/mod.ts";
import type { Request } from "~oak/mod.ts";

/**
 * Cast the body of a request as JSON.
 * @param request
 * @returns parsed JSON input from request
 *
 * @example
 *
 * ```
 * new Router()
 *   .post(async {request, response} => {
 *     const body = await castJson(request);
 *     response.body = { message: `message received! ${body.message}`}
 *   })
 * ```
 */
export default async function castJson(request: Request) {
  try {
    /** Check if Content-Type header is set correctly. */
    const contentType = request.headers.get("Content-Type") ?? "";
    if (!contentType.includes("json")) {
      throw createHttpError(415, "Expecting JSON Content-Type");
    }

    return await request.body({ type: "json" }).value;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw createHttpError(
        400,
        `Invalid JSON Syntax - ${error.message}`,
      );
    } else throw error;
  }
}

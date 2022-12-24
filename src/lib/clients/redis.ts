import "dotenv";
import { connect } from "redis/mod.ts";

const env = Deno.env.toObject();
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = env;

/** Check environment for required variables. */
if (
  REDIS_HOST === undefined ||
  REDIS_PORT === undefined ||
  REDIS_PASSWORD === undefined
) {
  const attemptedEnv = {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
  };
  console.log(attemptedEnv);
  throw new Error(`Environment Variables are not properly configured.`, {
    cause: attemptedEnv,
  });
}

console.log("Connecting to Redis Server...");

const redis = await connect(
  {
    hostname: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
);

await redis.ping().then(() => console.log("Connection to Redis Successful!"));

export default redis;

import "~dotenv";
import { connect } from "~redis/mod.ts";

const env = Deno.env.toObject();
const { REDISHOST, REDISPORT, REDISPASSWORD } = env;

/** Check environment for required variables. */
if (
  REDISHOST === undefined ||
  REDISPORT === undefined ||
  REDISPASSWORD === undefined
) {
  const attemptedEnv = {
    REDISHOST,
    REDISPORT,
    REDISPASSWORD,
  };
  console.log(attemptedEnv);
  throw new Error(`Environment Variables are not properly configured.`, {
    cause: attemptedEnv,
  });
}

console.log("Connecting to Redis Server...");

const redis = await connect(
  {
    hostname: REDISHOST,
    port: REDISPORT,
    password: REDISPASSWORD,
  },
);

await redis.ping().then(() => console.log("Connection to Redis Successful!"));

export default redis;

import redis from "./lib/clients/redis.ts";

console.log(
  await redis.ping(),
);

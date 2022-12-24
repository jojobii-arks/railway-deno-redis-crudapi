import "~dotenv";
import { Application } from "~oak/mod.ts";
import { init } from "$lib/router.ts";

const app = new Application();
init(app);

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ??
        "localhost"
    }:${port}`,
  );
});

await app.listen({
  port: Number(Deno.env.get("PORT")) ?? 3000,
});

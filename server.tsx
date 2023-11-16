import Fastify from "fastify";
import React from "react";

import { App } from "./app/App.tsx";
import { renderToPipeableStream } from "react-dom/server";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async function handler(request, reply) {
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady: () => {
      reply.raw.writeHead(200, {
        "Content-Type": "text/html",
      });

      pipe(reply.raw);
    },
  });

  return reply;
});

const run = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

run();

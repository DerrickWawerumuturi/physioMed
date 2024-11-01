import express from "express";
import { getPayloadClient } from "./get-payload";
import nextBuild from "next/dist/build";
import { nextApp, nextHandler } from "./next-utils";
import path from "path";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import bodyParser from "body-parser";
import { inferAsyncReturnType } from "@trpc/server";


const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
    },
  });

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));
      process.exit();
    });
    return;
  }
  app.use((req, res) => nextHandler(req, res));
  
  nextApp.prepare().then(() => {
    app.use((req, res) => nextHandler(req, res));
  });
};

start();

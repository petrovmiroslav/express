import { Config } from "./constants/config";
import express, { Express } from "express";
import { router } from "./routes/router";

const app: Express = express();

const port = Config.PORT;

app.use(router);

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
